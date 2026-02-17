# SkillsBench Research Summary (February 2026)

**Full Title**: "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks"

**Authors**: Xiangyi Li, Wenbo Chen, Yimin Liu, and 105+ contributors from academia and industry

**Publication**: arXiv:2602.12670v1 (February 2026)

**URL**: https://arxiv.org/html/2602.12670v1

---

## Executive Summary

SkillsBench represents the **first systematic evaluation framework** specifically designed to measure Agent Skills efficacy. The research addresses a critical gap: while Agent Skills ecosystems have proliferated rapidly, no benchmark previously quantified their actual impact on agent performance.

**Study Scope:**
- **84 diverse tasks** across 11 domains
- **7 agent-model configurations** tested
- **7,308 evaluation trajectories** executed
- **3 testing conditions**: Baseline (no skills), Curated Skills (human-authored), Self-generated Skills (model-created)

---

## Key Findings

### Finding 1: Substantial but Variable Impact

**Curated Skills improved performance by 16.2 percentage points on average**, though benefits varied significantly across configurations (range: 13.6pp to 23.3pp).

**Best performing configurations:**
- Gemini CLI + Gemini 3 Flash: 48.7% pass rate with skills
- Claude Code + Opus 4.5: Highest improvement (+23.3pp gain)

**Implication**: Skills provide measurable, reproducible performance improvements, but configuration-specific optimization is important.

---

### Finding 2: Domain-Specific Heterogeneity

Performance gains vary dramatically by domain, with specialized workflows benefiting most:

| Domain | With Skills | Without Skills | Improvement |
|--------|-------------|-----------------|-------------|
| **Healthcare** | 86.1% | 34.2% | **+51.9pp** |
| **Manufacturing** | 42.9% | 1.0% | **+41.9pp** |
| **Cybersecurity** | 44.0% | 20.8% | **+23.2pp** |
| **Software Engineering** | 38.9% | 34.4% | **+4.5pp** |

**Explanation**: Domains with specialized workflows underrepresented in pretraining benefit disproportionately. Software engineering shows minimal gains because coding patterns are well-represented in training data.

**Practical Application:**
- **Prioritize skills development** for healthcare, manufacturing, legal, and other specialized domains
- **De-prioritize** extensive skills for general software engineering (use for specific patterns only)
- **Focus on procedural knowledge** absent from model training (company-specific workflows, regulatory compliance, proprietary methodologies)

---

### Finding 3: Optimal Skill Quantity

**Peak performance**: Tasks with **2-3 skills** showed +18.6pp improvement

**Diminishing returns**: Tasks with **4+ skills** showed only +5.9pp improvement

**Explanation**: Excessive procedural guidance creates cognitive overhead, reducing the agent's ability to reason effectively about the task.

**Practical Application:**
- **Limit active skills to 2-3 per workflow** for optimal performance
- When more than 3 skills seem necessary:
  - Consolidate related skills into unified workflow
  - Create meta-orchestration skill coordinating others
  - Split task into independent subtasks
- **Avoid skill bloat**: Regularly audit and prune redundant skills

---

### Finding 4: Moderate-Length Skills Outperform Comprehensive Ones

**Moderate-length skills**: **+18.8pp improvement**

**Comprehensive skills**: **-2.9pp degradation**

**Explanation**: Extensive documentation creates context bloat, making it harder for agents to extract relevant information and reason about the task.

**Practical Application:**
- **Concise SKILL.md** (<500 lines) with references for details
- **Progressive disclosure pattern**: Load full details only when needed
- **Resist documentation bloat**: Don't add everything you know; add what the agent needs for THIS workflow
- **Use examples over explanations**: Show concrete patterns instead of abstract descriptions

**Validated Token Budget Tiers:**
- Simple skills: 500-2K tokens
- Moderate skills: 2K-8K tokens
- Complex skills: 8K-20K tokens (split if larger)

---

### Finding 5: Self-Generated Skills Are Inadequate

Models attempting to generate their own procedural knowledge showed **-1.3pp average performance** (negligible or negative impact).

**Explanation**: Effective skills require human-curated domain expertise that models cannot reliably self-generate. Agents lack the meta-cognitive ability to identify what procedural knowledge they're missing.

**Practical Application:**
- **Human expertise is non-negotiable**: Skills must be created by domain experts
- **Claude A/B development pattern validated**: Use Claude to *draft* skills, but human expertise guides and validates
- **Avoid automated skill generation**: Don't attempt systems that auto-create skills from observations
- **Invest in curation**: Budget time for expert review and iterative refinement

---

### Finding 6: Skills Enable Model Scale Compensation

**Claude Haiku 4.5 + Skills (27.7%)** exceeded **Opus 4.5 without Skills (22.0%)**

**Explanation**: High-quality procedural augmentation can partially substitute for raw model capacity, enabling smaller models to match or exceed larger models' performance.

**Practical Application:**
- **Cost optimization strategy**: Invest in skills, use smaller models
- **Model selection decision tree**:
  1. Identify workflow requirements
  2. Create/select appropriate skills
  3. Test with Haiku first
  4. Upgrade to Sonnet only if Haiku insufficient
  5. Reserve Opus for orchestration or truly complex reasoning
- **ROI calculation**: Skills development cost vs. ongoing model usage savings
- **Performance parity**: Haiku + Skills can match Opus without Skills at fraction of cost

