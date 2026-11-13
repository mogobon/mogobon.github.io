tags: [数学, 整数論, 合同式]
---
# 一次合同式と乗法逆元 — 解の存在条件・周期・符号の考察

整数の一次合同式を、元の試行錯誤（誤った変形を含む）を残しながら整理する。特に、**解の存在条件は最大公約数で決まり、解がある場合は約分後の乗法逆元で求められる**ことを確かめる。

以下、法 $m,N$ は正整数とし、逆元 $u^{-1}$ は**指定した法での乗法逆元**を意味する。$\bmod$ は $0$ 以上の代表元を返す演算とする。

## 1. $S+Kx\equiv0\pmod N$ を解く

はじめの発想は、次のように $K$ で割ることだった。

$$
\begin{aligned}
S+Kx&\equiv0\pmod N\\
Kx&\equiv-S\pmod N\\
x&\equiv-SK^{-1}\pmod N
\end{aligned}
$$

最後の行は **$\gcd(K,N)=1$ のときに限り**正しい。互いに素でない場合は、整数の等式に戻す。

$$
\begin{aligned}
S+Kx&=Ny\quad(y\in\mathbb Z)\\
Kx-Ny&=-S\\
d&=\gcd(K,N)
\end{aligned}
$$

### 解の存在条件

- **$d\nmid S$**：左辺 $Kx-Ny$ は $d$ の倍数だが右辺 $-S$ は違うので、**解なし**。
- **$d\mid S$**：両辺を $d$ で割れる。$\gcd(K/d,N/d)=1$ なので、ベズーの等式から**整数解が存在する**。

$$
\begin{aligned}
\frac Kd x-\frac Nd y&=-\frac Sd\\
\gcd\left(\frac Kd,\frac Nd\right)&=1\\
\frac Kd x&\equiv-\frac Sd\pmod{N/d}\\
x&\equiv-\frac Sd\left(\frac Kd\right)^{-1}\pmod{N/d}\\
x_{\min}&=\left(-\frac Sd\left(\frac Kd\right)^{-1}\right)\bmod(N/d)
\end{aligned}
$$

逆元は **mod $N/d$** で取る。整数解全体は $x=x_{\min}+(N/d)t$（$t\in\mathbb Z$）で、**周期は $N/d$**。元の mod $N$ の範囲には、相異なる解がちょうど $d$ 個ある。

### よくある誤り：最大公約数を取る相手

同じ問題を $ax+b\equiv0\pmod m$ と書いたときは、$K=a,\ S=b,\ N=m$ と対応する。したがって **$d=\gcd(a,m)$** を使う。

元の考察では $d=\gcd(a,b)$ とし、$d\nmid m$ なら解なしと考えたが、これは誤り。例えば $a=2,\ b=2,\ m=3$ では $\gcd(a,b)=2\nmid3$ だが、$x=2$ なら $2x+2=6$ で解がある。

元のメモで $u=a/d,\ v=b/d,\ n=m/d$ とおいた場合、$\gcd(u,v)=1$ とするのも誤りで、正しくは **$\gcd(u,n)=1$**。また $(ux+v)\mid n$ ではなく、$ux+v=kn$ より **$n\mid(ux+v)$**。

## 2. 合同式と整除の定義を確認する

$$
\begin{aligned}
a\equiv0\pmod m
&\iff\exists k\in\mathbb Z,\ a=mk\\
&\iff m\mid a\\[4pt]
ax\equiv0\pmod m
&\iff\exists k\in\mathbb Z,\ ax=mk\\
&\iff m\mid ax
\end{aligned}
$$

### $ax\equiv0\pmod m$ の場合分け

**場合A：$\gcd(a,m)=1$**

$a$ の乗法逆元が存在する。

元のメモでは $a^{-1}ax\equiv a^{-1}x$ と書いていたが、これは右辺の $0$ を正しく掛けていない。正しくは次の通り。

$$
\begin{aligned}
ax&\equiv0\pmod m\\
a^{-1}ax&\equiv a^{-1}\cdot0\pmod m\\
x&\equiv0\pmod m\\
x&=ml\qquad(l\in\mathbb Z)
\end{aligned}
$$

$a>0$ は不要。$a<0$ でも互いに素なら逆元は存在する。また $a=0$ の場合、$m>1$ では $\gcd(0,m)=m$ なので次の一般式で扱える。

**場合B：$\gcd(a,m)>1$**

