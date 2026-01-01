# LaTeX Tables and Graphics Reference

## Basic Tables

### Simple Table
```latex
\begin{tabular}{|l|c|r|}
  \hline
  Left & Center & Right \\
  \hline
  Text & Text & Text \\
  More & Data & Here \\
  \hline
\end{tabular}
```

**Column Specifiers:**
- `l` - Left-aligned
- `c` - Centered
- `r` - Right-aligned
- `|` - Vertical line
- `||` - Double vertical line
- `p{width}` - Paragraph column with fixed width

### Table Environment (with caption)
```latex
\begin{table}[h]
  \centering
  \begin{tabular}{|c|c|c|}
    \hline
    Header 1 & Header 2 & Header 3 \\
    \hline
    Data 1 & Data 2 & Data 3 \\
    Data 4 & Data 5 & Data 6 \\
    \hline
  \end{tabular}
  \caption{Table caption}
  \label{tab:example}
\end{table}
```

### Professional Tables (booktabs)
```latex
\usepackage{booktabs}

\begin{table}[h]
  \centering
  \begin{tabular}{lcc}
    \toprule
    Item & Quantity & Price \\
    \midrule
    Apples & 5 & \$2.00 \\
    Oranges & 3 & \$1.50 \\
    \bottomrule
  \end{tabular}
  \caption{Professional table}
\end{table}
```

## Advanced Table Features

### Multicolumn
```latex
\begin{tabular}{|c|c|c|}
  \hline
  \multicolumn{3}{|c|}{Merged Header} \\
  \hline
  A & B & C \\
  \hline
\end{tabular}
```

### Multirow
```latex
\usepackage{multirow}

\begin{tabular}{|c|c|}
  \hline
  \multirow{2}{*}{Merged} & Row 1 \\
                          & Row 2 \\
  \hline
\end{tabular}
```

### Long Tables (spanning pages)
```latex
\usepackage{longtable}

\begin{longtable}{|c|c|c|}
  \caption{Long table} \\
  \hline
  \endfirsthead
  
  \multicolumn{3}{c}{Table continues...} \\
  \hline
  \endhead
  
  \hline
  \endfoot
  
  \hline
  \caption{(Continued)}
  \endlastfoot
  
  Data & Data & Data \\
  ... many rows ...
\end{longtable}
```

### Table Positioning
```latex
% Position specifiers:
[h]  % Here (approximately)
[t]  % Top of page
[b]  % Bottom of page
[p]  % Separate page for floats
[H]  % Exactly here (requires float package)

\usepackage{float}
\begin{table}[H]  % Force exact position
  ...
\end{table}
```

## Figures and Images

### Basic Figure
```latex
\usepackage{graphicx}

\begin{figure}[h]
  \centering
  \includegraphics{image.pdf}
  \caption{Figure caption}
  \label{fig:example}
\end{figure}
```

### Image with Size Control
```latex
% Width
\includegraphics[width=0.8\textwidth]{image.pdf}

% Height
\includegraphics[height=5cm]{image.pdf}

% Scale
\includegraphics[scale=0.5]{image.pdf}

% Keep aspect ratio
\includegraphics[width=\textwidth,height=8cm,keepaspectratio]{image.pdf}

% Rotation
\includegraphics[angle=90]{image.pdf}
```

### Supported Formats
- **PDF**: Best for vector graphics (preferred)
- **PNG**: Good for photos/screenshots
- **JPG**: Good for photos
- **EPS**: For older workflows

### Figure Path
```latex
% Set graphics path
\graphicspath{{figures/}{images/}}

% Then use:
\includegraphics{diagram.pdf}  % Searches in figures/ and images/
```

## Subfigures

