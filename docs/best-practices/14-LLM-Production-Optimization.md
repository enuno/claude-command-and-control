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

## 3. Context Window Optimization

### 3.1 MCP Tool Search (Lazy Loading)

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

### 3.2 Progressive Skill Loading

Similar to MCP Tool Search, skills should be loaded progressively:

**Pattern:**
1. Start with minimal context (core capabilities)
2. Load relevant skills as task requires
3. Unload skills when phase completes
4. Maintain focused attention throughout

**Benefits:**
- Reduced "distraction" from irrelevant context
- Better instruction following
- More context available for actual work

---

## 4. Key Recommendations

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

### Pitfalls to Avoid

1. **Don't use single global threshold** for semantic caching
2. **Don't skip embedding step** on cache hits (needed for key generation)
3. **Don't forget invalidation** (stale responses erode trust)
4. **Don't cache everything** (personalized, time-sensitive, transactional)
5. **Don't apply prompt repetition** to reasoning tasks

---

## 5. Production Checklist

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

---

**Document Version**: 1.0.0
**Last Updated**: January 2026
**Sources**:
- VentureBeat: "Claude Code just got updated with one of the most-requested user features"
- VentureBeat: "Why your LLM bill is exploding—and how semantic caching can cut it by 73%"
- Google Research: "Prompt Repetition Improves Non-Reasoning LLMs"
