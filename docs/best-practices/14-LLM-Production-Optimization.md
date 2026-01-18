# LLM Production Optimization: Cost, Latency, and Accuracy Techniques

## Overview

This document covers production optimization techniques for LLM-powered applications, including semantic caching for cost reduction, prompt engineering for accuracy, and architectural patterns for efficient inference.

---

## 1. Semantic Caching

### 1.1 The Problem with Exact-Match Caching

Traditional caching uses query text as the cache key:

```python
cache_key = hash(query_text)
if cache_key in cache:
    return cache[cache_key]
```

This approach captures only **18%** of redundant calls. Users ask the same questions differently:
- "What's your return policy?"
- "How do I return something?"
- "Can I get a refund?"

Each generates nearly identical responses but bypasses exact-match cache.

**Analysis of 100,000 production queries:**
- 18% exact duplicates
- 47% semantically similar (same intent, different wording)
- 35% genuinely novel

That 47% represents massive cost savings missed by traditional caching.

### 1.2 Semantic Caching Architecture

Replace text-based keys with embedding-based similarity lookup:

```python
class SemanticCache:
    def __init__(self, embedding_model, similarity_threshold=0.92):
        self.embedding_model = embedding_model
        self.threshold = similarity_threshold
        self.vector_store = VectorStore()  # FAISS, Pinecone, etc.
        self.response_store = ResponseStore()  # Redis, DynamoDB, etc.

    def get(self, query: str) -> Optional[str]:
        """Return cached response if semantically similar query exists."""
        query_embedding = self.embedding_model.encode(query)

        # Find most similar cached query
        matches = self.vector_store.search(query_embedding, top_k=1)

        if matches and matches[0].similarity >= self.threshold:
            cache_id = matches[0].id
            return self.response_store.get(cache_id)

        return None

    def set(self, query: str, response: str):
        """Cache query-response pair."""
        query_embedding = self.embedding_model.encode(query)
        cache_id = generate_id()

        self.vector_store.add(cache_id, query_embedding)
        self.response_store.set(cache_id, {
            'query': query,
            'response': response,
            'timestamp': datetime.utcnow()
        })
```

### 1.3 Threshold Tuning by Query Type

The similarity threshold is critical. Set too high = missed cache hits. Set too low = wrong responses.

**Example of threshold too low (0.85):**
- Query: "How do I cancel my subscription?"
- Cached: "How do I cancel my order?"
- Similarity: 0.87
- **Problem**: Different questions, different answers

**Optimal thresholds by query type:**

| Query Type | Threshold | Rationale |
|------------|-----------|-----------|
| FAQ-style questions | 0.94 | High precision needed; wrong answers damage trust |
| Product searches | 0.88 | More tolerance for near-matches |
| Support queries | 0.92 | Balance between coverage and accuracy |
| Transactional queries | 0.97 | Very low tolerance for errors |

**Adaptive implementation:**

```python
class AdaptiveSemanticCache:
    def __init__(self):
        self.thresholds = {
            'faq': 0.94,
            'search': 0.88,
            'support': 0.92,
            'transactional': 0.97,
            'default': 0.92
        }
        self.query_classifier = QueryClassifier()

    def get_threshold(self, query: str) -> float:
        query_type = self.query_classifier.classify(query)
        return self.thresholds.get(query_type, self.thresholds['default'])

    def get(self, query: str) -> Optional[str]:
        threshold = self.get_threshold(query)
        query_embedding = self.embedding_model.encode(query)
        matches = self.vector_store.search(query_embedding, top_k=1)

        if matches and matches[0].similarity >= threshold:
            return self.response_store.get(matches[0].id)

        return None
```

### 1.4 Threshold Tuning Methodology

**Step 1: Sample Query Pairs**
Sample 5,000 query pairs at various similarity levels (0.80-0.99).

**Step 2: Human Labeling**
Annotators label each pair as "same intent" or "different intent". Use 3 annotators per pair with majority vote.

**Step 3: Compute Precision/Recall Curves**

