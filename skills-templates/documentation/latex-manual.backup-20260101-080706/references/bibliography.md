# LaTeX Bibliography Reference

## BibTeX Basics

### Basic Workflow

1. **Create `.bib` file** (`references.bib`):
```bibtex
@article{einstein1905,
  author = {Einstein, Albert},
  title = {On the Electrodynamics of Moving Bodies},
  journal = {Annalen der Physik},
  year = {1905},
  volume = {17},
  pages = {891--921}
}

@book{knuth1984,
  author = {Knuth, Donald E.},
  title = {The TeXbook},
  publisher = {Addison-Wesley},
  year = {1984}
}
```

2. **In LaTeX document**:
```latex
\documentclass{article}
\usepackage{natbib}

\begin{document}

According to Einstein~\cite{einstein1905}...
Knuth explains~\cite{knuth1984}...

\bibliographystyle{plain}
\bibliography{references}  % references.bib

\end{document}
```

3. **Compile**:
```bash
pdflatex document.tex
bibtex document
pdflatex document.tex
pdflatex document.tex
```

## Entry Types

### Article (Journal Paper)
```bibtex
@article{key,
  author = {Last, First and Last, First},
  title = {Article Title},
  journal = {Journal Name},
  year = {2024},
  volume = {10},
  number = {5},
  pages = {100--120},
  doi = {10.1234/example}
}
```

### Book
```bibtex
@book{key,
  author = {Last, First},
  title = {Book Title},
  publisher = {Publisher Name},
  year = {2024},
  edition = {2nd},
  isbn = {978-1234567890}
}
```

### Conference Paper
```bibtex
@inproceedings{key,
  author = {Last, First},
  title = {Paper Title},
  booktitle = {Proceedings of Conference},
  year = {2024},
  pages = {50--60},
  organization = {IEEE}
}
```

### Master's/PhD Thesis
```bibtex
@mastersthesis{key,
  author = {Last, First},
  title = {Thesis Title},
  school = {University Name},
  year = {2024}
}

@phdthesis{key,
  author = {Last, First},
  title = {Dissertation Title},
  school = {University Name},
  year = {2024}
}
```

### Technical Report
```bibtex
@techreport{key,
  author = {Last, First},
  title = {Report Title},
  institution = {Institution Name},
  year = {2024},
  number = {TR-2024-01}
}
```

### Website/URL
```bibtex
@misc{key,
  author = {Last, First},
  title = {Webpage Title},
  howpublished = {\url{https://example.com}},
  year = {2024},
  note = {Accessed: 2024-01-01}
}
```

## Citation Styles

### natbib Package
```latex
\usepackage{natbib}

% Citations
\cite{key}           % [1]
\citet{key}          % Einstein [1]
\citep{key}          % (Einstein, 1905)
\citet*{key}         % Einstein and Author [1]
\citep*{key}         % (Einstein and Author, 1905)

% Multiple citations
\cite{key1,key2,key3}
\citep[see][p.~10]{key}  % (see Einstein, 1905, p. 10)
```

### Bibliography Styles
```latex
\bibliographystyle{plain}      % [1] Sorted alphabetically
\bibliographystyle{unsrt}      % [1] Sorted by citation order
\bibliographystyle{abbrv}      % [1] Abbreviated names
\bibliographystyle{alpha}      % [Ein05] Abbreviated author+year
\bibliographystyle{plainnat}   % (Einstein, 1905)
\bibliographystyle{abbrvnat}   % (Einstein, 1905) abbreviated
\bibliographystyle{unsrtnat}   % (Einstein, 1905) unsorted
```

## BibLaTeX (Modern Alternative)

### Setup
```latex
\usepackage[
  backend=biber,
  style=authoryear,    % or numeric, alphabetic
  sorting=nyt          % name, year, title
]{biblatex}

\addbibresource{references.bib}

\begin{document}

\cite{key}
\parencite{key}
\textcite{key}

\printbibliography

\end{document}
```

