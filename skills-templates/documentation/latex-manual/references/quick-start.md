# LaTeX Quick Start Guide

## Installation

### Windows
- **MiKTeX**: https://miktex.org/download
- **TeX Live**: https://www.tug.org/texlive/

### macOS
- **MacTeX**: https://www.tug.org/mactex/
- Or via Homebrew: `brew install --cask mactex`

### Linux
```bash
# Debian/Ubuntu
sudo apt-get install texlive-full

# Fedora/RHEL
sudo dnf install texlive-scheme-full

# Arch Linux
sudo pacman -S texlive-most
```

### Online (No Installation)
- **Overleaf**: https://www.overleaf.com (recommended)
- **Papeeria**: https://papeeria.com
- **CoCalc**: https://cocalc.com

## Your First Document

Create a file `hello.tex`:

```latex
\documentclass{article}

\begin{document}

Hello, World!

This is my first LaTeX document.

\end{document}
```

**Compile:**
```bash
pdflatex hello.tex
```

**Result:** `hello.pdf` containing your formatted text

## Basic Structure

```latex
% Preamble
\documentclass[12pt]{article}  % Document class and options
\usepackage{graphicx}           % Packages for additional features
\usepackage{amsmath}

\title{My Document Title}
\author{John Doe}
\date{\today}                   % or specific date: January 1, 2024

% Document body
\begin{document}

\maketitle                      % Creates title page

\tableofcontents                % Auto-generated table of contents

\section{Introduction}
This is the introduction.

\section{Main Content}
Here's the main content.

\subsection{A Subsection}
Subsection content here.

\section{Conclusion}
Final thoughts.

\end{document}
```

## Document Classes

```latex
\documentclass{article}         % Papers, short reports
\documentclass{report}          % Longer reports, theses (has chapters)
\documentclass{book}            % Books (two-sided by default)
\documentclass{letter}          % Letters
\documentclass{beamer}          % Presentations
```

**Common Options:**
```latex
\documentclass[12pt, a4paper, twocolumn]{article}
% 12pt - font size (10pt, 11pt, 12pt)
% a4paper - paper size (letterpaper, a4paper, a5paper)
% twocolumn - two-column layout
```

## Essential Packages

```latex
\usepackage[utf8]{inputenc}     % UTF-8 input encoding
\usepackage[T1]{fontenc}        % Font encoding
\usepackage{amsmath, amssymb}   % Math symbols and environments
\usepackage{graphicx}           % Include images
\usepackage{hyperref}           % Clickable links
\usepackage{geometry}           % Page layout
\usepackage{setspace}           % Line spacing
\usepackage{natbib}             % Bibliography
```

## Text Formatting Basics

### Font Styles

```latex
\textbf{Bold text}
\textit{Italic text}
\texttt{Typewriter/monospace}
\textsc{Small Caps}
\emph{Emphasized} % Usually italic

% Can combine:
\textbf{\textit{Bold and italic}}
```

### Font Sizes

```latex
{\tiny Tiny text}
{\small Small text}
{\normalsize Normal text}
{\large Large text}
{\Large Larger text}
{\LARGE Even larger}
{\huge Huge text}
{\Huge Hugest text}
```

### Text Alignment

```latex
\begin{center}
  Centered text
\end{center}

\begin{flushleft}
  Left-aligned text
\end{flushleft}

\begin{flushright}
  Right-aligned text
\end{flushright}
```

## Sections and Structure

```latex
\section{Section Title}
\subsection{Subsection Title}
\subsubsection{Subsubsection Title}
\paragraph{Paragraph Title}
\subparagraph{Subparagraph Title}
```

**Unnumbered sections:**
```latex
\section*{Introduction}  % No number in title or TOC
```

## Spacing

### Vertical Space

```latex
\vspace{1cm}            % Vertical space
\vspace{-0.5cm}         % Negative space (reduce gap)

% Line spacing
\usepackage{setspace}
\doublespacing          % Double spacing
\onehalfspacing         % 1.5 spacing
\singlespacing          % Single spacing
```

### Horizontal Space

```latex
word\hspace{1cm}word    % Horizontal space
word\quad word          % 1em space
word\qquad word         % 2em space
word~word               % Non-breaking space
```

