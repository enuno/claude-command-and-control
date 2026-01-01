# LaTeX Formatting Reference

## Font Commands

### Font Families
```latex
\textrm{Roman (serif)}         % Default
\textsf{Sans Serif}
\texttt{Typewriter (monospace)}
```

### Font Shapes
```latex
\textup{Upright}               % Default
\textit{Italic}
\textsl{Slanted}
\textsc{Small Caps}
```

### Font Weights
```latex
\textmd{Medium}                % Default
\textbf{Boldface}
```

### Combining Attributes
```latex
\textbf{\textit{Bold Italic}}
\textsf{\textbf{Sans Serif Bold}}
```

## Font Sizes

```latex
{\tiny Tiny text}
{\scriptsize Script size}
{\footnotesize Footnote size}
{\small Small}
{\normalsize Normal}            % Default
{\large Large}
{\Large Larger}
{\LARGE Even larger}
{\huge Huge}
{\Huge Hugest}
```

## Color

```latex
\usepackage{xcolor}

\textcolor{red}{Red text}
\textcolor{blue!50}{Light blue}
\colorbox{yellow}{Highlighted text}
\fcolorbox{red}{yellow}{Boxed text}

% Define custom colors
\definecolor{myblue}{RGB}{0,100,200}
\textcolor{myblue}{Custom blue}
```

## Lists

### Itemize (Bulleted)
```latex
\begin{itemize}
  \item First item
  \item Second item
    \begin{itemize}
      \item Nested item
      \item Another nested
    \end{itemize}
  \item Third item
\end{itemize}
```

### Enumerate (Numbered)
```latex
\begin{enumerate}
  \item First item
  \item Second item
    \begin{enumerate}
      \item Nested 1
      \item Nested 2
    \end{enumerate}
  \item Third item
\end{enumerate}
```

### Description Lists
```latex
\begin{description}
  \item[Term 1] Definition of term 1
  \item[Term 2] Definition of term 2
\end{description}
```

### Custom Lists (enumitem package)
```latex
\usepackage{enumitem}

% Compact lists
\begin{itemize}[noitemsep]
  \item Item 1
  \item Item 2
\end{itemize}

% Custom labels
\begin{enumerate}[label=(\alph*)]  % (a), (b), (c)
  \item First
  \item Second
\end{enumerate}

\begin{enumerate}[label=\Roman*.]  % I., II., III.
  \item First
  \item Second
\end{enumerate}
```

## Paragraph Formatting

### Line Spacing
```latex
\usepackage{setspace}

\singlespacing              % 1.0
\onehalfspacing            % 1.5
\doublespacing             % 2.0

% Custom spacing
\setstretch{1.25}

% Temporary spacing
\begin{spacing}{1.5}
  Double-spaced paragraph.
\end{spacing}
```

### Paragraph Indentation
```latex
\setlength{\parindent}{0pt}     % No indent
\setlength{\parindent}{1cm}     % Custom indent

\noindent This paragraph has no indent.
```

### Paragraph Spacing
```latex
\setlength{\parskip}{1em}       % Space between paragraphs
```

### Alignment
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

% Justified (default)
```

## Page Layout

### Margins
```latex
\usepackage[margin=1in]{geometry}

% Or specify individually:
\usepackage{geometry}
\geometry{
  top=1in,
  bottom=1in,
  left=1.5in,
  right=1.5in
}
```

### Page Size
```latex
\usepackage[a4paper]{geometry}   % A4
\usepackage[letterpaper]{geometry} % Letter

% Custom size
\usepackage{geometry}
\geometry{
  paperwidth=8.5in,
  paperheight=11in
}
```

### Headers and Footers
```latex
\usepackage{fancyhdr}
\pagestyle{fancy}

\fancyhf{}  % Clear all
\fancyhead[L]{Left Header}
\fancyhead[C]{Center Header}
\fancyhead[R]{Right Header}
\fancyfoot[C]{\thepage}

% For two-sided documents
\fancyhead[LE,RO]{Outer}
\fancyhead[RE,LO]{Inner}

% Line width
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\footrulewidth}{0.4pt}
```

## Columns

### Two-Column Document
```latex
\documentclass[twocolumn]{article}

% Or temporarily:
\twocolumn[Title and abstract spanning both columns]
\onecolumn
```

### Multicol Package
```latex
\usepackage{multicol}

\begin{multicols}{2}
  Text in two columns
\end{multicols}

\begin{multicols}{3}
  Text in three columns
\end{multicols}
```

## Quotations

### Short Quotes
```latex
\begin{quote}
  Short quotation
