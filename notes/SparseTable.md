tags: [データ構造]
---
# SparseTableの実装

[Library Checker：Static RMQ](https://judge.yosupo.jp/problem/staticrmq) を使って、**Sparse Tableを導出して実装した記録**。数式そのものは比較的早く導けた一方、DPの計算順序・添字の意味・半開区間の境界で何度もWA/REになった。最後には、CPythonではTLEした純Python実装がPyPy3では2秒未満でACした。NumPy版との違いも含め、何を理解して、どこで実装が止まったのかを整理する。

> 先に結論：**状態の定義 → 漸化式 → 状態が存在する範囲 → 依存関係を満たす計算順序 → クエリ**の順に決める。漸化式だけ正しくても、DPの実装は完成しない。

## 1. 出発点：累積minでは区間minを復元できない

累積和なら、$S[r]-S[l]$ で区間 $[l,r)$ の和を取得できる。一方、累積最小値では、$[0,r)$ の最小値から $[0,l)$ の最小値を「引く」ことができない。最小値に差分を取り出す逆演算がないからだ。

区間最小値を求めるには、**その区間を覆う、あらかじめ計算済みの情報**を結合する方法を考えたい。

そこで、以前考えた[ダブリング](https://note.com/mogobon/n/n43a442d628c1)の発想に戻る。長さ $2^{k+1}$ は、長さ $2^k$ のもの2つに分けられる。

<div class="math-block">
$$
2^{k+1}=2^k+2^k
$$
</div>

**各開始位置ごとに、長さが2冪の区間の集約値を保持すればよさそうだ。**

## 2. 状態の定義：位置 i と指数 k

配列 $A$ の長さを $N$ とし、次のように定義する。

<div class="math-block">
$$
T[i][k]=\min\{A_j\mid i\le j\lt i+2^k\}
$$
</div>

つまり、`T[i][k]` は **半開区間 $[i,i+2^k)$ の最小値**。2番目の添字は「区間長」ではなく「長さの指数」である。

例えば $A=[2,10,1,100]$ の場合は次のようになる。

| 開始位置 | $k=0$（長さ1） | $k=1$（長さ2） | $k=2$（長さ4） |
|---|---:|---:|---:|
| $i=0$ | 2 | 2 | 1 |
| $i=1$ | 10 | 1 | — |
| $i=2$ | 1 | 1 | — |
| $i=3$ | 100 | — | — |

「—」は、有効な区間が配列内に存在しないことを表す。値が未計算なだけではなく、**数学的な状態そのものが存在しない**。

$N\ge1$ として、保持する指数は $k=0,\dots,\lfloor\log_2N\rfloor$。Pythonでは次のように列数を確保できる。

~~~python
K = n.bit_length()
st = [[INF] * K for _ in range(n)]
~~~

`K` は「最大の指数」ではなく**列数**であり、列番号は `0` から `K-1` まで。


### 10進数の桁数と2進数の桁数

高校数学で扱う常用対数による桁数の計算は、2進数にもそのまま適用できる。正の整数 $n$ の桁数を $k$ とする。

<div style="overflow-x:auto; margin:1rem 0;">
<table style="border-collapse:collapse; width:100%; min-width:620px; font-variant-numeric:tabular-nums;">
<thead style="border-top:2px solid #999; border-bottom:1px solid #999;">
<tr><th scope="col" style="padding:10px 14px; text-align:left; width:24%;">項目</th><th scope="col" style="padding:10px 14px; text-align:center; width:38%;">10進数</th><th scope="col" style="padding:10px 14px; text-align:center; width:38%;">2進数</th></tr>
</thead>
<tbody style="border-bottom:2px solid #999;">
<tr><th scope="row" style="text-align:left; font-weight:normal; padding:10px 14px; white-space:nowrap;">底</th><td style="text-align:center; padding:10px 14px;">10</td><td style="text-align:center; padding:10px 14px;">2</td></tr>
<tr style="background:rgba(128,128,128,.07);"><th scope="row" style="text-align:left; font-weight:normal; padding:10px 14px; white-space:nowrap;">桁数の条件</th><td style="text-align:center; padding:10px 14px; white-space:nowrap;">$10^{k-1}\leq n&lt;10^k$</td><td style="text-align:center; padding:10px 14px; white-space:nowrap;">$2^{k-1}\leq n&lt;2^k$</td></tr>
<tr><th scope="row" style="text-align:left; font-weight:normal; padding:10px 14px; white-space:nowrap;">対数を取る</th><td style="text-align:center; padding:10px 14px; white-space:nowrap;">$k-1\leq\log_{10}n&lt;k$</td><td style="text-align:center; padding:10px 14px; white-space:nowrap;">$k-1\leq\log_2n&lt;k$</td></tr>
<tr style="background:rgba(128,128,128,.07);"><th scope="row" style="text-align:left; font-weight:normal; padding:10px 14px;">桁数</th><td style="text-align:center; padding:10px 14px;">$\lfloor\log_{10}n\rfloor+1$</td><td style="text-align:center; padding:10px 14px;">$\lfloor\log_2n\rfloor+1$</td></tr>
<tr><th scope="row" style="text-align:left; font-weight:normal; padding:10px 14px;">Python</th><td style="text-align:center; padding:10px 14px;"><code>len(str(n))</code></td><td style="text-align:center; padding:10px 14px;"><code>n.bit_length()</code></td></tr>
</tbody>
</table>
</div>

表の2進数の列より、`n.bit_length()` は2進数の桁数、すなわち $\lfloor\log_2n\rfloor+1$ を返す。Sparse Tableでは、構築時には指数0から最大の指数までの列数が必要なので `n.bit_length()` を使う。一方、クエリ時には区間長 `d` 以下の最大の2冪の指数が必要なので `d.bit_length() - 1` を使う。

## 3. 漸化式を導出する

区間 $[i,i+2^{k+1})$ を半分に分ける。

<div class="math-block">
$$
[i,i+2^{k+1})
=
[i,i+2^k)\ \cup\ [i+2^k,i+2^{k+1})
$$
</div>

2区間は隣接していて重複しない。したがって、

<div class="math-block">
$$
T[i][k+1]
=
\min\bigl(T[i][k],T[i+2^k][k]\bigr)
$$
</div>

一般の二項演算 $\otimes$ に書き換えれば、

<div class="math-block">
$$
T[i][k+1]=T[i][k]\otimes T[i+2^k][k]
$$
</div>

という形になる。**この構築に必要なのは結合律**。区間を連結した順序で集約できればよく、ここでは冪等律はまだ使っていない。`min` 以外にも、`max`・`gcd`・区間和などを同様に前計算できる。

初期状態は長さ1なので、

<div class="math-block">
$$
T[i][0]=A[i]
$$
</div>

だけ。ここまでで、数学上の定義と遷移はできた。

## 4. 漸化式が書けても、for文が書けなかった

最初に考えたのは、`i` を昇順、その内側で `k` を昇順にするループだった。

~~~python
# 間違った実装例
for i in range(n):
    for j in range(K - 1):
        st[i][j + 1] = min(
            st[i][j],
            st[i + (1 << j)][j]
        )
~~~

しかし、`st[0][2]` を計算するときには、`st[2][1]` が必要になる。

<div class="math-block">
$$
T[0][2]=\min(T[0][1],T[2][1])
$$
</div>

`i=0` を処理中なので、`i=2` 側の `T[2][1]` はまだ計算されていない。`INF` を見てしまい、誤答になる。

**ループ順序は添字を何となく昇順にするのではなく、右辺で参照する状態が計算済みかどうかから決める。**

### 方法A：指数 k を外側に回す

~~~python
for k in range(1, K):
    for i in range(n - (1 << k) + 1):
        st[i][k] = min(
            st[i][k - 1],
            st[i + (1 << (k - 1))][k - 1]
        )
~~~

これなら、`k-1` 列全体を計算してから `k` 列へ進める。

### 方法B：開始位置 i を降順に回す

右辺の開始位置は `i` または `i+2^j`。後者は必ず `i` より大きいので、`i` を降順に回せば参照先が先に完成する。

~~~python
for i in range(n - 1, -1, -1):
    for j in range(K - 1):
        if i + (1 << (j + 1)) > n:
            break
        st[i][j + 1] = min(
            st[i][j],
            st[i + (1 << j)][j]
        )
~~~

**指数昇順を外側にする方法も、開始位置降順を外側にする方法も正しい。** これは依存関係の異なる二つのトポロジカル順序と考えられる。

以前のダブリングで扱った「遷移先」は任意の頂点に飛び得るので、一般には開始頂点の降順で依存関係を解決できない。Sparse Tableでは参照先の開始位置が常に右に進むため、降順を使える。

## 5. WAとRE：境界条件は「左辺の状態が存在するか」で決める

ここで最も苦戦した。次の式を計算しているとする。

<div class="math-block">
$$
T[i][j+1]=\min(T[i][j],T[i+2^j][j])
$$
</div>

### 誤り①：`i+2^j<n` と判定する

~~~python
# 誤り
if i + (1 << j) < n:
    st[i][j + 1] = min(st[i][j], st[i + (1 << j)][j])
~~~

これは、後半の区間の**開始位置** `i+2^j` が配列内かどうかしか確かめていない。しかし、左辺 `st[i][j+1]` が管理するのは**長さ $2^{j+1}$ の区間全体**。

たとえば `n=5, i=2, j=1` では `2+2<5` が成立するが、作ろうとしている区間は `[2,6)` で、配列の右端を超える。`st[4][1]` というセルが存在しても、それが有効な長さ2の区間積とは限らない。

左辺が定義できる必要十分条件は、

<div class="math-block">
$$
i+2^{j+1}\le n
$$
</div>

である。

### 誤り②：`< n` にして、等号のケースを落とす

~~~python
# 誤り
if i + (1 << (j + 1)) < n:
    ...
~~~

半開区間 `[l,r)` では、`r=n` でも正しい。したがって **`<` ではなく `<=`** が必要。

例えば `n=4,i=0,j=1` で、区間 `[0,4)` の計算は当然必要。しかし `4<4` は偽になり、`st[0][2]` が未計算のまま残る。これがWAにつながった。

### 誤り③：`range(K)` のまま `j+1` に代入する

列番号は `0,\dots,K-1` なので、`j=K-1` で `st[i][K]` を書き込むとREになり得る。`range(K-1)` にする。

### ここでの整理

| 確認 | 今回の意味 | 条件・工夫 |
|---|---|---|
| 状態が存在するか | `st[i][j+1]` が表す全区間が収まるか | $i+2^{j+1}\le n$ |
| 配列添字が有効か | `j+1` が列数を超えないか | `j in range(K-1)` |
| 依存先が計算済みか | 必要な右辺の値が完成しているか | `j` 外側、または `i` 降順 |
| 等号を含むか | `[i,n)` も有効か | `<= n` |

単に配列外参照を防ぐだけなら、右辺の添字を検査したくなる。しかし**数式の左辺が表す状態の定義域**を先に決めれば、添字の安全性も同時に見通せる。

## 6. クエリ：長さが2冪でない区間をどうするか

`prod(l,r)` で `[l,r)` の最小値を求めたい。長さを `d=r-l` とおく。

<div class="math-block">
$$
k=\lfloor\log_2d\rfloor,\qquad 2^k\le d<2^{k+1}
$$
</div>

`d` がちょうど2冪なら、前計算した1区間で取得できる。それ以外では、**左端から長さ $2^k$ の区間**と、**右端から長さ $2^k$ の区間**を選ぶ。

<div class="math-block">
$$
[l,l+2^k),\qquad [r-2^k,r)
$$
</div>

この2区間の和集合は `[l,r)` に一致し、中央が重複する場合がある。しかし、`min` には

<div class="math-block">
$$
\min(x,x)=x
$$
</div>

という**冪等律**がある。さらに `min` は結合的・可換なので、同じ要素が重なっても区間全体の最小値は変わらない。

<div class="math-block">
$$
\min(A[l:r])
=
\min\bigl(T[l][k],T[r-2^k][k]\bigr)
$$
</div>

Pythonでは、

~~~python
def prod(self, l, r):
    # 前提: 0 <= l < r <= n
    k = (r - l).bit_length() - 1
    w = 1 << k
    return min(self.st[l][k], self.st[r - w][k])
~~~

と書ける。`d=1` でも `k=0` なので特別扱いは不要。`d` が2冪なら2区間が完全に一致するが、冪等性により問題ない。

**構築には結合律、重複を許した2区間クエリには結合律・可換性・冪等律**という役割の違いに注意したい。一般の「結合的かつ冪等」な非可換演算で、この重複クエリが常に成立するわけではない。一方、重複しない2冪区間に分割して `O(\log N)` で集約する方法なら、結合律を使える。

## 7. 完成コード：降順版と昇順版

以下は、開始位置を降順に処理する純Python版。**PyPy3での提出でACした方針**である。

~~~python
import sys
input = sys.stdin.buffer.readline

INF = 10**20

class SparseTable:
    def __init__(self, a):
        n = len(a)
        K = n.bit_length()
        self.st = [[INF] * K for _ in range(n)]

        # 長さ1の区間の値を初期化
        for i in range(n):
            self.st[i][0] = a[i]

        # 右側の開始位置から計算し、依存先を確定させる
        for i in range(n - 1, -1, -1):
            for j in range(K - 1):
                # 左辺 st[i][j+1] が表す区間が存在するか
                if i + (1 << (j + 1)) > n:
                    break
                self.st[i][j + 1] = min(
                    self.st[i][j],
                    self.st[i + (1 << j)][j]
                )

    def prod(self, l, r):
        # min(a[l:r]); 0 <= l < r <= n
        k = (r - l).bit_length() - 1
        w = 1 << k
        return min(self.st[l][k], self.st[r - w][k])

N, Q = map(int, input().split())
A = list(map(int, input().split()))
st = SparseTable(A)

ans = []
for _ in range(Q):
    l, r = map(int, input().split())
    ans.append(str(st.prod(l, r)))

print("\n".join(ans))
~~~

### 開始位置 i を昇順に回す実装

指数 `j` を外側に回すことで、開始位置 `i` を昇順にしても依存先が計算済みになる。状態の定義とクエリは降順版と同じ。

~~~python
import sys
input = sys.stdin.buffer.readline

INF = 10**20

class SparseTable:
    def __init__(self, a):
        n = len(a)
        K = n.bit_length()
        self.st = [[INF] * K for _ in range(n)]

        # 長さ1の区間の値を初期化
        for i in range(n):
            self.st[i][0] = a[i]

        # 指数を外側に回し、開始位置 i を昇順に処理
        for j in range(K - 1):
            for i in range(n - (1 << (j + 1)) + 1):
                self.st[i][j + 1] = min(
                    self.st[i][j],
                    self.st[i + (1 << j)][j]
                )

    def prod(self, l, r):
        # min(a[l:r]); 0 <= l < r <= n
        k = (r - l).bit_length() - 1
        w = 1 << k
        return min(self.st[l][k], self.st[r - w][k])

N, Q = map(int, input().split())
A = list(map(int, input().split()))
st = SparseTable(A)

ans = []
for _ in range(Q):
    l, r = map(int, input().split())
    ans.append(str(st.prod(l, r)))

print("\n".join(ans))
~~~

構築は $O(N\log N)$、クエリは $O(1)$、メモリは $O(N\log N)$。

### 小さな全区間テスト

~~~text
4 10
2 10 1 100
0 1
0 2
0 3
0 4
1 2
1 3
1 4
2 3
2 4
3 4
~~~

期待出力：

~~~text
2
2
1
1
10
1
1
1
1
100
~~~

`N=1`、`r=N`、`r-l=1`、`r-l=2^k`、`r-l=2^k+1` のような端点も確認したい。

## 8. NumPy・CPython・PyPy3：同じ計算量でも実行時間は違う

NumPyによる前計算の高速化は、ikatakos（いかたこ）氏の「[Sparse Table](https://ikatakos.com/pot/programming_algorithm/data_structure/sparse_table)」（いかたこのたこつぼ）を参考にした。以下は、その配列演算による構築方法を説明用に書き換えたコードである。

~~~python
# ある段の情報 prev から次の段を構築
w = 1 << (k - 1)
nxt = np.minimum(prev[:-w], prev[w:])
~~~

配列同士の対応を一度に計算できるので、Pythonの内側ループを省ける。一方、通常の二重for実装はCPythonでTLEになった。

しかし、**同じ純PythonコードをPyPy3で提出したところACし、実行時間は2秒未満で、今回のNumPy版よりも速かった。** 同じ計算量でも、言語処理系・ループの最適化・ライブラリ呼び出しなどの定数倍が結果を変える。

PyPyはJITコンパイルで繰り返し実行するPythonのループを最適化できる。NumPyは配列演算を主にコンパイル済みの実装でまとめて処理する。方向性は異なるが、**Pythonレベルの反復処理のコストを減らす**という点でつながっている。

また、実際のLibrary Checkerの提出環境ではNumPyのimport可否が言語選択によって変わった。NumPyを採用するときは、アルゴリズムの正しさだけでなく、そのジャッジの言語環境も確認したい。

## 9. さらに簡潔にするなら：段を行として持つ

元の表は `st[i][k]` という配置だった。これを `st[k][i]` にすると、同じ長さの区間積を1行にまとめられる。

~~~python
class SparseTable:
    def __init__(self, a):
        n = len(a)
        self.st = [a[:]]
        for k in range(1, n.bit_length()):
            prev = self.st[-1]
            w = 1 << (k - 1)
            self.st.append([
                min(x, y)
                for x, y in zip(prev, prev[w:])
            ])

    def prod(self, l, r):
        k = (r - l).bit_length() - 1
        w = 1 << k
        return min(self.st[k][l], self.st[k][r - w])
~~~

これはNumPyのスライスによる実装と同じ構造が見えやすい。`zip(prev, prev[w:])` が、「位置 `i` の区間」と「位置 `i+w` の区間」を対応させている。

ただし、**学習の過程では、最初に自分で定義した `st[i][k]` を保持したまま書けることにも意味があった**。高速化は、状態・依存関係・区間端点の正しさを確かめた後で考える。

## 10. 振り返り：今回、本当に詰まっていた場所

数学的な着想は早かった。ダブリングとの共通構造に気づき、「各開始位置について2冪長の区間積を保持する」と定義し、漸化式も導出できた。

一方、実装では次の混乱を繰り返した。

1. **状態の意味と添字の取り違え**：`st[i][k]` の `k` は指数なのに、長さ `1<<k` を列番号として使いかけた。
2. **未計算状態の参照**：`i` を昇順に回すと、右側にある `st[i+2^j][j]` が完成していなかった。
3. **定義域と配列外参照の混同**：`i+2^j<n` は配列の添字しか見ておらず、長さ `2^{j+1}` の区間が存在することを保証しなかった。
4. **半開区間の等号**：`[i,n)` は有効なので、`<n` ではなく `<=n` が必要だった。
5. **列数と最大添字の混同**：`K=n.bit_length()` は列数で、代入先 `j+1` を作る場合は `j<K-1` が必要だった。
6. **TLEとアルゴリズムの誤りの切り分け**：計算量が正しくても、CPythonの二重ループは実行時間が厳しかった。PyPyではACできた。

今後DPを実装するときは、漸化式を書いた後、以下を順に確認する。

**① 左辺の状態の意味 → ② その状態が存在する必要十分条件 → ③ 右辺が計算済みとなる順序 → ④ Pythonのrangeと境界の等号 → ⑤ 小さい全区間テスト**

今回の学びは「Sparse Tableのテンプレートを覚えた」ということ以上に、**数学的に定義した状態を、正しいループ順序と添字範囲に落とし込むための考え方**を掴み直したことだと思う。