```python
def compute_precision_recall(pairs, labels, threshold):
    """Compute precision and recall at given similarity threshold."""
    predictions = [1 if pair.similarity >= threshold else 0 for pair in pairs]

    true_positives = sum(1 for p, l in zip(predictions, labels) if p == 1 and l == 1)
    false_positives = sum(1 for p, l in zip(predictions, labels) if p == 1 and l == 0)
    false_negatives = sum(1 for p, l in zip(predictions, labels) if p == 0 and l == 1)

    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0

    return precision, recall
```

**Step 4: Select Threshold Based on Cost of Errors**
- FAQ queries (trust-sensitive): Optimize for precision (0.94 threshold → 98% precision)
- Search queries (cost-sensitive): Optimize for recall (0.88 threshold)

### 1.5 Cache Invalidation Strategies

**Time-Based TTL:**
```python
TTL_BY_CONTENT_TYPE = {
    'pricing': timedelta(hours=4),      # Changes frequently
    'policy': timedelta(days=7),         # Changes rarely
    'product_info': timedelta(days=1),   # Daily refresh
    'general_faq': timedelta(days=14),   # Very stable
}
```

**Event-Based Invalidation:**
```python
class CacheInvalidator:
    def on_content_update(self, content_id: str, content_type: str):
        """Invalidate cache entries related to updated content."""
        affected_queries = self.find_queries_referencing(content_id)

        for query_id in affected_queries:
            self.cache.invalidate(query_id)

        self.log_invalidation(content_id, len(affected_queries))
```

**Staleness Detection:**
```python
def check_freshness(self, cached_response: dict) -> bool:
    """Verify cached response is still valid."""
    # Re-run the query against current data
    fresh_response = self.generate_response(cached_response['query'])

    # Compare semantic similarity of responses
    cached_embedding = self.embed(cached_response['response'])
    fresh_embedding = self.embed(fresh_response)

    similarity = cosine_similarity(cached_embedding, fresh_embedding)

    # If responses diverged significantly, invalidate
    if similarity < 0.90:
        self.cache.invalidate(cached_response['id'])
        return False

    return True
```

### 1.6 Latency Overhead Analysis

| Operation | Latency (p50) | Latency (p99) |
|-----------|---------------|---------------|
| Query embedding | 12ms | 28ms |
| Vector search | 8ms | 19ms |
| Total cache lookup | 20ms | 47ms |
| LLM API call | 850ms | 2400ms |

The 20ms overhead is negligible compared to 850ms LLM calls avoided on cache hits.

**Net Effect at 67% Hit Rate:**
- Before: 100% × 850ms = 850ms average
- After: (33% × 870ms) + (67% × 20ms) = 300ms average
- **65% latency improvement**

### 1.7 Production Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Cache hit rate | 18% | 67% | +272% |
| LLM API costs | $47K/month | $12.7K/month | **-73%** |
| Average latency | 850ms | 300ms | -65% |
| False-positive rate | N/A | 0.8% | Acceptable |
| Customer complaints | Baseline | +0.3% | Minimal |

### 1.8 What NOT to Cache

```python
def should_cache(self, query: str, response: str) -> bool:
    """Determine if response should be cached."""
    # Don't cache personalized responses
    if self.contains_personal_info(response):
        return False

    # Don't cache time-sensitive information
    if self.is_time_sensitive(query):
        return False

    # Don't cache transactional confirmations
    if self.is_transactional(query):
        return False

    return True
```

---

## 2. Prompt Repetition Technique

### 2.1 The Discovery

Google Research found that simply repeating the input query—copying the prompt so it appears twice—consistently improves performance on non-reasoning tasks.

**Results:** 47 wins, 0 losses across 70 head-to-head tests on major models (Gemini, GPT-4o, Claude, DeepSeek).

### 2.2 Why It Works: The Causal Blind Spot

Modern LLMs are **causal language models**—they process text strictly left-to-right. When processing token 5, the model can only attend to tokens 1-4.

**The limitation:**
- `<CONTEXT> <QUESTION>` vs `<QUESTION> <CONTEXT>` yields different results
- In the latter, the model reads the question before knowing the context

**Prompt repetition hacks this:**
- Transform `<QUERY>` into `<QUERY><QUERY>`
- By the time the model processes the second copy, it has "read" the first
- The second repetition effectively has bidirectional attention—it can "look back" at the entire query

### 2.3 Performance Improvements

