tags: [ABC, 振り返り, 考察]
---
# ABC486E 振り返り

[問題：ABC486 E](https://atcoder.jp/contests/abc486/tasks/abc486_e)

## 1. 問題概要

重み付き無向グラフにおいて、辺の重みが狭義単調増加する歩道のうち、辺の重みの総和が最大となるものを求める。同じ頂点を複数回訪問してもよい。

## 2. コンテスト中の考察

辺の重みの最小値を優先して BFS する方法や、各距離でスコアの最大値を管理する方法を考えた。

さらに、接続辺の情報を頂点に集約する方法として、次の3つを検討した。

- 各頂点に接続辺の min を持たせ、min の小さい順に見る。
- 各頂点に接続辺の max を持たせ、max に注目する。
- min と max を組み合わせる。

反例を検討した結果、これらの方針では全体最適を保証できないと判断し、方針を切り替えた。

頂点に情報を集約しようとする発想自体は悪くない。ただし、次に使える辺は直前に使った辺の重みに依存するため、接続辺の min と max だけでは中間の選択肢を失ってしまう。

## 3. コンテスト中によかったこと

さまざまな反例を自分で考え、局所的な選択だけでは最適解を求められないと考えた。

その結果、辺をすべて見る必要があると考えた。局所的な最適化では全体最適を保証できないため、何かしらの全探索をしたいと考えた。

<div style="max-width:560px;margin:1.5em auto;text-align:center;line-height:1.65">
<div style="padding:14px;border:1px solid #94a3b8;border-radius:9px">辺の重みを基準に貪欲法を考える</div>
<div style="padding:5px;font-size:22px">↓</div>
<div style="padding:14px;border:1px solid #94a3b8;border-radius:9px"><strong>反例を作る</strong><div>局所的な選択では全体最適を保証できない</div></div>
<div style="padding:5px;font-size:22px">↓</div>
<div style="padding:14px;border:1px solid #94a3b8;border-radius:9px"><strong>すべての辺を調べる必要がある</strong></div>
<div style="padding:5px;font-size:22px">↓</div>
<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
<div style="padding:14px 6px;background:rgba(148,163,184,.14);border:1px solid #94a3b8;border-radius:9px"><div style="font-size:.85em">本番中の発想</div><div style="font-size:1.5em;font-weight:bold">DFS</div><div>歩道を探索する</div></div>
<div style="padding:14px 6px;border:1px dashed #94a3b8;border-radius:9px"><div style="font-size:.85em">浮かばなかった発想</div><div style="font-size:1.5em;font-weight:bold">DP</div><div>探索状態を統合する</div></div>
</div>
</div>

## 4. コンテスト中にできなかったこと

何かしらの全探索が必要だと考え、DFS で歩道を探索すればよいのではないか、という発想に至った。

DFS の計算量が大きくなりそうだという認識はあった。しかし、歩道（walk）の探索でなぜ計算量が大きくなるのか、その仕組みを理解できていなかった。そのため、全探索を考えると DFS を選びがちだった。

### なぜ歩道の DFS は計算量が大きくなるのか

次のような分岐と合流を繰り返すグラフを考える。すべての左から右への歩道で、辺の重みが狭義単調増加する。

<div id="abc486-walk-demo" style="border:1px solid #94a3b8;border-radius:12px;padding:14px;margin:1.3em 0">
<div style="overflow-x:auto">
<svg id="abc486-walk-svg" viewBox="0 0 672 150" style="display:block;width:100%;min-width:480px;height:auto;margin:auto" role="img" aria-label="分岐と合流を繰り返すグラフ"><path d="M24 75 L76 25 L128 75 M24 75 L76 125 L128 75" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".65"/><circle cx="76" cy="25" r="6" fill="#94a3b8"/><text x="46" y="41" text-anchor="middle" fill="currentColor" font-size="12">1</text><text x="105" y="41" text-anchor="middle" fill="currentColor" font-size="12">2</text><circle cx="76" cy="125" r="6" fill="#94a3b8"/><text x="46" y="122" text-anchor="middle" fill="currentColor" font-size="12">1</text><text x="105" y="122" text-anchor="middle" fill="currentColor" font-size="12">2</text><path d="M128 75 L180 25 L232 75 M128 75 L180 125 L232 75" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".65"/><circle cx="180" cy="25" r="6" fill="#94a3b8"/><text x="150" y="41" text-anchor="middle" fill="currentColor" font-size="12">3</text><text x="209" y="41" text-anchor="middle" fill="currentColor" font-size="12">4</text><circle cx="180" cy="125" r="6" fill="#94a3b8"/><text x="150" y="122" text-anchor="middle" fill="currentColor" font-size="12">3</text><text x="209" y="122" text-anchor="middle" fill="currentColor" font-size="12">4</text><path d="M232 75 L284 25 L336 75 M232 75 L284 125 L336 75" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".65"/><circle cx="284" cy="25" r="6" fill="#94a3b8"/><text x="254" y="41" text-anchor="middle" fill="currentColor" font-size="12">5</text><text x="313" y="41" text-anchor="middle" fill="currentColor" font-size="12">6</text><circle cx="284" cy="125" r="6" fill="#94a3b8"/><text x="254" y="122" text-anchor="middle" fill="currentColor" font-size="12">5</text><text x="313" y="122" text-anchor="middle" fill="currentColor" font-size="12">6</text><path d="M336 75 L388 25 L440 75 M336 75 L388 125 L440 75" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".65"/><circle cx="388" cy="25" r="6" fill="#94a3b8"/><text x="358" y="41" text-anchor="middle" fill="currentColor" font-size="12">7</text><text x="417" y="41" text-anchor="middle" fill="currentColor" font-size="12">8</text><circle cx="388" cy="125" r="6" fill="#94a3b8"/><text x="358" y="122" text-anchor="middle" fill="currentColor" font-size="12">7</text><text x="417" y="122" text-anchor="middle" fill="currentColor" font-size="12">8</text><path d="M440 75 L492 25 L544 75 M440 75 L492 125 L544 75" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".65"/><circle cx="492" cy="25" r="6" fill="#94a3b8"/><text x="462" y="41" text-anchor="middle" fill="currentColor" font-size="12">9</text><text x="521" y="41" text-anchor="middle" fill="currentColor" font-size="12">10</text><circle cx="492" cy="125" r="6" fill="#94a3b8"/><text x="462" y="122" text-anchor="middle" fill="currentColor" font-size="12">9</text><text x="521" y="122" text-anchor="middle" fill="currentColor" font-size="12">10</text><path d="M544 75 L596 25 L648 75 M544 75 L596 125 L648 75" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".65"/><circle cx="596" cy="25" r="6" fill="#94a3b8"/><text x="566" y="41" text-anchor="middle" fill="currentColor" font-size="12">11</text><text x="625" y="41" text-anchor="middle" fill="currentColor" font-size="12">12</text><circle cx="596" cy="125" r="6" fill="#94a3b8"/><text x="566" y="122" text-anchor="middle" fill="currentColor" font-size="12">11</text><text x="625" y="122" text-anchor="middle" fill="currentColor" font-size="12">12</text><circle cx="24" cy="75" r="8" fill="#64748b"/><text x="24" y="99" fill="#15803d" text-anchor="middle" font-size="13" font-weight="bold">1</text><circle cx="128" cy="75" r="8" fill="#64748b"/><text x="128" y="99" fill="#15803d" text-anchor="middle" font-size="13" font-weight="bold">2</text><circle cx="232" cy="75" r="8" fill="#64748b"/><text x="232" y="99" fill="#15803d" text-anchor="middle" font-size="13" font-weight="bold">4</text><circle cx="336" cy="75" r="8" fill="#64748b"/><text x="336" y="99" fill="#15803d" text-anchor="middle" font-size="13" font-weight="bold">8</text><circle cx="440" cy="75" r="8" fill="#64748b"/><text x="440" y="99" fill="#15803d" text-anchor="middle" font-size="13" font-weight="bold">16</text><circle cx="544" cy="75" r="8" fill="#64748b"/><text x="544" y="99" fill="#15803d" text-anchor="middle" font-size="13" font-weight="bold">32</text><circle cx="648" cy="75" r="8" fill="#64748b"/><text x="648" y="99" fill="#15803d" text-anchor="middle" font-size="13" font-weight="bold">64</text></svg>
</div>
<div style="font-size:.85em;margin:8px 0">緑の数字：始点から合流地点までの単調増加歩道の個数</div>
<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><label for="abc486-walk-range">分岐・合流の回数</label><strong><span id="abc486-walk-k">6</span> 回</strong></div>
<input type="range" id="abc486-walk-range" min="1" max="6" step="1" value="6" style="width:100%;margin:12px 0;accent-color:#15803d"/>
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;text-align:center;border-top:1px solid #94a3b8;padding-top:12px" aria-live="polite">
<div>頂点数<strong id="abc486-walk-n" style="display:block;font-size:1.7em">19</strong></div>
<div>辺数<strong id="abc486-walk-m" style="display:block;font-size:1.7em">24</strong></div>
<div>歩道の個数<strong id="abc486-walk-count" style="display:block;font-size:1.7em;color:#15803d">64</strong></div>
</div>
</div>

<script>
(function(){
  const $=id=>document.getElementById('abc486-walk-'+id);
  const range=$('range'), svg=$('svg');
  if(!range||!svg)return;
  const ns='http://www.w3.org/2000/svg';
  function make(tag,attrs,label){
    const el=document.createElementNS(ns,tag);
    Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));
    if(label!==undefined)el.textContent=label;
    svg.appendChild(el);
  }
  function render(){
    const k=Number(range.value);
    svg.setAttribute('viewBox','0 0 '+(104*k+48)+' 150');
    svg.style.minWidth=(k*76+24)+'px';
    svg.style.maxWidth=(104*k+48)+'px';
    svg.replaceChildren();
    for(let i=0;i<k;i++){
      const x=24+104*i;
      make('path',{d:'M'+x+' 75 L'+(x+52)+' 25 L'+(x+104)+' 75 M'+x+' 75 L'+(x+52)+' 125 L'+(x+104)+' 75',fill:'none',stroke:'currentColor','stroke-width':1.5,opacity:.65});
      for(const y of [25,125]){
        make('circle',{cx:x+52,cy:y,r:6,fill:'#94a3b8'});
        make('text',{x:x+22,y:y===25?41:122,'text-anchor':'middle',fill:'currentColor','font-size':12},2*i+1);
        make('text',{x:x+81,y:y===25?41:122,'text-anchor':'middle',fill:'currentColor','font-size':12},2*i+2);
      }
    }
    for(let i=0;i<=k;i++){
      make('circle',{cx:24+104*i,cy:75,r:8,fill:'#64748b'});
      make('text',{x:24+104*i,y:99,fill:'#15803d','text-anchor':'middle','font-size':13,'font-weight':'bold'},2**i);
    }
    $('k').textContent=k;
    $('n').textContent=3*k+1;
    $('m').textContent=4*k;
    $('count').textContent=2**k;
  }
  range.addEventListener('input',render);
  render();
})();
</script>

