# PDF Source Documents

## Accessing Source Materials

All Bitcoin mining documentation is available as PDF files in the repository. Claude can read these files directly when detailed information is needed.

## Available PDFs

### 1. Bitcoin Mining 2024 Year in Review
**Path**: `./docs/bitcoin.mining.2024.pdf`

**When to Reference**:
- Industry trends and market analysis
- 2024 statistics and metrics
- Regulatory updates
- Global hashrate distribution

### 2. Bitcoin Mining Economics
**Path**: `./docs/bitcoin.mining.economics.pdf`

**When to Reference**:
- Profitability calculations
- Cost analysis (energy, equipment, operations)
- Financial modeling
- Investment analysis

### 3. Bitcoin Mining Handbook
**Path**: `./docs/bitcoin.mining.handbook.pdf`

**When to Reference**:
- Hardware specifications (ASIC miners)
- Setup and deployment procedures
- Operational best practices
- Troubleshooting guides
- Maintenance schedules

### 4. Bitcoin Mining Heat Reuse Strategies
**Path**: `./docs/bitcoin.mining.heat.resue.pdf`

**When to Reference**:
- Heat recovery systems
- Thermal management
- Sustainability practices
- Energy efficiency optimization

## Usage Pattern

When a user asks a question that requires specific details:

1. **Identify the topic area** (market/economics/operations/sustainability)
2. **Select the appropriate PDF** from the list above
3. **Use the Read tool** to access specific sections
4. **Extract relevant information** to answer the question
5. **Cite the source** in your response

### Example: Answering a Profitability Question

```
User: "How do I calculate Bitcoin mining profitability?"

Claude Response Process:
1. Topic: Economics/Financial
2. PDF: bitcoin.mining.economics.pdf
3. Read: Use Read tool on the PDF
4. Extract: Profitability formulas and factors
5. Answer: Provide calculation method with source citation
```

## PDF Organization

```
docs/
├── bitcoin.mining.2024.pdf          (Market Overview)
├── bitcoin.mining.economics.pdf     (Financial Analysis)
├── bitcoin.mining.handbook.pdf      (Technical Operations)
└── bitcoin.mining.heat.resue.pdf    (Sustainability)
```

## Best Practices

- **Read selectively**: Use PDF page ranges when possible to reduce token usage
- **Cross-reference**: Combine information from multiple PDFs for comprehensive answers
- **Stay current**: Note that market data reflects 2023-2024 conditions
- **Cite sources**: Always mention which PDF was referenced

## Technical Notes

- PDFs are stored in the repository `docs/` directory
- Files use dot notation (e.g., `bitcoin.mining.2024.pdf`)
- All PDFs are readable by Claude using the Read tool
- Original filenames preserve document structure for easy reference

---

*This skill provides a curated interface to these PDF documents, making Bitcoin mining knowledge easily accessible through natural language queries.*
