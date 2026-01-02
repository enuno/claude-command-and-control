# LaTeX Mathematics Reference

## Math Mode Basics

### Inline Math
```latex
The equation $E = mc^2$ is Einstein's famous formula.
% Alternative: \(E = mc^2\)
```

### Display Math (Unnumbered)
```latex
The quadratic formula is:
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$
% Alternative: \[x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\]
```

### Numbered Equations
```latex
\begin{equation}
  F = ma
  \label{eq:newton}
\end{equation}
```

## Essential Math Packages

```latex
\usepackage{amsmath}    % Advanced math environments
\usepackage{amssymb}    % Additional symbols
\usepackage{amsthm}     % Theorem environments
\usepackage{mathtools}  % Extensions to amsmath
```

## Superscripts and Subscripts

```latex
$x^2$              % Superscript (power)
$x_i$              % Subscript (index)
$x^{2y}$           % Multi-character superscript
$x_{i,j}$          % Multi-character subscript
$x_i^2$            % Both (subscript first!)
$x^2_i$            % Both (superscript first!)
```

## Fractions

```latex
$\frac{1}{2}$                    % Standard fraction
$\tfrac{1}{2}$                   % Text-style (smaller)
$\dfrac{1}{2}$                   % Display-style (larger)
$\frac{x + y}{x - y}$            % Complex numerator/denominator
$\frac{\frac{1}{x} + 1}{\frac{1}{y} + 1}$  % Nested fractions

% Binomial coefficients
$\binom{n}{k}$
```

## Roots

```latex
$\sqrt{x}$                       % Square root
$\sqrt[3]{x}$                    % Cube root
$\sqrt[n]{x}$                    % nth root
$\sqrt{x^2 + y^2}$               % Complex expression
```

## Greek Letters

### Lowercase
```latex
$\alpha$ $\beta$ $\gamma$ $\delta$ $\epsilon$ $\varepsilon$
$\zeta$ $\eta$ $\theta$ $\vartheta$ $\iota$ $\kappa$
$\lambda$ $\mu$ $\nu$ $\xi$ $\pi$ $\varpi$
$\rho$ $\varrho$ $\sigma$ $\varsigma$ $\tau$ $\upsilon$
$\phi$ $\varphi$ $\chi$ $\psi$ $\omega$
```

### Uppercase
```latex
$\Gamma$ $\Delta$ $\Theta$ $\Lambda$ $\Xi$ $\Pi$
$\Sigma$ $\Upsilon$ $\Phi$ $\Psi$ $\Omega$
```

## Mathematical Operators

### Basic
```latex
$+$ $-$ $\times$ $\div$ $\pm$ $\mp$
$\cdot$ $\ast$ $\star$ $\circ$ $\bullet$
```

### Comparison
```latex
$=$ $\neq$ $\equiv$ $\approx$ $\sim$ $\simeq$
$<$ $>$ $\leq$ $\geq$ $\ll$ $\gg$
$\in$ $\notin$ $\subset$ $\subseteq$ $\supset$ $\supseteq$
```

### Logic
```latex
$\land$ (and)  $\lor$ (or)  $\lnot$ (not)
$\forall$ (for all)  $\exists$ (exists)
$\implies$ $\iff$ $\Rightarrow$ $\Leftarrow$ $\Leftrightarrow$
```

### Calculus
```latex
$\int$ $\iint$ $\iiint$ $\oint$ $\nabla$ $\partial$
$\infty$ $\lim$ $\sum$ $\prod$
```

## Integrals

```latex
% Basic integral
$\int f(x) dx$

% Definite integral
$\int_0^1 f(x) dx$

% Multiple integrals
$\iint_D f(x,y) dA$
$\iiint_V f(x,y,z) dV$

% Contour integral
$\oint_C f(z) dz$

% Limits on integrals
$\int\limits_0^{\infty} e^{-x} dx$
```

## Sums and Products