分岐・合流を k 回繰り返すと、始点から最後の合流地点までの歩道の個数は次のようになる。

$\begin{aligned}
N&=3k+1\\
M&=4k\\
\text{歩道の個数}&=2^k
\end{aligned}$

頂点数と辺数は線形にしか増加していないのに、歩道の個数は指数的に増加する。

**一つの歩道の中で同じ辺を再利用できない場合でも、歩道を一つずつ列挙する探索の回数は、グラフの辺数に対して指数関数的に爆発することがある。**

### なぜ DP を選択肢から除外してしまったのか

- グラフ上の DP といえば木 DP。
- 今回のグラフは木ではない。
- 同じ頂点を何度も通ることがある。
- したがって、DP は使えないと判断した。

単に DP が思いつかなかったのではなく、グラフの構造や頂点の再訪を理由に DP を候補から外していた。

## 5. 全探索から DP への発想

### 探索経路を統合できないか？

異なる2つの歩道 A, B で頂点 u に到達したとする。

<div class="abc486-merge-figure" style="max-width:520px;margin:1.2em auto;border:1px solid #94a3b8;border-radius:10px;padding:12px">
<svg viewBox="0 0 340 210" role="img" aria-label="重み1、5の歩道Aと、重み2、4、5の歩道Bが頂点uで合流し、重み8の辺に続く" style="display:block;width:100%;height:auto">
<g fill="none" stroke-width="2.4"><path d="M30 40 L90 40 L160 105" stroke="#2563eb"/><path d="M30 170 L75 170 L115 170 L160 105" stroke="#b45309"/><path d="M160 105 H290" stroke="currentColor"/></g>
<g fill="#94a3b8"><circle cx="30" cy="40" r="8"/><circle cx="90" cy="40" r="8"/><circle cx="30" cy="170" r="8"/><circle cx="75" cy="170" r="8"/><circle cx="115" cy="170" r="8"/><circle cx="290" cy="105" r="8"/></g>
<circle cx="160" cy="105" r="17" fill="#64748b"/>
<g text-anchor="middle" font-size="13"><text x="160" y="110" fill="white">u</text><g fill="#2563eb"><text x="80" y="16">歩道 A</text><text x="60" y="31">1</text><text x="135" y="60">5</text></g><g fill="#b45309"><text x="80" y="198">歩道 B</text><text x="52" y="158">2</text><text x="95" y="158">4</text><text x="149" y="154">5</text></g><text x="225" y="95" fill="currentColor">8</text></g>
</svg>
</div>

