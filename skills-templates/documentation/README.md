# Documentation & Typesetting Skills

This directory contains skills for creating, formatting, and managing technical documentation and typeset documents.

## Available Skills

### LaTeX Manual

**Location**: `latex-manual/`

**Description**: Comprehensive LaTeX reference for document preparation, mathematical typesetting, and academic publishing.

**Components**:
- **SKILL.md** - Main skill file with triggers and quick reference
- **references/** - 6 comprehensive guides (54 KB total)
  - `quick-start.md` - Installation, first document, basics
  - `mathematics.md` - Complete math typesetting reference
  - `formatting.md` - Text, fonts, lists, layout
  - `tables-graphics.md` - Tables, figures, TikZ, plots
  - `bibliography.md` - BibTeX and citation management
  - `troubleshooting.md` - Errors, warnings, debugging
- **assets/** - Production templates and helper scripts (48 KB total)
  - `article-template.tex` - Research papers
  - `report-template.tex` - Thesis/technical reports
  - `beamer-template.tex` - Presentation slides
  - `letter-template.tex` - Formal correspondence
  - `ieee-paper-template.tex` - IEEE conference papers
  - `compile.sh` - Smart compilation with options
  - `clean.sh` - Clean auxiliary files
  - `bibtex.sh` - Complete BibTeX workflow

**Use Cases**:
- Writing academic papers and theses
- Creating mathematical equations and formulas
- Making professional presentations with Beamer
- Formatting scientific documents
- Debugging LaTeX compilation errors
- Managing bibliographies with BibTeX
- Creating tables and figures
- Typesetting formal letters
- Preparing IEEE conference papers

**Features**:
- 100+ code examples and snippets
- Modern best practices (UTF-8, hyperref, booktabs)
- Well-commented templates for learning
- Executable helper scripts with error handling
- Covers 90%+ of common LaTeX use cases
- Complete troubleshooting guide

**Quick Start**:
```
Use latex-manual skill to help me create a research paper
```

**Target Users**: Researchers, academics, students, technical writers, anyone working with mathematical or scientific documents.

**Quality**: Production-ready, comprehensive, beginner to advanced coverage.

---

## Future Documentation Skills

This directory is designed to hold additional documentation and typesetting skills such as:
- Markdown documentation generators
- API documentation tools
- ReStructuredText/Sphinx skills
- Technical writing style guides
- Documentation linters and validators

## Contributing

To add a new documentation skill:
1. Create a subdirectory under `documentation/`
2. Include SKILL.md with proper frontmatter
3. Add reference materials and examples
4. Update this README.md
5. Update `../README.md` with the new skill entry
