# LaTeX Troubleshooting Guide

## Compilation Errors

### Undefined Control Sequence

**Error**:
```
! Undefined control sequence.
l.10 \somcommand
```

**Causes**:
1. Typo in command name
2. Missing package
3. Command doesn't exist

**Solutions**:
```latex
% Check spelling
\somecommand  % Not \somcommand

% Add required package
\usepackage{amsmath}  % For math commands
\usepackage{graphicx} % For \includegraphics

% Check if command exists in loaded packages
```

### Missing $ Inserted

**Error**:
```
! Missing $ inserted.
```

**Cause**: Math symbols used outside math mode

**Solution**:
```latex
% Wrong:
The formula x^2 + y^2 = z^2 is Pythagorean.

% Right:
The formula $x^2 + y^2 = z^2$ is Pythagorean.
```

### File Not Found

**Error**:
```
! LaTeX Error: File `image.pdf' not found.
```

**Solutions**:
```latex
% Check file path
\includegraphics{figures/image.pdf}  % Include path

% Check file extension
\includegraphics{image.pdf}          % Include extension

% Set graphics path
\graphicspath{{figures/}{images/}}
```

### Undefined Reference

**Error**:
```
LaTeX Warning: Reference `fig:example' on page 1 undefined.
```

**Solution**: Compile twice (or use latexmk):
```bash
pdflatex document.tex  % First pass creates labels
pdflatex document.tex  % Second pass resolves references
```

### Missing \begin{document}

**Error**:
```
! LaTeX Error: Missing \begin{document}.
```

**Causes**:
1. Text before `\begin{document}`
2. Unescaped special character in preamble

**Solution**:
```latex
\documentclass{article}
% Only commands in preamble
\usepackage{amsmath}

\begin{document}
% Text goes here
\end{document}
```

### Runaway Argument

**Error**:
```
Runaway argument?
```

**Causes**:
1. Missing closing brace `}`
2. Missing `\end{environment}`

**Solution**:
```latex
% Check braces match
\textbf{Bold text}  % Not \textbf{Bold text

% Check environments
\begin{itemize}
  \item Item
\end{itemize}       % Not missing \end{itemize}
```

## Warnings

### Overfull \hbox

**Warning**:
```
Overfull \hbox (10.25pt too wide) in paragraph at lines 15--20
```

**Meaning**: Line is too wide to fit in margins

**Solutions**:
```latex
% 1. Rephrase text
% 2. Allow line breaks in URLs
\usepackage{url}
\url{https://very-long-url.com/path/to/resource}

% 3. Use \sloppy (last resort)
\sloppy
Paragraph with long words...
\fussy  % Return to normal

% 4. Hyphenate long words
\hyphenation{long-word an-oth-er-word}
```

### Underfull \hbox

**Warning**:
```
Underfull \hbox (badness 10000) in paragraph at lines 15--20
```

**Meaning**: LaTeX couldn't fill line properly (too much whitespace)

**Solutions**:
```latex
% Usually safe to ignore
% Or add text to paragraph
% Or use \raggedright for paragraph
```

### Citation Undefined

**Warning**:
```
LaTeX Warning: Citation `smith2024' undefined.
```

**Solutions**:
```bash
# Run BibTeX
pdflatex document.tex
bibtex document
pdflatex document.tex
pdflatex document.tex

# Check .bib file has entry
# Check cite key matches
```

## Package Conflicts

### Option Clash

**Error**:
```
! LaTeX Error: Option clash for package hyperref.
```

**Cause**: Package loaded twice with different options

**Solution**:
```latex
% Wrong:
\usepackage{hyperref}
\usepackage[colorlinks]{hyperref}

% Right:
\usepackage[colorlinks]{hyperref}  % Load once with all options
```

### Package Not Found

**Error**:
```
! LaTeX Error: File `package.sty' not found.
```

**Solutions**:
```bash
# TeX Live
tlmgr install package

# MiKTeX (auto-installs by default)
# Or manually: MiKTeX Package Manager

# Ubuntu/Debian
sudo apt-get install texlive-package
```

## Math Mode Issues

### Display Math in Paragraph

**Problem**: Equation breaks paragraph flow

