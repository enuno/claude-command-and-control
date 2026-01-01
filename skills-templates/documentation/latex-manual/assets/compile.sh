#!/bin/bash
# LaTeX Compilation Helper Script
# Simplifies compiling LaTeX documents with various workflows

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print usage information
usage() {
    cat << USAGE
LaTeX Compilation Script

Usage: ./compile.sh [options] <filename.tex>

Options:
    -h, --help          Show this help message
    -b, --bibtex        Run full BibTeX workflow (pdflatex → bibtex → pdflatex × 2)
    -c, --clean         Clean auxiliary files after compilation
    -v, --view          Open PDF after compilation (macOS/Linux)
    -q, --quick         Quick compile (single pdflatex pass)
    -x, --xelatex       Use XeLaTeX instead of pdfLaTeX
    -l, --lualatex      Use LuaLaTeX instead of pdfLaTeX

Examples:
    ./compile.sh paper.tex                  # Single pdflatex pass
    ./compile.sh -b paper.tex               # Full BibTeX workflow
    ./compile.sh -bcv paper.tex             # BibTeX + clean + view
    ./compile.sh -x paper.tex               # Compile with XeLaTeX

USAGE
    exit 0
}

# Default options
BIBTEX=false
CLEAN=false
VIEW=false
QUICK=false
COMPILER="pdflatex"

# Parse command line options
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        -b|--bibtex)
            BIBTEX=true
            shift
            ;;
        -c|--clean)
            CLEAN=true
            shift
            ;;
        -v|--view)
            VIEW=true
            shift
            ;;
        -q|--quick)
            QUICK=true
            shift
            ;;
        -x|--xelatex)
            COMPILER="xelatex"
            shift
            ;;
        -l|--lualatex)
            COMPILER="lualatex"
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

# Extract basename without extension
BASENAME="${TEXFILE%.tex}"

echo -e "${GREEN}Compiling: $TEXFILE${NC}"
echo -e "${YELLOW}Compiler: $COMPILER${NC}"

# Compilation function
compile() {
    echo -e "${YELLOW}Running $COMPILER...${NC}"
    $COMPILER -interaction=nonstopmode "$TEXFILE" || {
        echo -e "${RED}Compilation failed! Check the log file: ${BASENAME}.log${NC}"
        exit 1
    }
}

# Main compilation workflow
if [ "$BIBTEX" = true ]; then
    echo -e "${YELLOW}=== Full BibTeX Workflow ===${NC}"
    
    # First pass
    echo "Pass 1/4: Initial compilation..."
    compile
    
    # BibTeX
    echo "Pass 2/4: Running BibTeX..."
    bibtex "$BASENAME" || {
        echo -e "${YELLOW}Warning: BibTeX failed (this is OK if no bibliography)${NC}"
    }
    
    # Second pass (resolve references)
    echo "Pass 3/4: Resolving references..."
    compile
    
    # Third pass (finalize)
    echo "Pass 4/4: Final compilation..."
    compile
    
elif [ "$QUICK" = true ]; then
    echo -e "${YELLOW}=== Quick Compilation ===${NC}"
    compile
else
    echo -e "${YELLOW}=== Standard Compilation ===${NC}"
    # Two passes to resolve references
    compile
    compile
fi

echo -e "${GREEN}✓ Compilation successful!${NC}"

# Clean auxiliary files
if [ "$CLEAN" = true ]; then
    echo -e "${YELLOW}Cleaning auxiliary files...${NC}"
    rm -f "${BASENAME}.aux" "${BASENAME}.log" "${BASENAME}.out" \
          "${BASENAME}.bbl" "${BASENAME}.blg" "${BASENAME}.toc" \
          "${BASENAME}.lof" "${BASENAME}.lot" "${BASENAME}.nav" \
          "${BASENAME}.snm" "${BASENAME}.vrb"
    echo -e "${GREEN}✓ Cleaned${NC}"
fi

# View PDF
if [ "$VIEW" = true ]; then
    PDF="${BASENAME}.pdf"
    if [ -f "$PDF" ]; then
        echo -e "${YELLOW}Opening PDF...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "$PDF"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "$PDF" 2>/dev/null || evince "$PDF" 2>/dev/null || echo -e "${YELLOW}Could not open PDF viewer${NC}"
        else
            echo -e "${YELLOW}Auto-view not supported on this OS${NC}"
        fi
    else
        echo -e "${RED}PDF file not found!${NC}"
    fi
fi

echo -e "${GREEN}Done!${NC}"