```latex
% Summation
$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

% Product
$\prod_{i=1}^{n} i = n!$

% Limits above/below (display mode)
$$\sum_{i=1}^{n} a_i$$

% Limits beside (inline mode)
$\sum\limits_{i=1}^{n} a_i$
```

## Limits

```latex
$\lim_{x \to 0} \frac{\sin x}{x} = 1$
$\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e$

% One-sided limits
$\lim_{x \to 0^+} f(x)$  % From right
$\lim_{x \to 0^-} f(x)$  % From left
```

## Matrices

### Basic Matrix
```latex
\begin{equation}
  A = \begin{matrix}
    a & b \\
    c & d
  \end{matrix}
\end{equation}
```

### Matrix with Brackets
```latex
% Parentheses
\begin{pmatrix}
  a & b \\
  c & d
\end{pmatrix}

% Square brackets
\begin{bmatrix}
  a & b \\
  c & d
\end{bmatrix}

% Curly braces
\begin{Bmatrix}
  a & b \\
  c & d
\end{Bmatrix}

% Vertical lines (determinant)
\begin{vmatrix}
  a & b \\
  c & d
\end{vmatrix}

% Double vertical lines
\begin{Vmatrix}
  a & b \\
  c & d
\end{Vmatrix}
```

### Large Matrix
```latex
\begin{bmatrix}
  a_{11} & a_{12} & \cdots & a_{1n} \\
  a_{21} & a_{22} & \cdots & a_{2n} \\
  \vdots & \vdots & \ddots & \vdots \\
  a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}
```

## Aligning Equations

### align Environment
```latex
\begin{align}
  x &= y + z \\
  &= a + b + c \\
  &= \alpha + \beta
\end{align}
```

### align* (Unnumbered)
```latex
\begin{align*}
  f(x) &= (x+1)^2 \\
       &= x^2 + 2x + 1
\end{align*}
```

### Aligned Equations with Single Number
```latex
\begin{equation}
  \begin{aligned}
    x &= y + z \\
    &= a + b
  \end{aligned}
\end{equation}
```

### Multiple Alignment Points
```latex
\begin{align}
  x &= y    &  a &= b \\
  x' &= y'  &  a' &= b'
\end{align}
```

## Cases and Piecewise Functions

```latex
f(x) = \begin{cases}
  x^2 & \text{if } x \geq 0 \\
  -x^2 & \text{if } x < 0
\end{cases}
```

## Brackets and Delimiters

### Auto-Sizing
```latex
\left( \frac{x}{y} \right)      % Auto-sized parentheses
\left[ \frac{x}{y} \right]      % Auto-sized brackets
\left\{ \frac{x}{y} \right\}    % Auto-sized braces
\left| \frac{x}{y} \right|      % Auto-sized vertical bars
\left\| \frac{x}{y} \right\|    % Auto-sized double bars
```

### Manual Sizing
```latex
\big( \Big( \bigg( \Bigg(       % Increasing sizes
\big[ \Big[ \bigg[ \Bigg[
\big\{ \Big\{ \bigg\{ \Bigg\{
```

### Mismatched Delimiters
```latex
\left. \frac{dx}{dy} \right|_{x=0}   % Derivative evaluated at point
```

## Spacing in Math Mode

```latex
% No space: $ab$
% Thin space: $a\,b$
% Medium space: $a\:b$
% Thick space: $a\;b$
% Quad space: $a\quad b$
% Double quad: $a\qquad b$

% Negative space: $a\!b$
```

## Text in Math Mode

```latex
$f(x) = x^2 \text{ for all } x \in \mathbb{R}$
$\text{area} = \pi r^2$
```

## Number Sets

```latex
\mathbb{N}  % Natural numbers
\mathbb{Z}  % Integers
\mathbb{Q}  % Rational numbers
\mathbb{R}  % Real numbers
\mathbb{C}  % Complex numbers
```

## Accents and Decorations

```latex
$\hat{x}$   $\widehat{xyz}$   % Hat
$\bar{x}$   $\overline{xyz}$  % Bar
$\tilde{x}$ $\widetilde{xyz}$ % Tilde
$\vec{x}$   $\overrightarrow{AB}$  % Vector arrow
$\dot{x}$   $\ddot{x}$       % Dots (derivatives)
```

