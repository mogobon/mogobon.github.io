tags: [数学, 整数論, 合同式]
---
# 一次合同式と乗法逆元 — 解の存在条件・周期・符号の考察

整数の一次合同式を、元の試行錯誤（誤った変形を含む）を残しながら整理する。特に、**解の存在条件は最大公約数で決まり、解がある場合は約分後の乗法逆元で求められる**ことを確かめる。

以下、法 $m,N$ は正整数とし、逆元 $u^{-1}$ は**指定した法での乗法逆元**を意味する。$\bmod$ は $0$ 以上の代表元を返す演算とする。

## 1. 合同式と整除の定義を確認する

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

### 整除の記号で符号を変える

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

### 「素数なら積のどちらかが割り切れる」は役に立つのか？

$m$ が素数なら、ユークリッドの補題より

$$
\begin{aligned}
m\mid ax&\iff m\mid a\ \lor\ m\mid x
\end{aligned}
$$

これは役に立つ。特に $m\nmid a$ なら $m\mid ax$ から $m\mid x$ が導けて、**合同式で約分できる理由**になっている。

## 2. 一次合同式の解の存在条件と逆元

$ax+b\equiv0\pmod m$ を整数の等式に戻すと

$$
\begin{aligned}
ax+b&=my\\
ax-my&=-b\qquad(y\in\mathbb Z)
\end{aligned}
$$

となる。$x,y$ の係数は $a,-m$、$-b$ は定数項なので、$d=\gcd(a,m)$ とおく。

- $d\nmid b$ なら解なし。
- $d\mid b$ なら $d$ で割った係数 $a/d,m/d$ は互いに素。ベズーの等式から整数解が存在する。

$m/d>1$ なら、法 $m/d$ における $a/d$ の逆元が存在するため、

$$
\begin{aligned}
\frac adx&\equiv-\frac bd\pmod{m/d}\\
x&\equiv-\frac bd\left(\frac ad\right)^{-1}\pmod{m/d}
\end{aligned}
$$

と解ける。$m/d=1$ なら、条件 $d\mid b$ が成立すればすべての整数 $x$ が解であり、最小の非負整数解は $0$。法 $1$ の逆元を計算する必要はない。

### 係数はどれ？ — gcd(a,b) と gcd(a,m) の区別

**gcd を取るのは、整数の等式に直したときの「未知数の係数」同士。** 定数項は gcd の対象ではなく、その gcd で割り切れるかを調べる。

| 元の式 | 整数の等式（未知数） | 解の存在条件 |
| --- | --- | --- |
| $ax+b\equiv0\pmod m$ | $ax-my=-b$（$x,y$） | $\gcd(a,m)\mid b$ |
| $ax\equiv c\pmod m$ | $ax-my=c$（$x,y$） | $\gcd(a,m)\mid c$ |
| $ax+by=c$ | そのまま（$x,y$） | $\gcd(a,b)\mid c$ |

見た目に $a,b$ が登場するから $\gcd(a,b)$、ではない。例えば $ax+b\equiv0\pmod m$ に出てくる $b$ は**定数**であり、係数は $a$ と $-m$。したがって $\gcd(a,m)$ を使う。

さらに、$\gcd(a,m)=1$ なら $a^{-1}\pmod m$ が存在する。互いに素でなくても $d=\gcd(a,m)$ が右辺を割り切れば、式全体を $d$ で割ったあとに逆元が存在する。

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

**合同式の右辺で $b$ と $-b$ は一般に交換できない。一方、整除の関係では符号を変えてもよい（§1）。**

## 4. 3つの見方を図でつなぐ（操作できる例）

同じ合同式を、**① mod の円周・② 2つの数列・③ 整数格子上の直線**として見比べる。問題を選び、$x$ を動かしてみよう。3枚の図は連動する。スマートフォンでは図のエリアを左右にスワイプできる。