**Example Cost Comparison (1M input tokens):**
- Opus 4.5: $15 per MTok input
- Haiku 4.5: $0.25 per MTok input
- **Cost savings**: 98.3% reduction while maintaining performance parity

---

## Methodology Highlights

### Quality Assurance Mechanisms

The benchmark incorporated multiple validation layers:
- **Human-authored instructions** ensuring task clarity
- **Skill generality requirements** preventing overfitting
- **Deterministic verification** via pytest test cases
- **Automated validation** for consistency
- **Human review** of edge cases
- **Leakage prevention** avoiding contamination from training data

### Task Construction Pipeline

**Phase 1 - Aggregation**: Collected 47,150 unique skills from:
- Open repositories
- Claude Code ecosystem
- Corporate partners

**Phase 2 - Curation**: Refined 322 candidate tasks to 84 through:
- Structural validation
- Oracle execution testing
- Instruction quality assessment

**Phase 3 - Evaluation**: Executed under multiple conditions:
- Baseline (no skills provided)
- Curated Skills (human-authored procedural guidance)
- Self-generated Skills (model-created procedural knowledge)

---

## Limitations and Future Work

### Acknowledged Limitations

1. **Scope**: Research focuses on terminal-based containerized tasks, potentially limiting generalization to GUI agents or extended-horizon workflows

2. **Context Length Confound**: Skills injection increases context length, so observed gains could partly reflect more context rather than procedural structure alone

3. **Harness Dependency**: Skills efficacy varies dramatically by implementation; results may not generalize across all agent frameworks

### Future Research Directions

1. **Length-matched control conditions**: Isolate procedural structure benefits from raw context length increases

2. **GUI agent evaluation**: Extend benchmark to visual interface tasks

3. **Multi-turn workflows**: Evaluate skills in extended conversations requiring state maintenance

4. **Skill composition patterns**: Systematically study optimal ways to combine multiple skills

---

## Integration with Command & Control Framework

### Alignment with Existing Best Practices

The SkillsBench findings **empirically validate** several existing best practices in this repository:

1. **Progressive Disclosure (§14.2)**: Moderate-length skills (+18.8pp) validate token-efficient architecture
2. **Evaluation-Driven Development (§14.3)**: Systematic testing produces higher-quality skills than assumption-based development
3. **Skills vs Multi-Agent (§08)**: Skills-first approach yields better token efficiency (5-7x vs 15x baseline)
4. **Optimal Skill Quantity (§13)**: 2-3 skills recommendation now backed by empirical data (+18.6pp peak)

### New Insights Introduced

1. **Domain-Specific ROI**: Healthcare/Manufacturing show 10x higher returns than Software Engineering
2. **Model Downgrading Strategy**: Haiku + Skills can replace Opus without Skills (cost savings)
3. **Complexity Ceiling**: Beyond 3 active skills, diminishing returns occur (cognitive overhead)
4. **Self-Generation Failure**: Confirms human expertise requirement (-1.3pp for model-generated skills)

---

## Practical Recommendations

### For Individual Developers

1. **Prioritize domain-specific skills** for specialized workflows (healthcare procedures, manufacturing processes, legal compliance)
2. **Limit to 2-3 active skills** per workflow to avoid cognitive overhead
3. **Use moderate-length skills** (<500 lines SKILL.md) with progressive disclosure for details
4. **Test model downgrading**: Try Haiku with skills before defaulting to expensive Opus
5. **Invest in human curation**: Don't attempt automated skill generation

### For Teams

1. **Systematic skill development**: Allocate 20% time for skills curation in specialized domains
2. **Shared skill libraries**: Version-controlled skills with evaluation test suites
3. **Domain expertise mapping**: Identify which team members should create which skills
4. **Regular skill audits**: Prune redundant skills, consolidate overlapping ones
5. **Cost tracking**: Monitor model usage savings from skill deployment

### For Enterprises

1. **ROI-focused deployment**: Calculate (skill development cost) vs (ongoing model savings)
2. **Domain-prioritized rollout**: Start with healthcare, manufacturing, legal departments
3. **Governance framework**: Human expert review required for all production skills
4. **Performance monitoring**: Track activation rates, success rates, token usage
5. **Model optimization**: Systematic downgrading from Opus → Sonnet → Haiku with skills

---

## Citation

Li, X., Chen, W., Liu, Y., et al. (2026). "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks." *arXiv preprint* arXiv:2602.12670v1.

**BibTeX:**
```bibtex
@article{li2026skillsbench,
  title={SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks},
  author={Li, Xiangyi and Chen, Wenbo and Liu, Yimin and others},
  journal={arXiv preprint arXiv:2602.12670v1},
  year={2026},
  url={https://arxiv.org/html/2602.12670v1}
}
```

---

## Related Documents

- **[08. Claude Skills Guide](../best-practices/08-Claude-Skills-Guide.md)** - Basic skill creation fundamentals
- **[09. Developing High-Impact Claude Skills](../best-practices/09-Developing-High-Impact-Claude-Skills.md)** - Comprehensive development patterns
- **[14. Production-Grade Skills Development](../best-practices/14-Production-Grade-Skills-Development.md)** - Advanced production patterns
- **[13. Skills-First Planning](../best-practices/13-Skills-First-Planning-and-Orchestration.md)** - Orchestration decision framework

---

**Document Version**: 1.0.0
**Created**: February 17, 2026
**Maintained By**: Claude Command and Control Project
**Review Cycle**: Upon significant research updates