<div class="abc486-tibble-wrap">
<table class="abc486-tibble">
<thead><tr><th>歩道</th><th>現在の頂点</th><th class="num">直前の辺の重み</th><th class="num">総和</th></tr></thead>
<tbody><tr><td>A</td><td>u</td><td class="num">5</td><td class="num">6</td></tr><tr><td>B</td><td>u</td><td class="num">5</td><td class="num">11</td></tr></tbody>
</table>
</div>

過去に通った頂点や辺は異なるが、現在の頂点と直前の辺の重みは一致している。

**歩道 A と B の両方について、この先の探索を行う必要はあるだろうか？**

ない。ナップサック DP と同じで、今後選択できる辺の集合が同じなので、総和が大きい歩道 B だけを残せばよい。

<div class="abc486-tibble-wrap">
<table class="abc486-tibble">
<thead><tr><th scope="col"></th><th scope="col">ナップサック DP（価値最大化）</th><th scope="col">今回の問題</th></tr></thead>
<tbody><tr><th scope="row">状態</th><td>処理済み品物数・重量</td><td>現在の頂点・直前の辺の重み</td></tr><tr><th scope="row">最大化する値</th><td>価値の総和</td><td>辺の重みの総和</td></tr><tr><th scope="row">統合できる条件</th><td>状態が一致する</td><td>状態が一致する</td></tr><tr><th scope="row">残す情報</th><td>価値の最大値</td><td>重みの総和の最大値</td></tr></tbody>
</table>
</div>