<div id="congruence-views" class="congruence-widget">
  <div class="congruence-controls">
    <label>問題
      <select id="cg-case" aria-label="一次合同式の例">
        <option value="0">2x ≡ 3 (mod 5)：解あり・互いに素</option>
        <option value="1">6x ≡ 3 (mod 9)：解あり・共通因数あり</option>
        <option value="2">6x ≡ 4 (mod 9)：解なし</option>
      </select>
    </label>
    <label class="congruence-range">x = <strong id="cg-x-label">4</strong>
      <input id="cg-x" type="range" min="0" max="12" value="4" step="1">
    </label>
    <div class="congruence-buttons"><button type="button" id="cg-prev">− 1</button><button type="button" id="cg-next">+ 1</button></div>
  </div>
  <p id="cg-status" class="congruence-status" aria-live="polite"></p>
  <div class="congruence-scroll" tabindex="0" aria-label="3つの図を横スクロール">
    <div class="congruence-panels">
      <section class="congruence-panel"><h3>① 円周 — 合同式</h3><svg id="cg-circle" viewBox="0 0 270 235" role="img" aria-label="剰余の円周"></svg><p id="cg-circle-caption"></p></section>
      <section class="congruence-panel"><h3>② 数直線 — 数列の一致</h3><svg id="cg-line" viewBox="0 0 270 235" role="img" aria-label="二つの数列"></svg><p id="cg-line-caption"></p></section>
      <section class="congruence-panel"><h3>③ 格子点 — 不定方程式</h3><svg id="cg-lattice" viewBox="0 0 270 235" role="img" aria-label="直線と整数格子点"></svg><p id="cg-lattice-caption"></p></section>
    </div>
  </div>
  <p class="congruence-tip">← 図の部分を左右にスワイプ →（PCでは横スクロール）</p>
  <p id="cg-conclusion"></p>
</div>

