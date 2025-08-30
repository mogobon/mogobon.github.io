tags: [ABC, 典型, クエリ処理, ∀i∀j型, 状態を圧縮して考える, 写像更新]
---
# 【ABC342C】Many Replacement

<a href="https://atcoder.jp/contests/abc342/tasks/abc342_c" target="_blank">問題リンク</a>

## ナイーブな解法
* クエリを逐一**文字列**に反映すると、$O(NQ)$で間に合わない。

* $i=1,2,\cdots,Q$について、
  * $$
    \forall j\in [N],\ S_j\leftarrow
    \begin{cases}
    d_i\quad (S_j=c_i)\\
    S_j\quad (\text{otherwise})
    \end{cases}
    $$


<details>
<summary>解説</summary>

## ポイント
* アルファベットは 26 種類しかない
```bash
[a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z] (初期状態)
[[a],b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z] (クエリ1: a a)
[a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,[b],y,z] (クエリ2: x b)
[a,b,[b],d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,b,y,z] (クエリ3: c b)
[a,[b],[b],d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,[b],y,z] (クエリ4: b b)
[a,b,b,d,e,f,g,h,i,j,[b],l,m,n,o,p,q,r,s,t,u,v,w,b,y,z] (クエリ5: k b)
[a,[a],[a],d,e,f,g,h,i,j,[a],l,m,n,o,p,q,r,s,t,u,v,w,[a],y,z] (クエリ6: b a)
```
* クエリごとに、26文字走査して、置き換えていくのは間に合う
* 各文字に対するmappingがわかっておけば、$O(N)$で変換できる


* 各クエリで「最終的な対応先」を更新すればよい
  * クエリごとに、アルファベットごとに状態を更新して、最終状態を求める


## 定式化

* $\forall x,\ p_x\leftarrow x \quad (x\in \Sigma=\lbrace\texttt{a},\texttt{b},\cdots, \texttt{z}\rbrace)$
* $i=1,2,\cdots,Q$について、
  * 各クエリ$(c_i,d_i)$に対して、
    $$
    \forall x\in\Sigma,\ p_x\leftarrow
    \begin{cases}
    d_i \quad &(p_x=c_i)\\
    p_x \quad &(\text{otherwise})\\
    \end{cases}
    $$

* $(p_{S_1},p_{S_2},\cdots,p_{S_N})$が答え




## 計算量

* 各クエリで26種類だけ状態を更新する: $O(26Q)$
* 最後に文字列を一回走査する: $O(N)$
* $O(N+26Q)$

## 実装例

* 変換表`p`を持つ

* クエリ `(c,d)` を読むときに `p[x]==c` のものを全部 `d` に更新

```python
n = int(input())
s = input()
q = int(input())
abc = 'abcdefghijklmnopqrstuvwxyz'
p = {i:i for i in abc}
for i in range(q):
    c, d = input().split()
    for x in abc:
        if p[x] == c:
            p[x] = d # 更新

ans = []
for x in s:
    ans.append(p[x])

print("".join(ans))
```
<!--
## その他（ボツ）

### 定式化（みにくいのでボツ）

$$
S^{(0)}=S,\quad S^{(i)}=f_{i}(S^{(i-1)})
$$

として $S^{(Q)}$を求めよ.

ただし, 

$$  
f_i(S) =
\begin{cases}
d_i\quad &(S_j=c_i) \\
S_j\quad &(\text{otherwise})
\end{cases}
,\forall j\in \lbrace0,1,\cdots,n-1\rbrace
$$
-->
</details>