<style>
.abc486-tibble-wrap{overflow-x:auto;margin:1.2em 0}
.abc486-tibble{border-collapse:collapse;width:100%;min-width:320px;font-size:.94em;line-height:1.65;border-top:2px solid #64748b;border-bottom:2px solid #64748b}
.abc486-tibble th,.abc486-tibble td{border:0;border-bottom:1px solid rgba(148,163,184,.35);text-align:left;padding:9px 12px;vertical-align:top}
.abc486-tibble thead th{font-weight:700;background:rgba(148,163,184,.09);border-bottom:1px solid #94a3b8}
.abc486-tibble tbody th{white-space:nowrap;font-weight:600}
.abc486-tibble tbody tr:nth-child(even){background:rgba(148,163,184,.07)}
.abc486-tibble tbody tr:last-child>*{border-bottom:0}
.abc486-tibble .num{text-align:right;font-variant-numeric:tabular-nums}
@media(max-width:480px){.abc486-tibble th,.abc486-tibble td{padding:8px 7px}}
</style>

**過去の選択が異なっていても、今後の選択肢が同じであれば、スコアが大きい方だけを残せばよい。**

### DP の状態を定義する

dp[u][c] を、頂点 u を終点とし、最後に通った辺の重みが c である狭義単調増加歩道の重みの総和の最大値とする。

重み w の無向辺 (u, v) に対し、c < w なら遷移できる。

<div class="math-block">
$$
dp[v][w]\leftarrow\max(dp[v][w],\,dp[u][c]+w)
$$
</div>

逆方向についても同様である。どの頂点からも出発できるため、重み 0 の初期状態を各頂点に用意する。それ以外の到達不能な状態は負の無限大とする。

元のグラフに閉路があっても、状態 (u, c) から (v, w) に移るたびに重みは厳密に増加する。同じ頂点を再訪しても状態は異なるため、この状態遷移には閉路がない。

**元のグラフが木かどうかではなく、状態間の依存関係に注目する。**

### 辺の重みを昇順に処理する

辺の重みは最大 10^9 なので、重みをそのまま添字とする密な二次元配列は現実的ではない。

ナップサック DP で品物の処理順序を固定するように、今回は辺の重みの昇順に処理する。

重み w の辺を処理する直前には、w より小さい重みの辺をすべて処理済みである。その時点で dp[u] を、処理済みの辺だけを使って頂点 u に到達する歩道の重みの総和の最大値とすれば、どの候補も重み w の辺へ遷移できる。

したがって、最後の辺の重みごとに値を保存する必要はなく、頂点ごとの最大値だけを保持すればよい。

<div class="math-block">
$$
\begin{aligned}
dp'[u]&=\max(dp[u],\,dp[v]+w)\\
dp'[v]&=\max(dp[v],\,dp[u]+w)
\end{aligned}
$$
</div>

ただし、同じ重みの辺を連続して通ることはできない。重みが等しい辺は、すべて更新前の dp を参照して遷移候補を求め、その後にまとめて反映する。

<div style="max-width:340px;margin:1.2em auto">
<svg viewBox="0 0 340 95" role="img" aria-label="重み10の辺が2本並ぶグラフ。同じ重みを連続して使うことはできない" style="width:100%;height:auto">
<path d="M35 37 H305" stroke="currentColor" stroke-width="2"/>
<g fill="#64748b"><circle cx="35" cy="37" r="15"/><circle cx="170" cy="37" r="15"/><circle cx="305" cy="37" r="15"/></g>
<g text-anchor="middle" font-size="13" fill="white"><text x="35" y="42">1</text><text x="170" y="42">2</text><text x="305" y="42">3</text></g>
<g text-anchor="middle" font-size="13" fill="currentColor"><text x="102" y="27">10</text><text x="237" y="27">10</text></g>
<text x="170" y="81" text-anchor="middle" font-size="13" fill="#b91c1c">10 → 10 は不可</text>
</svg>
</div>

### 実装

~~~python
from itertools import groupby

def solve():
    N, M = map(int, input().split())
    edges = []
    for _ in range(M):
        u, v, c = map(int, input().split())
        edges.append((c, u - 1, v - 1))

    edges.sort()
    dp = [0] * N

    for c, group in groupby(edges, key=lambda e: e[0]):
        updates = []
        for _, u, v in group:
            updates.append((u, dp[v] + c))
            updates.append((v, dp[u] + c))

        for u, val in updates:
            dp[u] = max(dp[u], val)

    print(max(dp))

T = int(input())
for _ in range(T):
    solve()
~~~

辺のソートに O(M log M)、DP の遷移に O(M)、初期化と最大値の取得に O(N) かかる。全体の時間計算量は O(N + M log M)、空間計算量は O(N + M) である。

## 6. 今回の学び

（考察中）