## Advanced Equations

### System of Equations
```latex
\begin{equation}
  \begin{cases}
    2x + y = 5 \\
    x - 3y = 2
  \end{cases}
\end{equation}
```

### Multi-line Equation
```latex
\begin{multline}
  (a + b + c + d + e + f + g)^2 = \\
  a^2 + b^2 + c^2 + d^2 + e^2 + f^2 + g^2 + \\
  2ab + 2ac + 2ad + \cdots
\end{multline}
```

### Split Long Equation
```latex
\begin{equation}
  \begin{split}
    f(x) = a_0 + a_1x + a_2x^2 \\
         + a_3x^3 + a_4x^4 + a_5x^5
  \end{split}
\end{equation}
```

## Theorem Environments

```latex
\usepackage{amsthm}

% Define theorem styles
\newtheorem{theorem}{Theorem}[section]
\newtheorem{lemma}[theorem]{Lemma}
\newtheorem{corollary}[theorem]{Corollary}
\newtheorem{definition}{Definition}[section]

% Usage
\begin{theorem}[Pythagorean Theorem]
  In a right triangle, $a^2 + b^2 = c^2$.
\end{theorem}

\begin{proof}
  ... proof here ...
\end{proof}
```

## Common Mathematical Expressions

### Derivatives
```latex
$\frac{d}{dx} f(x)$                  % First derivative
$\frac{d^2}{dx^2} f(x)$              % Second derivative
$\frac{\partial}{\partial x} f(x,y)$  % Partial derivative
$f'(x)$ or $f''(x)$                  % Prime notation
```

### Set Notation
```latex
$\{1, 2, 3\}$                        % Set
$\{x \mid x > 0\}$                   % Set builder (mid)
$\{x : x > 0\}$                      % Set builder (colon)
$A \cup B$                           % Union
$A \cap B$                           % Intersection
$A \setminus B$                      % Set difference
$\emptyset$ or $\varnothing$         % Empty set
```

### Logic and Proofs
```latex
$\forall x \in \mathbb{R}$           % For all
$\exists x \in \mathbb{R}$           % There exists
$P \implies Q$                       % Implies
$P \iff Q$                           % If and only if
$\therefore$                         % Therefore
$\because$                           % Because
$\qed$ or \qedhere                   % End of proof
```

## Tips for Writing Math

1. **Use equation environments** for important formulas
2. **Add labels** to reference equations later: `\label{eq:name}`
3. **Use align** for multi-line derivations
4. **Use text** for words in math mode: `\text{area}`
5. **Group with braces**: `x^{10}` not `x^10` for multi-digit
6. **Spacing matters**: `f(x)` vs `f( x )` vs `f (x)`
7. **Break long equations** across multiple lines
8. **Use macros** for repeated expressions:
   ```latex
   \newcommand{\R}{\mathbb{R}}
   \newcommand{\norm}[1]{\|#1\|}
   ```

## Common Mistakes

❌ **Wrong**: `$$x = y$$` in middle of paragraph
✅ **Right**: Use `equation` environment

❌ **Wrong**: `x^10` (looks like x¹⁰)
✅ **Right**: `x^{10}`

❌ **Wrong**: `sin x`
✅ **Right**: `\sin x`

❌ **Wrong**: `|x|` for norm
✅ **Right**: `\|x\|` or `\norm{x}`

❌ **Wrong**: `...` for ellipsis
✅ **Right**: `\ldots` (low dots) or `\cdots` (centered dots)

## Additional Resources

- **Comprehensive Symbol List**: http://tug.ctan.org/info/symbols/comprehensive/symbols-a4.pdf
- **Detexify**: http://detexify.kirelabs.org (draw symbol to find command)
- **Math Mode Guide**: `texdoc mathmode`
- **AMS Math Guide**: `texdoc amsldoc`
