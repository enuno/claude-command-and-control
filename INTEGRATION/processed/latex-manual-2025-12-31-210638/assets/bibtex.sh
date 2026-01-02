#!/bin/bash
# BibTeX Workflow Script
# Runs complete BibTeX compilation workflow

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

usage() {
    cat << USAGE
BibTeX Workflow Script

Runs complete bibliography compilation workflow:
  1. pdflatex (creates .aux file)
  2. bibtex (processes bibliography)
  3. pdflatex (incorporates bibliography)
  4. pdflatex (resolves all references)

Usage: ./bibtex.sh [options] <filename.tex>

Options:
    -h, --help      Show this help message
    -v, --verbose   Show detailed output
    -c, --clean     Clean auxiliary files after compilation
    -o, --open      Open PDF after compilation

Examples:
    ./bibtex.sh paper.tex          # Standard workflow
    ./bibtex.sh -v paper.tex       # Verbose output
    ./bibtex.sh -co paper.tex      # Clean and open PDF

Requirements:
    - .tex file with \\bibliography{} or \\addbibresource{}
    - .bib file with references

USAGE
    exit 0
}

# Default options
VERBOSE=false
CLEAN=false
OPEN=false

# Parse options
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -o|--open)
            OPEN=true
            shift
            ;;
        *.tex)
            TEXFILE="$1"
            shift
            ;;
        *)
            echo -e "${RED}Error: Unknown option $1${NC}"
            usage
            ;;
    esac
done

# Check if filename provided
if [ -z "$TEXFILE" ]; then
    echo -e "${RED}Error: No .tex file specified${NC}"
    usage
fi

# Check if file exists
if [ ! -f "$TEXFILE" ]; then
    echo -e "${RED}Error: File '$TEXFILE' not found${NC}"
    exit 1
fi

BASENAME="${TEXFILE%.tex}"

# Set compilation options
if [ "$VERBOSE" = true ]; then
    LATEX_OPTS=""
else
    LATEX_OPTS="-interaction=nonstopmode"
fi

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   BibTeX Compilation Workflow         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: First pdflatex
echo -e "${YELLOW}[1/4] First LaTeX pass (creating .aux file)...${NC}"
pdflatex $LATEX_OPTS "$TEXFILE" || {
    echo -e "${RED}✗ First LaTeX pass failed!${NC}"
    echo "Check ${BASENAME}.log for errors"
    exit 1
}
echo -e "${GREEN}✓ .aux file created${NC}"
echo ""

# Check if .aux file was created
if [ ! -f "${BASENAME}.aux" ]; then
    echo -e "${RED}Error: .aux file not created${NC}"
    exit 1
fi

# Step 2: BibTeX
echo -e "${YELLOW}[2/4] Running BibTeX...${NC}"
bibtex "$BASENAME" 2>&1 | if [ "$VERBOSE" = true ]; then cat; else grep -E "(Warning|Error|entries|^$)" || true; fi
BIBTEX_EXIT=${PIPESTATUS[0]}

if [ $BIBTEX_EXIT -ne 0 ]; then
    echo -e "${RED}✗ BibTeX failed!${NC}"
    echo "Check ${BASENAME}.blg for errors"
    exit 1
fi
echo -e "${GREEN}✓ Bibliography processed${NC}"
echo ""

# Check if .bbl file was created
if [ ! -f "${BASENAME}.bbl" ]; then
    echo -e "${YELLOW}Warning: .bbl file not created - check if .bib file exists${NC}"
fi

# Step 3: Second pdflatex
echo -e "${YELLOW}[3/4] Second LaTeX pass (incorporating bibliography)...${NC}"
pdflatex $LATEX_OPTS "$TEXFILE" || {
    echo -e "${RED}✗ Second LaTeX pass failed!${NC}"
    exit 1
}
echo -e "${GREEN}✓ Bibliography incorporated${NC}"
echo ""

# Step 4: Third pdflatex
echo -e "${YELLOW}[4/4] Final LaTeX pass (resolving references)...${NC}"
pdflatex $LATEX_OPTS "$TEXFILE" || {
    echo -e "${RED}✗ Final LaTeX pass failed!${NC}"
    exit 1
}
echo -e "${GREEN}✓ All references resolved${NC}"
echo ""

# Summary
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Compilation Successful!              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "Output: ${GREEN}${BASENAME}.pdf${NC}"

# Check for warnings
if grep -q "Warning" "${BASENAME}.log"; then
    echo -e "${YELLOW}⚠ Warnings found in log file${NC}"
    if [ "$VERBOSE" = true ]; then
        echo ""
        echo -e "${YELLOW}Warnings:${NC}"
        grep "Warning" "${BASENAME}.log" || true
    fi
fi

# Clean auxiliary files
if [ "$CLEAN" = true ]; then
    echo ""
    echo -e "${YELLOW}Cleaning auxiliary files...${NC}"
    rm -f "${BASENAME}.aux" "${BASENAME}.log" "${BASENAME}.bbl" \
          "${BASENAME}.blg" "${BASENAME}.out" "${BASENAME}.toc" \
          "${BASENAME}.lof" "${BASENAME}.lot"
    echo -e "${GREEN}✓ Cleaned${NC}"
fi

# Open PDF
if [ "$OPEN" = true ]; then
    PDF="${BASENAME}.pdf"
    if [ -f "$PDF" ]; then
        echo ""
        echo -e "${YELLOW}Opening PDF...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "$PDF"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "$PDF" 2>/dev/null || evince "$PDF" 2>/dev/null
        fi
    fi
fi

echo ""
echo -e "${GREEN}Done!${NC}"
