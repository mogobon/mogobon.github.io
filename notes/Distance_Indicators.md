tags: [ABC, 固定して考える, (i\, j)数え上げ型, 変数分離]
---
# 【ABC417C】 Distance Indicators 

<a href="https://atcoder.jp/contests/abc417/tasks/abc417_c" target="_blank">問題リンク</a>

# ナイーブな解法

$O(N^2)$になって間に合わない

$$
\sum_{j=1}^{N}\sum_{i=1}^{j-1}P(i,j)
$$
ただし, 
$$
P(i,j)=
\begin{cases}
\mathrm{T}\quad &(i+A_i=j-A_j) \\
\mathrm{F}\quad &(\text{otherwise})
\end{cases}
$$

<details>
<summary>解説</summary>

## ポイント
* 数え上げの基本は**固定して考える**
* $j$を固定した時の$i<j$の寄与が高速にもとまっていれば良い.
* 変数分離
  * $j-i=A_i+A_j \Leftrightarrow i+A_i=j-A_j$
## 定式化

* $C_{\cdot}\leftarrow 0$
* $\text{ans}\leftarrow 0$
* $j=1,2,\cdots,n-1$に対して、
  * $\text{ans} = \text{ans} + C_{j-A_j}$
  * $C_{j+A_j}=C_{j+A_j}+1$

## 計算量

* Pythonの`dict`はオープンアドレス法による実装なので、挿入が平均$O(1)$
* 全体で$O(N)$
## 実装例


```python
n = int(input())
a = list(map(int,input().split()))
from collections import defaultdict
cnt = defaultdict(int)
ans = 0
for j in range(n):
    # 集計(i<j)
    ans += cnt[j-a[j]]
    # 更新
    cnt[j+a[j]] += 1
print(ans)
```



</details>