**NameIndex Benchmark** (retrieve 25th name from list of 50):
- Baseline: 21.33% accuracy
- With Repetition: **97.33% accuracy**

This massive jump illustrates the causal blind spot—in a single pass, the model loses track by the 25th name. With repetition, the entire list is in "working memory."

**Cross-Model Results:**

| Model | Baseline | With Repetition |
|-------|----------|-----------------|
| Gemini 2.0 Flash-Lite | 21.33% | 97.33% |
| GPT-4o | Improved | Improved |
| Claude 3.7 Sonnet | Improved | Improved |
| DeepSeek V3 | Improved | Improved |

### 2.4 Zero Latency Penalty

LLM processing has two stages:
1. **Prefill**: Process input prompt (highly parallelizable)
2. **Generation/Decoding**: Generate answer token-by-token (serial, slow)

Prompt repetition only increases work in the **prefill stage**, which GPUs handle efficiently. The user barely notices the difference.

**Exceptions:** Claude models on extremely long requests may hit prefill bottleneck.

### 2.5 When to Use (and When Not To)

**Use Prompt Repetition For:**
- Direct answer tasks (no step-by-step reasoning needed)
- Entity extraction
- Classification
- Simple Q&A
- Retrieval from long contexts

**Don't Use For:**
- Chain of Thought reasoning (gains vanish—5 wins, 1 loss, 22 ties)
- Tasks where model already restates the premise in its output

**Reasoning models naturally perform repetition**—they restate the question before solving. Explicit repetition becomes redundant.

### 2.6 Implementation Patterns

**Automatic Repetition in Orchestration Layer:**
```python
def process_query(query: str, task_type: str) -> str:
    # Apply repetition for non-reasoning tasks
    if task_type in ['extraction', 'classification', 'qa', 'retrieval']:
        effective_query = f"{query}\n\n{query}"
    else:
        effective_query = query

    return llm.generate(effective_query)
```

**Query Type Detection:**
```python
def should_repeat(query: str) -> bool:
    reasoning_indicators = [
        'step by step',
        'think through',
        'explain your reasoning',
        'show your work'
    ]
    return not any(indicator in query.lower() for indicator in reasoning_indicators)
```

### 2.7 Security Considerations

Repeated prompts may amplify both good and bad intents:

**Red Team Testing:**
- Test "repeated injection" attacks (repeated jailbreak commands)
- Verify repeated malicious prompts don't bypass safety filters

**Defensive Use:**
- Repeat System Prompts to reinforce safety guardrails
- Stating safety constraints twice forces stronger attention to them

---

## 3. Context Engineering

Context engineering is the discipline of optimizing what information is available to an LLM at inference time. Unlike one-time prompt optimization, context engineering involves iterative curation across multiple inference turns.

### 3.1 Core Principle

> **"Find the smallest possible set of high-signal tokens that maximize the likelihood of your desired outcome."**

This principle distinguishes context engineering from traditional prompt engineering:

| Aspect | Prompt Engineering | Context Engineering |
|--------|-------------------|---------------------|
| Scope | Single prompt optimization | Multi-turn context curation |
| Focus | Instruction clarity | Token signal-to-noise ratio |
| Iteration | Per-prompt refinement | Runtime context management |
| Components | Prompt text | System instructions, tools, MCP, external data, message history, runtime retrieval |

### 3.2 The Attention Budget Problem

LLMs face **context rot**—as context expands, accuracy declines due to:

1. **Quadratic Token Relationships**: Attention computations scale as n², creating exponential overhead
2. **Limited Long-Sequence Training**: Models are optimized for typical sequence lengths
3. **Finite Attention Resources**: Diminishing returns as context grows
4. **Context Pollution**: Irrelevant tokens compete for attention with relevant ones

**Traditional RAG systems waste ~94% of attention budget** on irrelevant context. A typical session might load 35,000 tokens where only 2,000 are actually useful for the current task.

### 3.3 System Prompts: The "Right Altitude"

System prompts must strike a balance between specificity and flexibility:

**Too Prescriptive** ❌
```markdown
If the user asks about authentication, check if they mean OAuth or JWT.
If OAuth, explain the flow step by step. If JWT, show the token structure...
```
- Hardcoded conditional logic becomes brittle
- Cannot adapt to novel situations