<style>
.congruence-widget{border:1px solid #cbd5e1;border-radius:14px;padding:14px;margin:20px 0;background:#f8fafc;min-width:0}
.congruence-controls{display:flex;flex-wrap:wrap;align-items:end;gap:12px}
.congruence-controls label{display:flex;flex-direction:column;gap:5px;font-size:14px;min-width:0}
.congruence-controls select{max-width:100%;padding:9px;border:1px solid #94a3b8;border-radius:7px;background:white;font-size:14px}
.congruence-range{flex:1;min-width:140px!important}
#cg-x{width:100%;accent-color:#2563eb;touch-action:pan-y}
.congruence-buttons{display:flex;gap:6px}
.congruence-buttons button{border:1px solid #94a3b8;border-radius:8px;padding:9px 14px;background:white;color:#1e293b;cursor:pointer}
.congruence-status{font-weight:600;margin:12px 0!important}
.congruence-scroll{width:100%;max-width:100%;min-width:0;overflow-x:scroll;overflow-y:hidden;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y;scrollbar-width:auto;border-radius:10px}
.congruence-panels{display:flex;flex-wrap:nowrap;align-items:stretch;gap:12px;width:max-content;padding:2px 2px 10px}
.congruence-panel{flex:0 0 285px;width:285px;box-sizing:border-box;padding:10px;border:1px solid #cbd5e1;border-radius:10px;background:white}
.congruence-panel h3{font-size:15px;margin:0 0 7px;color:#1e40af}
.congruence-panel svg{display:block;width:100%;height:auto}
.congruence-panel p{font-size:13px;line-height:1.6;min-height:42px;margin:7px 0 0}
.congruence-tip{font-size:12px;color:#64748b;margin:5px 0!important}
#cg-conclusion{font-size:14px;background:#e2e8f0;padding:10px;border-radius:8px;margin-top:12px}
@media(max-width:480px){.congruence-widget{padding:9px}.congruence-panel{flex-basis:260px;width:260px}.congruence-controls{gap:8px}.congruence-controls select{width:100%}}
</style>

<script>
(function(){
  function boot(){
    const root=document.getElementById('congruence-views');
    if(!root || root.dataset.ready)return;
    root.dataset.ready='1';
    const q=id=>document.getElementById(id), cases=[[2,3,5],[6,3,9],[6,4,9]];
    const ns='http://www.w3.org/2000/svg';
    const mod=(v,m)=>(v%m+m)%m;
    const gcd=(a,b)=>b?gcd(b,a%b):a;
    const elt=(name,attrs={},value)=>{
      const t=document.createElementNS(ns,name);
      Object.entries(attrs).forEach(([k,v])=>t.setAttribute(k,String(v)));
      if(value!==undefined)t.textContent=String(value);
      return t;
    };
    function render(){
      const [a,b,m]=cases[Number(q('cg-case').value)],x=Number(q('cg-x').value),v=a*x,r=mod(v,m),good=r===b;
      q('cg-x-label').textContent=x;
      q('cg-status').textContent=good?'✓ '+a+'×'+x+'='+v+'：解になっている':'a×x = '+v+'、余りは '+r+'（目標は '+b+'）';
      q('cg-status').style.color=good?'#047857':'#334155';
      const circle=q('cg-circle');circle.replaceChildren();
      circle.appendChild(elt('circle',{cx:135,cy:113,r:76,fill:'none',stroke:'#cbd5e1','stroke-dasharray':'4 4'}));
      for(let i=0;i<m;i++){
        const t=-Math.PI/2+2*Math.PI*i/m,cx=135+76*Math.cos(t),cy=113+76*Math.sin(t);
        const current=i===r,target=i===b,fill=current&&target?'#047857':current?'#2563eb':target?'#059669':'#e2e8f0';
        circle.appendChild(elt('circle',{cx,cy,r:15,fill}));
        circle.appendChild(elt('text',{x:cx,y:cy+4,'text-anchor':'middle','font-size':12,'font-weight':600,fill:current||target?'white':'#334155'},i));
      }
      const t=-Math.PI/2+2*Math.PI*r/m;
      circle.appendChild(elt('line',{x1:135,y1:113,x2:135+57*Math.cos(t),y2:113+57*Math.sin(t),stroke:'#2563eb','stroke-width':3}));
      circle.appendChild(elt('circle',{cx:135,cy:113,r:32,fill:'#dbeafe'}));
      circle.appendChild(elt('text',{x:135,y:110,'text-anchor':'middle','font-size':11,fill:'#1e40af'},'a×x'));
      circle.appendChild(elt('text',{x:135,y:127,'text-anchor':'middle','font-size':18,'font-weight':700,fill:'#1e40af'},v));
      q('cg-circle-caption').textContent='着地点は '+r+'、目標は '+b+'。'+(good?'一致！':'まだ一致しない。');

      const line=q('cg-line');line.replaceChildren();
      line.appendChild(elt('text',{x:12,y:19,'font-size':12,fill:'#2563eb'},'● ax の数列'));
      line.appendChild(elt('text',{x:142,y:19,'font-size':12,fill:'#059669'},'● b+mk の数列'));
      for(const y of [75,155])line.appendChild(elt('line',{x1:17,y1:y,x2:255,y2:y,stroke:'#94a3b8'}));
      const limit=Math.max(36,a*12,b+m*8),pos=n=>18+235*n/limit;
      for(let i=0;i<=12;i++){
        const value=a*i;if(value<=limit)line.appendChild(elt('circle',{cx:pos(value),cy:75,r:i===x?6:3,fill:'#2563eb',opacity:i===x?1:0.45}));
      }
      for(let i=0;i<=Math.ceil(limit/m);i++){
        const value=b+i*m;if(value<=limit)line.appendChild(elt('circle',{cx:pos(value),cy:155,r:4,fill:'#059669'}));
      }
      if(v<=limit)line.appendChild(elt('line',{x1:pos(v),x2:pos(v),y1:82,y2:148,stroke:good?'#059669':'#2563eb','stroke-dasharray':'4 4','stroke-width':2}));
      line.appendChild(elt('text',{x:135,y:119,'text-anchor':'middle','font-size':13,fill:'#334155'},'ax = '+v));
      line.appendChild(elt('text',{x:135,y:200,'text-anchor':'middle','font-size':13,fill:'#334155'},'k = '+((v-b)/m).toFixed(2)));
      q('cg-line-caption').textContent=good?'ax=b+mk となる整数 k が存在する。':'ax と b+mk がまだ一致しない。';

      const lattice=q('cg-lattice');lattice.replaceChildren();
      const sx=i=>24+i*19,sy=i=>195-i*22;
      for(let i=0;i<=12;i++)lattice.appendChild(elt('line',{x1:sx(i),x2:sx(i),y1:10,y2:214,stroke:'#e2e8f0'}));
      for(let i=-1;i<=8;i++)lattice.appendChild(elt('line',{x1:21,x2:257,y1:sy(i),y2:sy(i),stroke:'#e2e8f0'}));
      lattice.appendChild(elt('line',{x1:sx(0),y1:sy(-b/m),x2:sx(12),y2:sy((a*12-b)/m),stroke:'#2563eb','stroke-width':2.5}));
      for(let i=0;i<=12;i++){
        const kk=(a*i-b)/m;
        if(Number.isInteger(kk)&&kk>=-1&&kk<=8)lattice.appendChild(elt('circle',{cx:sx(i),cy:sy(kk),r:6,fill:'#059669',stroke:'white','stroke-width':1}));
      }
      const kk=(v-b)/m;
      if(kk>=-1&&kk<=8)lattice.appendChild(elt('circle',{cx:sx(x),cy:sy(kk),r:5,fill:good?'#059669':'#f59e0b',stroke:'white'}));
      for(let i=0;i<=12;i+=2)lattice.appendChild(elt('text',{x:sx(i),y:229,'text-anchor':'middle','font-size':10,fill:'#475569'},i));
      q('cg-lattice-caption').textContent='直線 ax−mk=b 上の k = '+kk.toFixed(2)+'。'+(good?'整数格子点に一致！':'整数とは限らない。');
      const d=gcd(a,m),sol=[];
      for(let i=0;i<m;i++)if(mod(a*i,m)===b)sol.push(i);
      q('cg-conclusion').textContent='gcd('+a+','+m+')='+d+'。'+(b%d?' '+b+' は '+d+' で割り切れないため解なし。':' '+b+' は '+d+' の倍数なので解あり。mod '+m+' での解は '+sol.join(', ')+'。');
    }
    q('cg-case').addEventListener('change',()=>{q('cg-x').value=0;render()});
    q('cg-x').addEventListener('input',render);
    q('cg-prev').addEventListener('click',()=>{q('cg-x').value=Math.max(0,Number(q('cg-x').value)-1);render()});
    q('cg-next').addEventListener('click',()=>{q('cg-x').value=Math.min(12,Number(q('cg-x').value)+1);render()});
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
</script>

## 5. 応用問題

### 5.1 ABC186 E — Throne

[問題：ABC186 E - Throne](https://atcoder.jp/contests/abc186/tasks/abc186_e) ／ [公式解説](https://atcoder.jp/contests/abc186/editorial/401?lang=ja)

$N$ 個の椅子が円環状に並び、開始位置は玉座から時計回りに $S$、一度の移動は $K$。玉座へ移動する最小回数 $x$ を求める問題。この条件は $S+Kx\equiv0\pmod N$ となる。

#### $S+Kx\equiv0\pmod N$ を解く

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

##### 解の存在条件

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

### 5.2 AWC0206 C — 円環のすごろく

[問題：AWC0206 C](https://atcoder.jp/contests/awc0206/tasks/awc0206_c)

$N$ マスの円環上で、ボタン $i$ を押すと $A_i$ マス進む。初期位置は $0$、目標は $G$。どのボタンも何回でも押せる（$0$ 回も可）。$N\le10^9,\ M\le10^6$ なので、各マスを直接探索するのは難しい。

#### ① 目標 $G$ を含む合同式にする

ボタン $i$ を押す回数を $x_i\ge0$ とすると、到達条件は

$
\begin{aligned}
\sum_{i=1}^{M}A_ix_i&\equiv G\pmod N
\end{aligned}
$

**ここは $\equiv0$ ではなく $\equiv G$。** $G$ は別に処理する情報ではなく、到達したい剰余そのもの。「何回押すか」と「どこに行くか」を、この式で一つにつなげる。

#### ② 合同式を整数の等式にする

$
\begin{aligned}
\sum_{i=1}^{M}A_ix_i&=G+Ny\\
\sum_{i=1}^{M}A_ix_i-Ny&=G
\qquad(y\in\mathbb Z)
\end{aligned}
$

この等式で**未知数の係数**は $A_1,\ldots,A_M,-N$、右辺の $G$ は定数。よって

$
\begin{aligned}
d&=\gcd(N,A_1,\ldots,A_M)
\end{aligned}
$

とすれば、整数解の存在条件は $d\mid G$ である。$N$ を gcd に入れる理由は、円環の「一周したら同じ位置」を整数の式に戻すと、$-Ny$ が現れるから。

#### ③ 押す回数が非負でも十分なのか？

ベズーの等式により、$d\mid G$ なら整数 $x_1,\ldots,x_M,y$ が存在し、上の等式を満たす。ただし、この時点では $x_i$ が負かもしれない。

**円環上では負の回数を非負に置き換えられる。** 各 $x_i$ に $N$ の倍数を十分足しても、

$
\begin{aligned}
A_i(x_i+kN)&\equiv A_ix_i\pmod N
\end{aligned}
$

だから到達位置は変わらない。こうして全ての $x_i$ を非負にできるので、$d\mid G$ は必要条件であるだけでなく**十分条件**にもなる。

例：$N=10,\ A=[6],\ G=2$。ボタンを2回押すと $6+6=12\equiv2\pmod{10}$。$\gcd(10,6)=2$ は $G=2$ を割り切る。一方、$G=3$ には到達できない。

#### ④ 判定と実装

$
\boxed{\text{到達可能}\iff \gcd(N,A_1,\ldots,A_M)\mid G}
$

~~~python
from math import gcd

N, M, G = map(int, input().split())
A = map(int, input().split())

d = N
for a in A:
    d = gcd(d, a)

print("Yes" if G % d == 0 else "No")
~~~

時間計算量は $O(M\log(\max(N,A_1,\ldots,A_M)))$ 程度。到達回数の最小値や具体的な操作列は求めず、**到達できるかだけ**を最大公約数で判定する。

#### 今回の発想の再現手順

1. 操作回数を未知数 $x_i$ とする。
2. $G$ を右辺に置いて、$\sum A_ix_i\equiv G\pmod N$ と書く。
3. $\sum A_ix_i-Ny=G$ に戻す。
4. 以前学んだ一次不定方程式の条件を使う。
5. 最後に、$x_i\ge0$ という元の制約を円環の性質で確認する。

**「新しい gcd の典型を暗記する」より、「操作を式にして既知の数学につなぐ」。**

## 6. まとめ

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