\end{quote}
```

### Long Quotes
```latex
\begin{quotation}
  Longer quotation with
  multiple paragraphs.
  
  Second paragraph.
\end{quotation}
```

### Verse
```latex
\begin{verse}
  Poetry line 1 \\
  Poetry line 2 \\
  Poetry line 3
\end{verse}
```

## Footnotes and Margin Notes

### Footnotes
```latex
This is text\footnote{This is a footnote}.

% Custom mark
This is text\footnotemark[5]
\footnotetext[5]{Custom numbered footnote}
```

### Margin Notes
```latex
This is text.\marginpar{Margin note here}
```

## Verbatim Text

### Inline Code
```latex
Use the \verb|command| to display code.
\verb+Another delimiter+
```

### Code Blocks
```latex
\begin{verbatim}
def hello():
    print("Hello, World!")
\end{verbatim}
```

### Code with Listings
```latex
\usepackage{listings}
\lstset{
  basicstyle=\ttfamily,
  keywordstyle=\color{blue},
  commentstyle=\color{gray},
  numbers=left,
  frame=single
}

\begin{lstlisting}[language=Python]
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n-1)
\end{lstlisting}
```

## Special Characters

### Accents
```latex
\'e  % é (acute)
\`e  % è (grave)
\"o  % ö (umlaut)
\^o  % ô (circumflex)
\~n  % ñ (tilde)
\=o  % ō (macron)
\.o  % ȯ (dot)
\u{o} % ŏ (breve)
\v{s} % š (caron)
\c{c} % ç (cedilla)
```

### Other Languages
```latex
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[english,french,german]{babel}

% Then you can use UTF-8 directly:
café, naïve, Zürich
```

## Boxes

### Framebox
```latex
\fbox{Boxed text}
\framebox[5cm]{Boxed with width}
\framebox[5cm][r]{Right-aligned}  % [l], [c], [r]
```

### Parbox
```latex
\parbox{5cm}{
  Paragraph box with
  multiple lines.
}
```

### Minipage
```latex
\begin{minipage}{0.4\textwidth}
  Content in left column
\end{minipage}
\hfill
\begin{minipage}{0.4\textwidth}
  Content in right column
\end{minipage}
```

## Spacing Commands

### Horizontal Spacing
```latex
\hspace{1cm}              % Fixed space
\hfill                    % Fill available space
\quad                     % 1em space
\qquad                    % 2em space
~                         % Non-breaking space
\,                        % Thin space
\:                        % Medium space
\;                        % Thick space
```

### Vertical Spacing
```latex
\vspace{1cm}              % Fixed space
\vfill                    % Fill available space
\bigskip                  % Large skip
\medskip                  % Medium skip
\smallskip                % Small skip
```

## Line Breaks

```latex
First line\\              % Line break
Second line

First line\\[1cm]         % Line break with space
Second line

\newline                  % Alternative line break
\linebreak                % Break with justification
\nolinebreak              % Prevent line break
```

## Page Breaks

```latex
\newpage                  % Start new page
\pagebreak                % Break with vertical fill
\nopagebreak              % Prevent page break
\clearpage                % New page + flush floats
\cleardoublepage          % For two-sided documents
```

## URLs and Hyperlinks

```latex
\usepackage{hyperref}

\href{https://www.example.com}{Click here}
\url{https://www.example.com}

% Configure hyperref
\hypersetup{
  colorlinks=true,
  linkcolor=blue,
  urlcolor=cyan,
  citecolor=green
}
```

## Custom Commands

```latex
% Simple command
\newcommand{\R}{\mathbb{R}}
Usage: $x \in \R$

% Command with arguments
\newcommand{\vect}[1]{\mathbf{#1}}
Usage: $\vect{v}$

% Command with optional argument
\newcommand{\derivative}[2][x]{\frac{d #2}{d #1}}
Usage: $\derivative{f}$ or $\derivative[t]{f}$
```

## Conditional Formatting

```latex
\ifthenelse{condition}{true-text}{false-text}

% Example
\usepackage{ifthen}
\newcommand{\grade}[1]{%
  \ifthenelse{#1 > 90}{A}{%
  \ifthenelse{#1 > 80}{B}{%
  \ifthenelse{#1 > 70}{C}{%
  F}}}%
}
```

## Best Practices

1. **Consistent formatting**: Choose conventions and stick to them
2. **Use packages**: Don't reinvent the wheel
3. **Semantic markup**: Use `\emph` instead of `\textit` for emphasis
4. **Custom commands**: Define macros for repeated formatting
5. **Whitespace**: Use blank lines for new paragraphs, not `\\`
6. **Comments**: Document complex formatting choices