$$
\begin{aligned}
d&=\gcd(a,m)\\
ax&=mk\\
\frac adx&=\frac md k\\
\gcd\left(\frac ad,\frac md\right)&=1\qquad(1)\\
b&=\frac ad,\quad n=\frac md\\
bx&=nk\\
bx&\equiv0\pmod n\\
n&\mid bx\\
\frac md&\mid\frac ad x\\
\frac adx&\equiv0\pmod{m/d}\\
(1)&\implies x\equiv0\pmod{m/d}\\
x&=\frac md l\qquad(l\in\mathbb Z)
\end{aligned}
$$

### 具体例：なぜ法を最大公約数で割るのか？

$6x\equiv0\pmod{15}$ を考える。これは $15\mid6x$ という意味。$\gcd(6,15)=3$ なので、同じ整数の等式を3で割れば

$
\begin{aligned}
15\mid6x
&\iff \exists k\in\mathbb Z,\ 6x=15k\\
&\iff \exists k\in\mathbb Z,\ 2x=5k\\
&\iff 5\mid2x\\
&\iff 5\mid x\\
&\iff x\equiv0\pmod5
\end{aligned}
$

となる。最後は、2と5が互いに素だから。例えば $x=5,10,15,\dots$ は解である。

**「$6x$ が15の倍数になるために必要な3の因数は、6がすでに持っている」** と考えるとよい。一般にも、$a$ と $m$ に共通する因数を除いたあと、$x$ が残りの $m/\gcd(a,m)$ の倍数になる必要がある。

つまり、両場合をまとめて

$$
\boxed{ax\equiv0\pmod m\iff x\equiv0\pmod{\frac{m}{\gcd(a,m)}}}
$$

と書ける。$m=1$ の場合も両辺はすべての整数 $x$ について成り立つ。

### 「素数なら積のどちらかが割り切れる」は役に立つのか？

$m$ が素数なら、ユークリッドの補題より

$$
\begin{aligned}
m\mid ax&\iff m\mid a\ \lor\ m\mid x
\end{aligned}
$$

これは役に立つ。特に $m\nmid a$ なら $m\mid ax$ から $m\mid x$ が導けて、**合同式で約分できる理由**になっている。

## 3. $ax+b\equiv0\pmod m$ と符号の考察

$$
\begin{aligned}
ax+b&\equiv0\pmod m\\
ax&\equiv-b\pmod m\\
ax&\equiv b\pmod m\quad\text{（誤った変形）}
\end{aligned}
$$

$-b$ を $b$ に置き換えられるのは、両者が合同な場合だけ。

$$
\begin{aligned}
-b\equiv b\pmod m
&\iff-2b\equiv0\pmod m\\
&\iff2b\equiv0\pmod m\\
&\iff m\mid2b
\end{aligned}
$$

したがって、$m\nmid2b$ なら $b$ と $-b$ は異なる剰余類である。

一方で、**整除の記号**では符号を変えてもよい。

$$
\begin{aligned}
m\mid a
&\iff a=mk\quad(\exists k\in\mathbb Z)\\
-m\mid a
&\iff a=-mk\quad(\exists k\in\mathbb Z)\\
&\iff a=mk\quad(\exists k\in\mathbb Z)
\quad(\because\mathbb Z=-\mathbb Z)\\
m\mid-a
&\iff-a=mk\quad(\exists k\in\mathbb Z)\\
&\iff a=-mk\quad(\exists k\in\mathbb Z)\\
&\iff-m\mid a\\
-m\mid-a
&\iff-a=-mk\quad(\exists k\in\mathbb Z)\\
&\iff a=mk\quad(\exists k\in\mathbb Z)
\end{aligned}
$$

ここで $-1$ を両辺に掛けた等式は元の等式と同値。また $k$ は全整数を動くので、$-k$ と書き直しても範囲が変わらない。

$$
\boxed{m\mid a\iff-m\mid a\iff m\mid-a\iff-m\mid-a}
$$

**合同式で $b$ と $-b$ が同じとは限らないことと、整除関係で符号を変えられることは別の話。**

## 4. まとめ

$$
\boxed{\begin{gathered}
ax+b\equiv0\pmod m,\qquad d=\gcd(a,m)\\
d\nmid b\ \Rightarrow\ \text{解なし}\\
d\mid b\ \Rightarrow\
x\equiv-\frac bd\left(\frac ad\right)^{-1}\pmod{m/d}
\end{gathered}}
$$

最小の非負整数解は

$$
\boxed{x_{\min}=\left(-\frac bd\left(\frac ad\right)^{-1}\right)\bmod(m/d)}
$$

**持ち帰り：一次合同式は、まず最大公約数で解の存在を判定し、解があれば約分して乗法逆元を使う。** なお法が1なら合同式はすべて成立し、代表元は0とする。