### Compile with BibLaTeX
```bash
pdflatex document.tex
biber document
pdflatex document.tex
pdflatex document.tex
```

### BibLaTeX Styles
```latex
style=numeric        % [1]
style=alphabetic     % [Ein05]
style=authoryear     % (Einstein, 1905)
style=authortitle    % (Einstein, TeXbook)
style=verbose        % Full citation in footnotes
```

## Managing References

### Tools for Bibliography Management
- **Zotero**: Free, open-source reference manager
- **Mendeley**: Free with PDF annotation
- **JabRef**: BibTeX-specific editor
- **BibDesk**: Mac-only BibTeX manager

### Exporting from Google Scholar
1. Search for paper
2. Click "Cite"
3. Click "BibTeX"
4. Copy to `.bib` file

### Automatic BibTeX from DOI
```bash
# Using doi2bib.org
curl "https://doi2bib.org/bib/10.1234/example" >> references.bib
```

## Best Practices

### Entry Keys
```bibtex
% Good keys:
einstein1905relativity
smith2024machine-learning
doe2023covid

% Avoid:
entry1
ref2
a
```

### Author Names
```bibtex
% Single author
author = {Last, First}

% Multiple authors
author = {Last1, First1 and Last2, First2 and Last3, First3}

% Organizations
author = {{World Health Organization}}

% With Jr., III, etc.
author = {King, Jr., Martin Luther}
```

### Titles
```bibtex
% Capitalize properly
title = {The Theory of Relativity}

% Protect capitalization
title = {Introduction to {NASA} Projects}
title = {{LaTeX} for Beginners}

% Special characters
title = {The \LaTeX\ Companion}
```

### Fields
```bibtex
% Required vs optional depends on entry type
% Check documentation for each type

% Common optional fields:
doi = {10.1234/example}
url = {https://example.com}
note = {Additional information}
isbn = {978-1234567890}
```

## Custom Bibliography

### Manually Create Bibliography
```latex
\begin{thebibliography}{99}
  \bibitem{einstein}
    Einstein, A. (1905).
    \textit{On the Electrodynamics of Moving Bodies}.
    Annalen der Physik, 17, 891--921.
    
  \bibitem{knuth}
    Knuth, D. E. (1984).
    \textit{The TeXbook}.
    Addison-Wesley.
\end{thebibliography}
```

### Split Bibliography by Type
```latex
\usepackage[style=authoryear]{biblatex}

\printbibliography[type=article,title={Journal Articles}]
\printbibliography[type=book,title={Books}]
\printbibliography[type=inproceedings,title={Conference Papers}]
```

## Troubleshooting

### Issue: Citations show as [?]
**Solution**: Run BibTeX/Biber and compile twice:
```bash
pdflatex document.tex
bibtex document.tex
pdflatex document.tex
pdflatex document.tex
```

### Issue: "Empty bibliography"
**Causes**:
1. No `\cite{}` commands in document
2. `.bib` file not found
3. BibTeX/Biber not run

**Solution**: Add citations and run full compile workflow

### Issue: Special characters broken
```bibtex
% Escape special characters:
title = {The \& Symbol in \LaTeX}
title = {Price: \$100}
```

### Issue: Author "and" showing in output
**Solution**: Use proper BibTeX syntax:
```bibtex
% Wrong:
author = {Smith, J. and Jones, M.}

% Right:
author = {Smith, J. and Jones, M.}
```

## Reference

### Quick Entry Template
```bibtex
@article{authorYEAR,
  author = {},
  title = {},
  journal = {},
  year = {},
  volume = {},
  pages = {}
}
```

### Common Fields
- `author` - Author(s)
- `title` - Title
- `year` - Publication year
- `journal` - Journal name (articles)
- `booktitle` - Book/conference title (inproceedings)
- `publisher` - Publisher (books)
- `pages` - Page numbers (e.g., "100--120")
- `volume` - Volume number
- `number` - Issue number
- `doi` - Digital Object Identifier
- `url` - Web address
- `note` - Additional notes
