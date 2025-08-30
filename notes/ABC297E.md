tags:[ABC, ダイクストラ,優先度付きキュー,グラフ探索]
---
# 【ABC297E】 Kth Takoyaki Set

<a href="https://atcoder.jp/contests/abc297/tasks/abc297_e" target="_blank">問題リンク</a>

## ナイーブな解法

* 各要素を何個使うか？についてDFSで列挙していく。
* これだと$O(N^K)$かかってしまい、間に合わない。
* しかも、状態が重複する。
```bash
start: path=[0,0], cnt=0
 ├ i=0 -> path=[1,0], cnt=1
 │   ├ i=0 -> path=[2,0], cnt=2 -> ans に [2,0]
 │   └ i=1 -> path=[1,1], cnt=2 -> ans に [1,1]
 └ i=1 -> path=[0,1], cnt=1
     ├ i=0 -> path=[1,1], cnt=2 -> ans に [1,1]
     └ i=1 -> path=[0,2], cnt=2 -> ans に [0,2]
```

```python
cnt = 0
n,k=map(int,input().split())
a=list(map(int,input().split()))
a.sort()
ans = []
def dfs(path,cnt):
    global ans
    if cnt == k:
        ans.append(path[:])
        return
    for i in range(n):
        path[i] += 1
        dfs(path, cnt+1)
        path[i] -= 1
dfs([0]*n,0)
...
```

<details>
<summary>解説</summary>

## ポイント

* 「小さい順に$K$個を求める」⇒ 優先度付きキュー
* （無限グリッド上の）ダイクストラ(パスの長さは$K$)
* 遷移先が重複するので**重複検出**する

## 定式化

$$
\text{ans} = 
\text{the $K$-th smallest element of }
\left\{\, 
\sum_{i=1}^{N} A_i x_i 
\;\Biggm|\;
x_i \in \mathbb{Z}_{\ge 0},\ 
\sum_{i=1}^{N} x_i \ge 1
\right\}.
$$


## 実装例

```python
n,k=map(int,input().split())
a=list(map(int,input().split()))

closed = set()
from heapq import heapify,heappop,heappush
open = [0]
for i in range(k+1):
    p = heappop(open)
    for v in a:
        if p+v not in closed:
            closed.add(p+v)
            heappush(open, p+v)
print(p)
```
</details>