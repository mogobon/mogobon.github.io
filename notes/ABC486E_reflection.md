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

また、DP として思い浮かぶグラフ上の手法は木 DP だった。今回は木ではなく、同じ頂点を複数回通ることもあるため、DP を適用できないと考え、選択肢から完全に除外していた。

単に DP が思いつかなかったのではなく、グラフの構造や頂点の再訪を理由に DP を候補から外していた。

## 5. 全探索から DP への発想

（考察中）

## 6. 今回の学び

（考察中）
