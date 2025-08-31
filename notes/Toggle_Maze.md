
# 【ABC420】Toggle Maze

<a href="https://atcoder.jp/contests/abc420/tasks/abc420_d" target="_blank">問題リンク</a>

## ナイーブな解法
* `?`の処理がわからないで全て試す。
* 再帰全探索すると$O(4^{HW})$で間に合わない。

<details>
<summary>解説</summary>

## ポイント

* 頂点倍化BFS
* `?`を押された回数は$O(HW)$だが、
* 結局各マスについて、
  * 「`?`が押されている」
  * 「`?`が押されていない」
* という2種類の状態しかないので、状態を圧縮できる。

* ゴールに早く到達した時点で答えが確定する。

## 計算量

$O(2HW)$

## 実装例

```python
DIR_4 = [[-1,0],[0,1],[1,0],[0,-1]]
INF = 10**9

h,w=map(int,input().split())
s=[input()for _ in range(h)]
dis=[[[INF]*2 for _ in range(w)]for _ in range(h)]

for i in range(h):
    for j in range(w):
        if s[i][j]=="S":
            sx,sy=i,j

from collections import deque
que = deque()
que.append((sx,sy,0))
dis[sx][sy][0] = 0
# 状態定義(i,j,f)
while que:
    px,py,f = que.popleft()
    for dx,dy in DIR_4:
        nx = px + dx
        ny = py + dy
        if (0<=nx<h and 0<=ny<w):
            ng = 0
            if s[nx][ny] == "#": ng = 1
            if not f and s[nx][ny]=="x": ng = 1
            if f and s[nx][ny]=="o": ng = 1
            if ng: continue # 到達不可能
            
            # 展開された状態に到達可能
            
            if s[nx][ny]=="G":
                exit(print(dis[px][py][f] + 1))

            nf = f
            if s[nx][ny] == "?": nf = f^1 # フラグを反転させる
            
            if dis[nx][ny][nf] > dis[px][py][f] + 1:
                dis[nx][ny][nf] = dis[px][py][f] + 1
                que.append((nx,ny,nf))
print(-1)
```

* 状態として、マス座標と「`?`が押されたか？」のフラグ`(i,j,f)`を持っている。
* `?`を押した場合、`^1`して、反転させることができる。
* 範囲内であったとしても、到達不可能な場合がたくさんあるので次のように場合分けしている。
* もし範囲内であった場合
  * どれか一つでも成り立っていたらアウト
  * 壁マス`#`であった場合
  * ボタンが押されていて、`o`である場合
  * ボタンが押されておらず、`x`である場合

</details>