```latex
\usepackage{subcaption}

\begin{figure}[h]
  \centering
  \begin{subfigure}{0.45\textwidth}
    \includegraphics[width=\textwidth]{image1.pdf}
    \caption{First subfigure}
    \label{fig:sub1}
  \end{subfigure}
  \hfill
  \begin{subfigure}{0.45\textwidth}
    \includegraphics[width=\textwidth]{image2.pdf}
    \caption{Second subfigure}
    \label{fig:sub2}
  \end{subfigure}
  \caption{Main figure caption}
  \label{fig:main}
\end{figure}
```

## Wrapping Text Around Figures

```latex
\usepackage{wrapfig}

\begin{wrapfigure}{r}{0.4\textwidth}
  \centering
  \includegraphics[width=0.38\textwidth]{image.pdf}
  \caption{Wrapped figure}
\end{wrapfigure}

Text flows around the figure...
```

## Side-by-Side Figures

```latex
\begin{figure}[h]
  \centering
  \includegraphics[width=0.45\textwidth]{image1.pdf}
  \hfill
  \includegraphics[width=0.45\textwidth]{image2.pdf}
  \caption{Two images side by side}
\end{figure}
```

## Captions

### Custom Caption Format
```latex
\usepackage{caption}

\captionsetup{
  font=small,
  labelfont=bf,
  format=hang
}
```

### Caption Position
```latex
% Above figure
\begin{figure}[h]
  \caption{Caption above}
  \centering
  \includegraphics{image.pdf}
\end{figure}

% Below figure (default)
\begin{figure}[h]
  \centering
  \includegraphics{image.pdf}
  \caption{Caption below}
\end{figure}
```

## List of Figures and Tables

```latex
% In front matter
\listoffigures
\listoftables
```

## Drawing with TikZ

```latex
\usepackage{tikz}

\begin{tikzpicture}
  % Draw a line
  \draw (0,0) -- (2,2);
  
  % Draw a rectangle
  \draw (0,0) rectangle (2,1);
  
  % Draw a circle
  \draw (1,1) circle (0.5);
  
  % Add text
  \node at (1,1) {Text};
\end{tikzpicture}
```

### Simple Diagram
```latex
\begin{tikzpicture}
  % Nodes
  \node[draw, circle] (A) at (0,0) {A};
  \node[draw, circle] (B) at (2,0) {B};
  \node[draw, circle] (C) at (1,2) {C};
  
  % Connections
  \draw[->] (A) -- (B);
  \draw[->] (B) -- (C);
  \draw[->] (C) -- (A);
\end{tikzpicture}
```

## Plots with PGFPlots

```latex
\usepackage{pgfplots}
\pgfplotsset{compat=1.18}

\begin{tikzpicture}
  \begin{axis}[
    xlabel=$x$,
    ylabel=$f(x)$
  ]
    \addplot[blue,domain=-5:5,samples=100] {x^2};
    \addplot[red,domain=-5:5,samples=100] {2*x + 1};
    \legend{$x^2$, $2x+1$}
  \end{axis}
\end{tikzpicture}
```

## Cross-Referencing

```latex
% Create labels
\begin{figure}
  ...
  \label{fig:example}
\end{figure}

\begin{table}
  ...
  \label{tab:data}
\end{table}

% Reference them
See Figure~\ref{fig:example} on page~\pageref{fig:example}.
As shown in Table~\ref{tab:data}...
```

## Best Practices

### Tables
1. Use `booktabs` for professional appearance
2. Avoid vertical lines in professional tables
3. Use `\caption` to describe table content
4. Place caption above table (convention)
5. Keep tables simple and readable
6. Use `tabularx` or `tabulary` for automatic width

### Figures
1. Use vector graphics (PDF) when possible
2. Place caption below figure (convention)
3. Make figures large enough to read
4. Use descriptive captions
5. Store images in subdirectory
6. Name files descriptively
7. Always use labels for cross-referencing

### General
1. Reference all figures and tables in text
2. Float placement: [htbp] is good default
3. Use meaningful labels: `fig:experiment_results`
4. Consistent caption formatting
5. Test different page sizes for positioning