**Too Vague** ❌
```markdown
Help the user with their requests. Be helpful and thorough.
```
- Lacks concrete behavioral signals
- Inconsistent agent behavior

**Optimal Balance** ✅
```markdown
You are an authentication specialist. When discussing auth methods:
- Explain trade-offs between approaches
- Provide concrete code examples
- Consider security implications
```
- Specific enough to guide effectively
- Flexible heuristics without excessive detail
- Minimal sufficient information

### 3.4 Tool Design for Context Efficiency

Tools must be designed with context efficiency in mind:

| Requirement | Description | Example |
|-------------|-------------|---------|
| **Self-contained** | Single, clear purpose per tool | `search_users` not `manage_users` |
| **Error-resilient** | Graceful edge case handling | Return empty array, not crash |
| **Unambiguous** | Intended use is obvious | Clear tool description |
| **Token-efficient** | Relevant outputs without bloat | Return 10 results, not 1000 |
| **Descriptive parameters** | Clear input naming | `user_id` not `id` or `user` |

**Critical Rule**: *"If a human engineer can't definitively say which tool to use in a given situation, an AI agent can't be expected to do better."*

### 3.5 Context Retrieval Strategies

#### Just-In-Time Context (Recommended for Agents)

Maintain lightweight identifiers; load data dynamically when needed.

```python
# Instead of loading all user data upfront
# Keep lightweight index, fetch on demand
class JITContextManager:
    def __init__(self):
        self.index = {}  # Lightweight metadata only

    def get_context(self, task_id: str) -> dict:
        """Load full context only when task requires it."""
        if self.is_relevant(task_id):
            return self.fetch_full_context(task_id)
        return self.get_summary(task_id)
```

**Benefits:**
- Avoids context pollution
- Enables progressive disclosure
- Mirrors human cognitive patterns
- Scales to large knowledge bases

**Trade-offs:**
- Slightly slower than pre-computed retrieval
- Requires well-designed retrieval logic

#### Pre-Inference Retrieval (Traditional RAG)

Surface context via embeddings before inference. Best suited for:
- Static, unchanging content
- Well-defined retrieval queries
- Latency-sensitive applications

#### Hybrid Approach

Retrieve some data upfront; enable autonomous exploration for the rest.

**Principle**: *"Do the simplest thing that works."*

### 3.6 Progressive Disclosure Architecture

Progressive disclosure treats context as a finite resource, revealing information in layers based on agent needs.

**The Three-Layer Architecture:**

| Layer | Token Budget | Content | Purpose |
|-------|--------------|---------|---------|
| **Index Layer** | ~800 tokens | Titles, timestamps, categories, token counts | Quick scanning |
| **Context Layer** | ~2,000 tokens | Chronological narrative around specific observations | Situational awareness |
| **Details Layer** | ~500 tokens each | Full observation content | Deep dive when needed |

**Implementation Pattern:**
```
Phase 1: Show index (50 observations, ~800 tokens)
Phase 2: Agent identifies 3 relevant observations
Phase 3: Fetch details for those 3 only (~1,500 tokens)
Total: ~2,300 tokens vs 35,000 tokens (93% reduction)
```

**Key Efficiency Metrics:**

| Metric | Target | Description |
|--------|--------|-------------|
| Waste Ratio | >80% relevant | Relevant tokens / total tokens consumed |
| Selective Fetching | 2-3 per session | Observations fetched vs available |
| Time-to-Relevance | <30 seconds | Time to find relevant context |

**Why Not Smart Pre-Fetching?**
Agents understand their task context better than any prediction system. Pre-fetching assumes we know relevance better than the current task requires—we don't.

### 3.7 Long-Horizon Task Techniques

For tasks spanning extended interactions, use these techniques to maintain coherence:

#### 1. Compaction

Summarize conversations nearing context limits; reinitiate with compressed context.

```python
def compact_context(messages: list, max_tokens: int) -> list:
    """Prioritize recall first, then eliminate superfluous content."""
    # Step 1: Clear old tool outputs (low-hanging optimization)
    messages = [m for m in messages if not is_stale_tool_output(m)]

    # Step 2: Summarize older exchanges
    if estimate_tokens(messages) > max_tokens:
        older = messages[:-10]  # Keep recent 10 exchanges
        summary = summarize_exchanges(older)
        messages = [summary] + messages[-10:]

    return messages
```

