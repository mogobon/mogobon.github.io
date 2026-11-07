tags: [グラフ]
---
# 連結成分の頂点数と辺の数

DSU（Union-Find）の `leader` と `Counter` を使って、連結成分ごとの頂点数・辺数を集計する。

## コード

```python
from collections import Counter
from atcoder.dsu import DSU

N, M = map(int, input().split())
uf = DSU(N)

edges = []
for _ in range(M):
    u, v = map(lambda x: int(x) - 1, input().split())
    uf.merge(u, v)
    edges.append((u, v))

# 各成分の辺数
ecnt = Counter(uf.leader(u) for u, v in edges)

# 各成分の頂点数
vcnt = Counter(uf.leader(v) for v in range(N))

ans = 1
for root, n in vcnt.items():
    if ecnt[root] != n:
        ans = 0
        break
    ans = ans * 2 % 998244353

print(ans)
```

**考え方：** `uf.leader(x)` は頂点 `x` が所属する連結成分の識別子。同じ成分の頂点は同じ代表元を返す。辺 `(u,v)` の両端も同じ成分に属するため、辺を数えるときは `leader(u)` だけで十分。なお、DSUの代表元は実装・merge順で変わる。以下の例では説明のため代表元を 0 と 4 に固定する。

## 動かして理解する：vcnt と ecnt

7頂点・6辺の例。左の成分は頂点 `{0,1,2,3}` と4辺、右の成分は頂点 `{4,5,6}` と2辺。ボタンを押すと、各要素がどの `leader` に集計されるかを1つずつ確認できる。

<div id="dsu-demo" class="dsu-demo">
  <div class="dsu-tabs">
    <button type="button" data-mode="vcnt" class="selected">vcnt：頂点数</button>
    <button type="button" data-mode="ecnt">ecnt：辺数</button>
  </div>
  <svg id="dsu-svg" viewBox="0 0 350 225" role="img" aria-label="2つの連結成分からなるグラフ">
    <rect x="5" y="5" width="208" height="212" rx="14" fill="#0d9488" fill-opacity=".07" stroke="#0d9488" stroke-dasharray="5 4"/>
    <rect x="222" y="5" width="123" height="212" rx="14" fill="#8b5cf6" fill-opacity=".07" stroke="#8b5cf6" stroke-dasharray="5 4"/>
    <g id="dsu-edges"></g><g id="dsu-nodes"></g>
  </svg>
  <div class="dsu-progress" id="dsu-progress" aria-live="polite"></div>
  <div class="dsu-controls">
    <button type="button" id="dsu-prev">← 戻す</button>
    <button type="button" id="dsu-next">次へ →</button>
    <button type="button" id="dsu-reset">最初から</button>
  </div>
  <input id="dsu-range" type="range" min="0" max="7" value="0" aria-label="処理済み要素数"/>
  <div class="dsu-stats">
    <div>代表元 0 <strong id="dsu-count0">0</strong></div>
    <div>代表元 4 <strong id="dsu-count4">0</strong></div>
  </div>
  <div class="dsu-output">
    <div id="dsu-current">まだ処理していません。</div>
    <code id="dsu-counter">Counter({})</code>
  </div>
</div>

