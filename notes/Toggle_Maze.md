tags:[ABC, BFS,グラフ探索,頂点倍加BFS]
# 【ABC420】Toggle Maze

<a href="https://atcoder.jp/contests/abc420/tasks/abc420_d" target="_blank">問題リンク</a>

* グリッドが与えられる。各マスの意味は次の通り。
* `.` ：空きマス。
* `#` ：障害物マス。
* `S` ：スタートマス。
* `G` ：ゴールマス。
* `o` ：開いたドアのマス。
* `x` ：閉じたドアのマス。
* `?` ：スイッチマス。
  * スイッチマスに移動する度に全ての開いたドアのマスは閉じたドアのマスに、閉じたドアのマスは開いたドアのマスに変わります。
* $1$回の操作で上下左右の隣接マスに動ける。
* スタートマスにいる状態からゴールマスにいる状態にするよう操作できるか判定し、可能ならスタートからゴールまでの最短経路を求めてください。



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


## 定式化


* 問題文で与えられるグリッドを$G$と書く。
* グリッドの$i$行$j$列目のマスを$G_{ij}$と書く。
* 状態空間問題$P(S,A,s_0,T)$を以下のように定める。
* 状態集合:
  * $$
    S=\lbrace(i,j,p)|0\leq i \lt H,0\leq j \lt W,p\in\lbrace0,1\rbrace\rbrace
    $$

* 初期状態 $s_0\in S$
  * $s_0=(s_x,s_y,0)$
* ゴール集合$T\subseteq S$
  * $T=\lbrace(g_x,g_y,0),(g_x,g_y,1)\rbrace$
* 行動集合 $A:S\to S$
  * $A=\lbrace up, down, left, right\rbrace$
* 遷移$a\in A$
  * $(i,j,p)\overset{a}{\to}(i^{\prime},j^{\prime},p^{\prime})$
  * $i^{\prime}=i+d_i,i^{\prime}=i+d_j\quad \left((d_i,d_j)\in\lbrace(0,1),(0,-1),(1,0),(-1,0)\rbrace\right)$
  * $G_{i^{\prime}j^{\prime}}\neq \verb|#|$
  * $[G_{i^{\prime}j^{\prime}}= \verb|o| \land p=0] \lor [G_{i^{\prime}j^{\prime}}= \verb|x| \land p=1]$
  * $$
    p^{\prime}=
    \begin{cases}
    p \oplus 1\quad &(G_{i^{\prime}j^{\prime} }=\texttt{?})\\
    p \oplus 0 = p\quad &(\text{otherwise})\\
    \end{cases}
    $$


* 解$\pi$（経路）:
  * $\pi=(a_1,a_2,\dots,a_n)$ 
  * $s_0 \xrightarrow{a_1} s_1 \xrightarrow{a_2} \cdots \xrightarrow{a_k} s_k\in T$
    

* コスト関数：
  * $$
    \mathrm{cost}(\pi)=\sum_{i=1}^{k} w(a_i), \quad w(a_i)=1
    $$
  * （解のコスト）=（解の行動回数）
    * **ユニットコスト状態空間問題**と呼ばれる。

* 答え:
    
  * 解が存在するなら、最適解 $\pi^\star$ のコストを求めよ。
    $$
    \mathrm{cost}(\pi^{\star})
    $$
    $$
    \pi^\star = \argmin_{\pi: s_n\in T} \mathrm{cost}(\pi)
    $$
  * 解が存在しないなら$-1$とせよ。
    


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



### 参考文献
* 定式化の章を書くにあたって参考にした書籍
  * 「ヒューリスティック探索 合理的なAIをつくるためのアルゴリズム」,陣内佑 著, 講談社, 2025年4月22日.

</details>