#### 2. Structured Note-Taking (Agentic Memory)

Agents persist notes outside context windows for multi-hour coherent strategies:

```markdown
## Agent Scratchpad (NOTES.md)

### Task State
- Current phase: Implementation
- Completed: Auth schema design, OAuth flow
- Blocked: JWT key rotation (awaiting security review)

### Key Decisions
- Using RS256 for JWT signing (security requirement)
- Session timeout: 30 minutes (business requirement)

### Gotchas Discovered
- Redis cluster requires sticky sessions
- Rate limiter must be before auth middleware
```

Benefits:
- Minimal token overhead
- Maintains strategic coherence
- Survives context window resets
- Enables handoffs between sessions

#### 3. Sub-Agent Architectures

Specialized sub-agents handle focused tasks with isolated context windows:

```
Main Agent (Orchestrator)
├─ Sub-Agent 1: Research (isolated 200K window)
│  └─ Returns: 1,500 token summary
├─ Sub-Agent 2: Implementation (isolated 200K window)
│  └─ Returns: 2,000 token summary
└─ Sub-Agent 3: Testing (isolated 200K window)
   └─ Returns: 1,000 token summary

Main agent receives: 4,500 tokens (not 600K+)
```

### 3.8 Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Cramming everything into prompts | Context rot, reduced accuracy | Progressive disclosure |
| Brittle if-else logic | Breaks on novel cases | Flexible heuristics |
| Bloated, overlapping tool sets | Tool selection confusion | Focused, distinct tools |
| Exhaustive edge case examples | Wastes tokens on rare cases | Canonical diverse examples |
| Assuming larger windows solve everything | Quadratic attention cost | Optimize signal-to-noise |
| Ignoring context pollution | Accumulated noise degrades output | Regular context compaction |

---

## 4. Context Window Optimization

### 4.1 MCP Tool Search (Lazy Loading)

Claude Code's MCP Tool Search addresses context bloat from tool definitions:

**Problem:**
- 50+ tools per MCP server
- 7+ servers consuming 67k+ tokens before user input
- Docker MCP server: 125k tokens for 135 tools

**Solution:**
- Monitor when tool descriptions exceed 10% of context
- Switch to lightweight search index
- Load tool definitions on-demand

**Results:**
- Token consumption: 134k → 5k (85% reduction)
- Accuracy improvement: Opus 4.5: 79.5% → 88.1%

**See:** [MCP Registry Best Practices - Section 12](13-MCP-Registry-Best-Practices.md) for implementation details.

### 4.2 Progressive Skill Loading

Apply progressive disclosure principles to skill loading:

**Pattern:**
```
Phase 1: Analysis (no skills loaded)
  └─ Agent reads requirements, explores codebase
  └─ Token budget: ~5K baseline

Phase 2: Design (load architecture-skill)
  └─ Pattern analysis, contract definition
  └─ Token budget: +3K for skill

Phase 3: Implementation (load builder-skill)
  └─ TDD workflow, git operations
  └─ Token budget: +4K for skill

Phase 4: Validation (load validator-skill)
  └─ Test generation, quality checks
  └─ Token budget: +3K for skill

Total: ~15K tokens loaded progressively
vs. All skills upfront: ~25K tokens
Savings: 40%
```

**Benefits:**
- Reduced "distraction" from irrelevant context
- Better instruction following (focused attention)
- More context available for actual work
- Skills loaded only when their phase begins

### 4.3 Waste Ratio Monitoring

Track context efficiency using waste ratio:

```python
def calculate_waste_ratio(session: Session) -> float:
    """
    Waste Ratio = Relevant Tokens / Total Tokens Consumed
    Target: >80%
    """
    total_tokens = session.total_context_tokens
    relevant_tokens = session.tokens_actually_used

    waste_ratio = relevant_tokens / total_tokens

    if waste_ratio < 0.8:
        log.warning(f"High context waste: {waste_ratio:.1%}")
        suggest_context_optimization(session)

    return waste_ratio
```