<style>
.dsu-demo{border:1px solid #dbe2ea;border-radius:14px;padding:16px;margin:20px 0;background:#fff}
.dsu-tabs,.dsu-controls{display:flex;gap:8px;flex-wrap:wrap}
.dsu-demo button{border:1px solid #b9c8d9;border-radius:8px;padding:9px 13px;background:#f4f7fb;color:#1d3553;cursor:pointer;font-size:14px}
.dsu-demo button.selected{background:#2563eb;color:white;border-color:#2563eb}
.dsu-demo button:disabled{opacity:.4;cursor:default}
#dsu-svg{width:100%;max-width:440px;display:block;margin:12px auto}
.dsu-progress{font-size:14px;color:#52647a;margin:10px 0}
#dsu-range{width:100%;margin:14px 0;accent-color:#2563eb}
.dsu-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}
.dsu-stats>div{background:#f2f6fa;border-radius:10px;padding:12px;font-size:14px}
.dsu-stats strong{display:block;font-size:26px;margin-top:4px}
.dsu-output{background:#f2f6fa;border-radius:10px;padding:12px;overflow-wrap:anywhere}
.dsu-output code{display:block;margin-top:8px;white-space:normal}
@media(max-width:480px){.dsu-demo{padding:10px}.dsu-demo button{padding:8px 10px}}
</style>

<script>
(function(){
  const host=document.getElementById('dsu-demo');
  if(!host)return;
  const $=id=>document.getElementById(id);
  const nodes=[{x:108,y:42},{x:45,y:135},{x:174,y:135},{x:174,y:195},{x:278,y:62},{x:278,y:145},{x:325,y:195}];
  const edges=[[0,1],[1,2],[2,0],[2,3],[4,5],[5,6]];
  const ns='http://www.w3.org/2000/svg';
  let mode='vcnt',step=0;
  const make=(tag,attrs,parent)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));parent.appendChild(el);return el};
  const edgeEls=edges.map(([u,v])=>make('line',{x1:nodes[u].x,y1:nodes[u].y,x2:nodes[v].x,y2:nodes[v].y,'stroke-linecap':'round'},$('dsu-edges')));
  const circles=nodes.map((p,i)=>{const c=make('circle',{cx:p.x,cy:p.y,r:18,fill:'#dbeafe',stroke:'#64748b','stroke-width':1.5},$('dsu-nodes'));const t=make('text',{x:p.x,y:p.y+5,'text-anchor':'middle','font-size':14,fill:'#172554'},$('dsu-nodes'));t.textContent=i;return c});
  const leader=v=>v<4?0:4;
  function render(){
    const items=mode==='vcnt'?nodes.map((_,i)=>i):edges;
    const limit=items.length;
    step=Math.max(0,Math.min(step,limit));
    $('dsu-range').max=limit;$('dsu-range').value=step;
    const counts={};
    for(let i=0;i<step;i++){const v=mode==='vcnt'?items[i]:items[i][0];const root=leader(v);counts[root]=(counts[root]||0)+1}
    edgeEls.forEach((line,i)=>{line.setAttribute('stroke',mode==='ecnt'?(i<step?'#0d9488':i===step?'#f59e0b':'#9ca3af'):'#94a3b8');line.setAttribute('stroke-width',mode==='ecnt'&&i===step?5:3);line.setAttribute('opacity',mode==='ecnt'&&i>step?.35:1)});
    circles.forEach((c,i)=>{c.setAttribute('fill',mode==='vcnt'?(i<step?'#a7f3d0':i===step?'#fde68a':'#dbeafe'):'#dbeafe')});
    $('dsu-progress').textContent=(mode==='vcnt'?'頂点':'辺')+'：'+step+' / '+limit+' 件処理済み';
    $('dsu-count0').textContent=counts[0]||0;$('dsu-count4').textContent=counts[4]||0;
    $('dsu-current').textContent=step===0?'まだ処理していません。':mode==='vcnt'?('直前：頂点 '+(step-1)+' → leader = '+leader(step-1)):('直前：辺 ('+edges[step-1].join(', ')+') → leader(u) = '+leader(edges[step-1][0]));
    $('dsu-counter').textContent='Counter({'+Object.keys(counts).map(k=>k+': '+counts[k]).join(', ')+'})';
    $('dsu-prev').disabled=step===0;$('dsu-next').disabled=step===limit;
    host.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('selected',b.dataset.mode===mode));
  }
  host.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;step=0;render()}));
  $('dsu-prev').addEventListener('click',()=>{step--;render()});
  $('dsu-next').addEventListener('click',()=>{step++;render()});
  $('dsu-reset').addEventListener('click',()=>{step=0;render()});
  $('dsu-range').addEventListener('input',e=>{step=Number(e.target.value);render()});
  render();
})();
</script>

## 最後の判定

`vcnt = Counter({0: 4, 4: 3})`、`ecnt = Counter({0: 4, 4: 2})`。

`for root, n in vcnt.items()` では、`root` が成分の代表元、`n` がその成分の頂点数。`ecnt[root]` と比較すれば、同じ成分の辺数と頂点数を比較できる。

この例では代表元4の成分が **3頂点・2辺** なので、ABC226 E の条件を満たさず答えは0。

※ `Counter` は与えた代表元の**出現回数**を数えている。`vcnt` は頂点ごとに1回、`ecnt` は辺ごとに1回代表元を出すことが本質。
