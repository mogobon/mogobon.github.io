tags: [典型, クエリ処理, ∀i∀j型, 状態を圧縮して考える]
---
# 【ABC342C】Many Replacement
[問題リンク](https://atcoder.jp/contests/abc342/tasks/abc342_c)

## ナイーブな解法
* クエリを逐一**文字列**に反映すると、$O(NQ)$で間に合わない。

* $i=1,2,\cdots,Q$について、
  * $j=1,2,\cdots, N$について、
    $$
    S_j=
    \begin{cases}
    d_i\quad (S_j=c_i)\\
    S_j\quad (\text{otherwise})
    \end{cases}
    $$


<details>
<summary>解説</summary>

## ポイント
* アルファベットは 26 種類しかない

* 各クエリで「最終的な対応先」を更新すればよい
  * アルファベットごとに状態を更新

* 変換表`p`を持つ

* クエリ `(c,d)` を読むときに `p[x]==c` のものを全部 `d` に更新


## 定式化

* $p_x=x, \quad (x\in \Sigma=\lbrace\texttt{a},\texttt{b},\cdots, \texttt{z}\rbrace)$
* $i=1,2,\cdots,Q$について、
  * 各クエリ$(c_i,d_i)$に対して、
    $$
    \forall x\in\Sigma,\ p_x=
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