**Monitoring Dashboard:**

| Metric | Poor | Acceptable | Good | Excellent |
|--------|------|------------|------|-----------|
| Waste Ratio | <50% | 50-70% | 70-85% | >85% |
| Selective Fetching | >10 | 5-10 | 3-5 | 1-3 |
| Context Resets | >5/hr | 2-5/hr | 1-2/hr | <1/hr |

---

## 5. Key Recommendations

### For API Cost Reduction

1. **Implement semantic caching** with query-type-specific thresholds
2. **Use smaller models** where semantic cache hits allow
3. **Batch similar requests** to amortize overhead
4. **Monitor cache hit rates** and tune thresholds accordingly

### For Latency Optimization

1. **Parallelize prefill** where possible
2. **Use semantic caching** (65% latency reduction at 67% hit rate)
3. **Stream responses** for perceived performance
4. **Edge deployment** for reduced network latency

### For Accuracy Improvement

1. **Apply prompt repetition** for non-reasoning tasks
2. **Use MCP Tool Search** to reduce context noise
3. **Progressive skill loading** for focused attention
4. **Clear, action-oriented descriptions** for tool/skill discoverability
5. **Apply context engineering** principles to all agent workflows

### For Context Efficiency

1. **Implement progressive disclosure** with three-layer architecture
2. **Monitor waste ratio** (target >80% relevant tokens)
3. **Use just-in-time context retrieval** instead of upfront loading
4. **Design tools for context efficiency** (self-contained, unambiguous)
5. **Implement structured note-taking** for long-horizon tasks
6. **Use sub-agent architectures** to isolate context windows

### Pitfalls to Avoid

1. **Don't use single global threshold** for semantic caching
2. **Don't skip embedding step** on cache hits (needed for key generation)
3. **Don't forget invalidation** (stale responses erode trust)
4. **Don't cache everything** (personalized, time-sensitive, transactional)
5. **Don't apply prompt repetition** to reasoning tasks
6. **Don't cram everything into prompts** (use progressive disclosure)
7. **Don't assume larger context windows solve efficiency** (quadratic attention cost)
8. **Don't ignore context pollution** over extended interactions

---

## 6. Production Checklist

### Semantic Caching Deployment

- [ ] Select embedding model (trade-off: quality vs. latency)
- [ ] Choose vector store (FAISS local, Pinecone managed, etc.)
- [ ] Implement query-type classifier
- [ ] Configure thresholds per query type
- [ ] Build invalidation pipeline (TTL + event-based + staleness)
- [ ] Define exclusion rules (personal, transactional, time-sensitive)
- [ ] Set up monitoring (hit rates, false positives, latency)
- [ ] Establish threshold tuning process

### Prompt Optimization

- [ ] Identify non-reasoning endpoints for prompt repetition
- [ ] Implement automatic repetition in orchestration layer
- [ ] Update security testing for repeated injection attacks
- [ ] Consider repeating system prompts for safety reinforcement

### Context Efficiency

- [ ] Enable MCP Tool Search for Claude Code deployments
- [ ] Audit MCP server instructions for discoverability
- [ ] Implement progressive skill loading
- [ ] Monitor tool/skill usage patterns

### Context Engineering

- [ ] Implement three-layer progressive disclosure (index → context → details)
- [ ] Set up waste ratio monitoring (target >80%)
- [ ] Design tools following context efficiency principles
- [ ] Implement just-in-time context retrieval for dynamic data
- [ ] Create structured note-taking system for agent memory (NOTES.md pattern)
- [ ] Configure sub-agent architectures with summary handoffs
- [ ] Establish context compaction procedures for long sessions
- [ ] Review system prompts for "right altitude" balance
- [ ] Audit for context engineering anti-patterns

---

**Document Version**: 1.1.0
**Last Updated**: January 2026
**Sources**:
- VentureBeat: "Claude Code just got updated with one of the most-requested user features"
- VentureBeat: "Why your LLM bill is exploding—and how semantic caching can cut it by 73%"
- Google Research: "Prompt Repetition Improves Non-Reasoning LLMs"
- Claude-Mem Documentation: "Context Engineering for AI Agents"
- Claude-Mem Documentation: "Progressive Disclosure"
