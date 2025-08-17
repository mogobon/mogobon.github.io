# 競プロノート

競技プログラミングの典型手法や数式メモをまとめていきます。

## 二分探索

$f(x)$ が単調増加関数のとき、$f(x) \geq t$ となる最小の 非負整数$x$ を求めるには次のようにします。

```python
ok,ng = n,-1
while abs(ok-ng) > 1:
    mid = (ok+ng) >> 1
    if f(mid) >= t:
        ok = mid
    else:
        ng = mid
```

これで上手くいくなら別にいいんだが。

$$A_{i}$$

\[\sum_{i=1}^{n}a_{i}\]

$$
B_{i}
$$

\[
\text{test}
\]