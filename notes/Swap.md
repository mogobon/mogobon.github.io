tags: [ABC, DP, 数え上げDP, 状態設計, 隣接交換]
---
# 【ABC227E】Swap

<a href="https://atcoder.jp/contests/abc227/tasks/abc227_e" target="_blank">問題リンク</a>

## ナイーブな解法

隣接交換の操作列を列挙すると、同じ完成文字列を何度も数えてしまう。必要なのは操作列ではなく、完成した文字列の種類数。

<details open>
<summary>解説</summary>

## ポイント

* 完成形を左から1文字ずつ構築する。
* 同じ文字は元の文字列の左から順に使う。
* 次の文字より左に残っている未使用文字の数が追加の交換コスト。

## 実際に動かしてみよう

ボタンで次の文字を選ぶと、残りの文字列・交換コスト・DPの状態が変化する。

<iframe src="/abc227e-simulator.html" title="ABC227 E DP遷移シミュレーター" loading="lazy" style="display:block;width:100%;height:590px;border:1px solid #cbd5e1;border-radius:12px"></iframe>

[別タブでシミュレーターを開く](/abc227e-simulator.html)

## 遷移の意味

例えば S = KEYKE で最初に Y を選ぶと、左に K と E が残っているので2回交換する。次に E を選ぶと、残りの文字列 KEKE の先頭の K を1個飛び越えるので追加コストは1。

**DPの1遷移は交換1回ではなく、完成形に1文字追加すること。**

## DPの状態

文字 K, E, Y をそれぞれ a,b,c 個使い、最小交換回数が w 回となる接頭辞の数を

$$dp[a][b][c][w]$$

とする。初期状態は $dp[0][0][0][0]=1$。

次に使う文字 x は、元の S における未使用の x のうち最も左のものを選ぶ。その位置を p とし、p より左の未使用文字の数を $\Delta$ とする。

次に Y を追加する場合、

$$dp[a][b][c+1][w+\Delta] \mathrel{+}= dp[a][b][c][w].$$

K と E についても同様である。

### なぜ同じ文字は左から使うのか？

同じ文字を入れ替えても完成形は変わらない。元の同じ文字同士の順番を保つように対応させれば、余分な交差を避けて最小交換回数を達成できる。

### なぜコストは飛び越えた未使用文字数なのか？

次に選んだ文字を未使用列の先頭へ移すには、その左に残っている文字を1個ずつ飛び越える必要があり、それで十分でもある。全体では、元の文字の順序が完成形で逆転する異種文字ペアを1回ずつ数えている。

## 答え

元の S に含まれる K,E,Y の個数を A,B,C、交換回数上限を L と書くと、

$$\mathrm{ans}=\sum_{w=0}^{L}dp[A][B][C][w].$$

## 実装例（Python）

~~~python
S = input().strip()
K = int(input())
chars = "KEY"
pos = [[i for i, ch in enumerate(S) if ch == x] for x in chars]
A, B, C = map(len, pos)

# 同じ文字同士の交換は不要
K = min(K, A * B + B * C + C * A)

# dp[a][b][c][w]: その接頭辞を作る最小交換回数がwの文字列数
dp = [[[[0] * (K + 1) for _ in range(C + 1)]
       for _ in range(B + 1)] for _ in range(A + 1)]
dp[0][0][0][0] = 1

for a in range(A + 1):
    for b in range(B + 1):
        for c in range(C + 1):
            used = (a, b, c)
            now = dp[a][b][c]
            for j in range(3):
                if used[j] == len(pos[j]):
                    continue

                # 次に使う文字の元の位置
                p = pos[j][used[j]]

                # pより左にある使用済み文字の個数
                already = sum(q < p for t in range(3)
                              for q in pos[t][:used[t]])
                cost = p - already

                nxt = list(used)
                nxt[j] += 1
                na, nb, nc = nxt
                dest = dp[na][nb][nc]

                for w in range(K - cost + 1):
                    if now[w]:
                        dest[w + cost] += now[w]

print(sum(dp[A][B][C]))
~~~

## 計算量

$L=\min(K,AB+BC+CA)$ とすると、状態数は $O((A+1)(B+1)(C+1)(L+1))$。上記の実装は遷移コストを毎回 $O(N)$ で求めるため、全体で $O((A+1)(B+1)(C+1)(L+1)N)$、空間計算量は $O((A+1)(B+1)(C+1)(L+1))$。

</details>