**Solution**:
```latex
% Wrong: $$ in middle of paragraph
Text here $$x = y$$ more text.

% Right: Use equation environment or inline math
Text here $x = y$ more text.

% Or for display math:
Text here.
\begin{equation}
  x = y
\end{equation}
More text.
```

### Alignment Issues

**Problem**: Equations don't align properly

**Solution**:
```latex
% Use align environment
\begin{align}
  x &= y + z \\
  &= a + b
\end{align}

% Not align with $$
```

## Floats (Figures/Tables)

### Float Appears Far from Text

**Problem**: Figure/table not where expected

**Solutions**:
```latex
% 1. Use [H] to force position (requires float package)
\usepackage{float}
\begin{figure}[H]
  ...
\end{figure}

% 2. Adjust float parameters
\setcounter{topnumber}{2}
\setcounter{bottomnumber}{2}
\renewcommand{\floatpagefraction}{0.7}

% 3. Use \FloatBarrier (placeins package)
\usepackage{placeins}
Text and floats
\FloatBarrier
New section starts here

% 4. Reference all floats in text
See Figure~\ref{fig:example}...
```

### Too Many Unprocessed Floats

**Error**:
```
! LaTeX Error: Too many unprocessed floats.
```

**Solution**:
```latex
% Add \clearpage to process queued floats
\section{Results}
... many figures ...
\clearpage  % Process all pending floats

\section{Next Section}
```

## Bibliography Issues

### Bibliography Not Appearing

**Solutions**:
```bash
# 1. Run complete workflow
pdflatex document.tex
bibtex document
pdflatex document.tex
pdflatex document.tex

# 2. Check for \cite{} commands
# 3. Check \bibliography{filename} matches .bib file
# 4. Check .bib file syntax
```

### Citation Format Issues

**Problem**: Citations appear as [?] or (?)

**Solutions**:
1. Run BibTeX: `bibtex document`
2. Check cite keys match `.bib` entries
3. Ensure `.bib` file is in same directory or specify path
4. Check for BibTeX errors in log file

## Encoding Issues

### Strange Characters

**Problem**: ä shows as Ã¤

**Solution**:
```latex
% Add to preamble
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}

% Save file as UTF-8 in your editor
```

## Performance Issues

### Slow Compilation

**Solutions**:
```latex
% 1. Use draft mode for quick previews
\documentclass[draft]{article}

% 2. Comment out slow packages temporarily
%\usepackage{tikz}

% 3. Use \includeonly for multi-file documents
\includeonly{chapter1,chapter3}

% 4. Use latexmk for smart compilation
latexmk -pdf document.tex
```

## Debugging Strategies

### Find Error Location

1. **Read error message carefully**: Shows line number
2. **Comment out sections**: Binary search for problem
3. **Check recently added code**: Usually the issue
4. **Compile frequently**: Catch errors early
5. **Read log file**: Contains detailed error info

### Common Debugging Steps

```bash
# 1. Check log file
cat document.log | grep -i error

# 2. Clean auxiliary files
rm *.aux *.bbl *.blg *.log *.out

# 3. Full recompile
pdflatex document.tex
bibtex document
pdflatex document.tex
pdflatex document.tex

# 4. Use latexmk for automatic handling
latexmk -pdf -f document.tex  # Force compilation
```

### Minimal Working Example (MWE)

When asking for help, create MWE:
```latex
\documentclass{article}
\usepackage{problematic-package}

\begin{document}
Code that causes error...
\end{document}
```

## Prevention Tips

1. **Compile often**: Don't wait until you're done
2. **Use version control**: Git helps track changes
3. **Comment code**: Explain complex commands
4. **Use consistent style**: Easier to spot errors
5. **Learn from errors**: Same errors teach lessons
6. **Keep packages updated**: But test after updates
7. **Backup files**: Before major changes
8. **Use online editors**: Overleaf handles packages automatically

## Getting Help

### Resources
- **TeX Stack Exchange**: https://tex.stackexchange.com
- **LaTeX Wikibook**: https://en.wikibooks.org/wiki/LaTeX
- **Package documentation**: `texdoc packagename`
- **CTAN**: https://ctan.org (package repository)

### Asking Questions
1. Provide minimal working example
2. Include error message
3. Show what you tried
4. Mention LaTeX distribution and version
5. Include relevant packages and versions