### New Lines and Paragraphs

```latex
First line\\
Second line             % New line (no indent)

First paragraph.

Second paragraph.       % Blank line = new paragraph (with indent)
```

## Special Characters

```latex
\%      % Percent sign
\$      % Dollar sign
\&      % Ampersand
\_      % Underscore
\#      % Hash
\{      % Left brace
\}      % Right brace
\~{}    % Tilde
\^{}    % Caret
\textbackslash  % Backslash
```

## Comments

```latex
% This is a comment (rest of line is ignored)

\begin{comment}   % Requires \usepackage{verbatim}
This is a
multi-line
comment block.
\end{comment}
```

## Including Files

```latex
\input{chapter1}        % Includes chapter1.tex (no \begin{document})
\include{chapter2}      % Includes and forces page break

% In preamble, to split large documents:
\includeonly{chapter1,chapter3}  % Only compile these chapters
```

## Creating a Simple Paper

```latex
\documentclass[12pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{amsmath}
\usepackage{graphicx}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}

\title{My Research Paper}
\author{Jane Smith}
\date{\today}

\begin{document}

\maketitle

\begin{abstract}
This paper presents...
\end{abstract}

\section{Introduction}
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

\subsection{Background}
Prior work has shown~\cite{author2024}...

\subsection{Our Contribution}
We propose a novel approach...

\section{Methodology}
Our method consists of three steps:
\begin{enumerate}
  \item First step
  \item Second step
  \item Third step
\end{enumerate}

\section{Results}
Figure~\ref{fig:results} shows our experimental results.

\begin{figure}[h]
  \centering
  \includegraphics[width=0.8\textwidth]{results.pdf}
  \caption{Experimental results}
  \label{fig:results}
\end{figure}

\section{Conclusion}
We have demonstrated...

\bibliographystyle{plain}
\bibliography{references}

\end{document}
```

## Compilation Tips

### Basic Compilation
```bash
pdflatex document.tex
```

### With Bibliography
```bash
pdflatex document.tex
bibtex document
pdflatex document.tex
pdflatex document.tex
```

### Using latexmk (Automated)
```bash
latexmk -pdf document.tex              # Compile to PDF
latexmk -pdf -pvc document.tex         # Continuous preview
latexmk -c                             # Clean auxiliary files
latexmk -C                             # Clean all generated files
```

### Common Flags
```bash
pdflatex -interaction=nonstopmode document.tex  # Don't stop on errors
pdflatex -shell-escape document.tex             # Allow external commands
```

## File Organization

```
project/
├── main.tex                # Main document
├── references.bib          # Bibliography database
├── chapters/
│   ├── introduction.tex
│   ├── methodology.tex
│   └── conclusion.tex
├── figures/
│   ├── diagram1.pdf
│   └── plot1.pdf
└── output/
    └── main.pdf
```

## Next Steps

1. **Learn Mathematics**: See `mathematics.md` for equation formatting
2. **Improve Formatting**: See `formatting.md` for advanced text styling
3. **Add Tables/Figures**: See `tables-graphics.md`
4. **Citations**: See `bibliography.md` for BibTeX usage
5. **Troubleshooting**: See `troubleshooting.md` for common errors

## Quick Reference Cards

### Common Symbols
- `\LaTeX` → LaTeX
- `\TeX` → TeX
- `--` → en-dash (–)
- `---` → em-dash (—)
- `` → opening quotes
- `''` → closing quotes

### Common Environments
- `\begin{itemize}...\end{itemize}` - Bulleted list
- `\begin{enumerate}...\end{enumerate}` - Numbered list
- `\begin{equation}...\end{equation}` - Numbered equation
- `\begin{figure}...\end{figure}` - Figure
- `\begin{table}...\end{table}` - Table
- `\begin{abstract}...\end{abstract}` - Abstract

## Resources

- **Documentation**: `texdoc <package>` (e.g., `texdoc amsmath`)
- **Symbol lookup**: http://detexify.kirelabs.org/classify.html
- **Questions**: https://tex.stackexchange.com
- **Templates**: https://www.overleaf.com/latex/templates
- **LaTeX Wikibook**: https://en.wikibooks.org/wiki/LaTeX
