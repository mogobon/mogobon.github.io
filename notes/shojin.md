tags: [精進記録]
# 精進記録

# 2025/08/26?

```python
n,w=map(int,input().split())
l = list(tuple(map(int,input().split()))for _ in range(n))
l.sort(key=lambda x: (-x[0],x[1]))
weight = 0
ans = 0
for i in range(n):
    if weight + l[i][1] <= w:
        weight += l[i][1]
        ans += l[i][0]*l[i][1]
    else:
        ans += l[i][0]*(w - weight)
        weight += w - weight
print(ans)

```

# 2025/08/26


```python
n,m=map(int,input().split())
c=list(map(int,input().split()))
d2p,p2d=[],[[]for _ in range(n)]
K=[]
for _ in range(m):
    k,*a=list(map(lambda x:int(x)-1,input().split()))
    k += 1
    d2p.append(a)
    K.append(k)
# print(d2p)
for i in range(m):
    for j in range(K[i]):
        p2d[d2p[i][j]].append(i)
# print(p2d)

ans = 10**18 + 1
from collections import defaultdict
for tri in range(3**n):
    # 何かわからない（迷った時にcntが何かわからない）
    # 各動物が何回数えられるか
    cnt = defaultdict(int)
    # nowtri = tri
    visits = [0]*n # 訪れた回数を管理(forの中でできる)
    # visits_cnt変数名わかりにくい
    
    # 非常に見やすくない
    # for t in range(n):
    #     f = nowtri % 3
    #     visit_cnt[t] = f
    #     for j in range(len(p2d[t])):
    #         cnt[p2d[t][j]] += f
    #     nowtri //= 3

    # Oは変わらないので、処理を分割する（定数倍が通ると信じて）
    t = tri
    for i in range(n):
        visits[i] = t % 3
        t //= 3

    # visits -> cnt
    for zoo in range(n):
        v = visits[zoo]
        for animal in p2d[zoo]:
            cnt[animal] += v
    
    # 全ての動物が2回以上見られるか？
    ok = True
    for i in range(m):
        if cnt[i] < 2:
            ok = False
            break
    if ok:
        pay = 0
        for i in range(n):
            # pay += c[i] * f # 原因
            pay += c[i] * visits[i]
        
        ans = min(ans, pay)

print(ans)


# ans = 10**18 + 1
# from collections import defaultdict
# for tri in range(3**n):
#     cnt = defaultdict(int)
#     nowtri = tri
#     for t in range(n):
#         f = nowtri % 3
#         for j in range(len(p2d[t])):
#             cnt[p2d[t][j]] += f
#         nowtri //= 3
    # for-elseで書かない方が処理が複雑にならずに
    # 追いやすい時もある（複雑な時は特に）
    # for-elseはまとめた書き方なので。
#     for i in range(m):
#         if cnt[i] < 2:
#             break
#     else:
#         pay = 0
#         for i in range(n):
#             pay += c[i] * f # 原因

#         ans = min(ans, pay)
# print(ans)


    

```

# 2025/08/28

```python
# cook your dish here
n, x = map(int,input().split())
a = list(map(int,input().split()))

from bisect import bisect_left, bisect_right

# x <= a[i]となる最小のi
a.sort()
l = bisect_left(a,x)
print("YES" if a[l]==x else "NO")


# print("YES"if x in a else "NO")


# found = False
# for i in range(n):
#     if x == a[i]: 
#         found = True
# print("YES"if found else "NO")
```

[](https://www.codechef.com/practice/course/arrays/ARRAYS/problems/UWCOI20A?tab=Help)
```python
# cook your dish here
t = int(input())
for i in range(t):
    
    
    n = int(input())
    a = list(map(int,input().split()))
    print(max(a))
    
    # mx = -1
    # for i in range(n):
    #     mx = max(mx, a[i])
    # print(mx)
        


#     a.sort()
#     print(a[-1])

    # print(sorted(a)[-1])
```

```python
t = int(input())

while t > 0:
    n, x, y = map(int, input().split())
    # a = list(map(int, input().split()))
    t -= 1
    prices = list(map(int, input().split()))
    if sum(prices) > sum(max(0,price-y) for price in prices) + x:
        print("COUPON")
    else:
        print("NO COUPON")
    
    # 時系列
    
    # Your code goes here
    # MAX_P = max(a)
    # dp = [[n*MAX_P+1]*(n*MAX_P+1)for _ in range(n+1)]
    # dp[0][0] = 0
    # for i in range(1,n+1):
    #     for j in range(MAX_P+1):
    #         dp[i][j] = min(dp[i-1][j]+x)
    
    # original = sum(a)
    # use_coupon = 0
    # for i in range(n): use_coupon += max(0, a[i]-y)
    # use_coupon += x
    # print("COUPON"if use_coupon < original else "NO COUPON")
        
    # INF = 10**18
    # dp = [INF]*(n+1)
    # dp[0] = 0
    # for i in range(1,n+1):
    #     dp[i] = dp[i-1] + a[i-1]
    #     dp[i] = min(dp[i], dp[i-1] + max(a[i-1]-y,0) + x)
    
    # print("COUPON"if original > dp[n] else"NO COUPON")
```
https://atcoder.jp/contests/abc141/tasks/abc141_d

```python
# AC
# from heapq import heapify,heappop,heappush
# que=[]
# for x in a: que.append(-x)
# heapify(que)
# cnt = 0
# for t in range(m):
#     p = heappop(que)
#     p = -p
#     p //= 2
#     p = -p
#     p = heappush(que, p)
# ans =sum(-v for v in que)
# print(ans)

# WA
# for t in range(m):
#     if cnt >= m: break
#     p = heappop(que)
#     p = -p # せいにする
#     q = p
#     temp = 0
#     while q // 2 > 0:
#         q //= 2
#         temp += 1
#     p = -p # 負にする
#     cnt += temp
#     heappush(que, p//(2 ** cnt))

# ans = sum(-v for v in que)
# print(ans)
```

```python
"""https://atcoder.jp/contests/abc330/tasks/abc330_d"""
n = int(input())
s = [input()for _ in range(n)]
cntR,cntC=[0]*n,[0]*n
for i in range(n):
    for j in range(n):
        if s[i][j]=="o":
            cntR[i]+=1
            cntC[j]+=1

ans=0
for i in range(n):
    for j in range(n):
        if s[i][j]=="o":
            ans+=(cntR[i]-1)*(cntC[j]-1)
print(ans)



# before
# from collections import defaultdict
# dd = defaultdict(list)
# cnt = defaultdict(int)

# n = int(input())
# s = [input()for _ in range(n)]

# for i in range(n):
#     for j in range(n):
#         if s[i][j]=="x": continue

#         dd[i].append((i,j))

# for j in range(n):
#     for i in range(n):
#         if s[i][j]=="x": continue

#         cnt[j] += 1

# ans = 0
# for j1 in range(n):
#     for j2 in range(j1+1, n):

#         ans += cnt[j1] + cnt[j2] - 2

# print(ans)
```


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

# 回文判定+一文字消しておk
```python
from collections import deque
# 一回削って回文にできるか？
# 外側から見ていって、不一致を探す
# 不一致だったら、回文かどうかをみる
# 左を削る場合と右を削る場合、どちらかで回文になればOK
# どちらもダメだったらアウト

# 欲しいもの：
    # 回文判定機:
        # 入力: 文字列
        # 出力: 回文かどうか？
    # 外側から見る
    # 不一致だったら、回文判定機に、次を渡す
        # 不一致の文字のうち左の文字を除いた文字列
        # 不一致の文字のうち右の文字を除いた文字列
    # 回文判定機がどちらかがTrueだったらOK
    # どちらもFalseだったら、NO

def is_palindrome(s, l, r):
    """s[l:r]が回文かどうかを判定する"""
    i = l
    j = r
    while i < j:
        if s[i] != s[j]: return False
        i += 1
        j -= 1
    return True
    

def valid_palindrome(s):
    # 両側のポインタが半分まで進むのは、n//2より、l,rを用いる方が書きやすい
    l = 0
    r = len(s) - 1
    while l < r:
        # 不一致あり
        if s[l] != s[r]:
            # s[l+1:r]
            p1 = is_palindrome(s, l+1, r)
            # s[l:r-1]
            p2 = is_palindrome(s, l, r-1)
            if p1 or p2:
                return True
            else:
                return False
        l += 1
        r -= 1
    # 不一致なし
    return True        
            
        

if __name__ == "__main__":
    import sys
    input = sys.stdin.read
    data = input().split()
    
    n = int(data[0])
    s = data[1]
    print("true" if valid_palindrome(s) else "false")

```

```python
# https://atcoder.jp/contests/abc334/tasks/abc334_b
a,m,l,r=map(int,input().split())
# # print((r-a)//m-(l-a-1)//m)
from bisect import bisect_left,bisect_right
g = range(a-2*(10**18)*(m),10**18+1,m)
print(bisect_right(g, r)-bisect_left(g, l))

```


# 沼
Debug

https://atcoder.jp/contests/abc394/tasks/abc394_c
```python
# s = input()
# n = len(s)
# ans = []
# # r = n-1
# st = False
# Wcnt = 0
# for r in range(n-1,-1,-1):
#     if s[r] == "A":
#         st = True
#     elif s[r] == "W":
#         if st: Wcnt += 1
#     else:
#         if st: 
#             ans.append("C")
#             ans.append("A"*Wcnt)
#             st = False
#             Wcnt = 0
#             ans.append(s[r])
# if Wcnt > 0:
#     ans.append("C"*Wcnt)
#     ans.append("A")
# if len(ans) == 0:
#     ans.append(s)
# print("".join(ans[::-1]))



# while r > 0:
#     # WWWAだけ見る
#     if s[r] == "A":
#         l = r
#         while l-1 > 0 and s[l-1]=="W":



# while l < n:
#     if s[l] == "W":
#         r = l
#         while r+1 < n and s[r+1] == "W":
#             r += 1
#         if r+1 < n and s[r+1] == "A":
#             ans.append("A"+"C"*(r-l))
#         else:
#             ans.append(s[l:r+1])
#         l = r+1
#     else:
#         ans.append(s[l])
#         l += 1
# print("".join(ans))
```

# zipの使い方を調べたい

* `zip`は`for`が使用されるまで展開されない遅延評価
* `zip`は添え字を持たない(not subscriptable)
* `zip`はアンパックできる
* アンパック何者？←イマココ

```python
n = int(input())
s = [list(input()) for _ in range(n)]
t = [list(input()) for _ in range(n)]
ans = 0
for i in range(n):
    for j in range(n):
        ans += s[i][j]!=t[i][j]

lv = 3
while lv > 0:

    s = zip(*s[::-1])

    # print(s)
    # print(t)
    cnt = 4-lv
    for i in range(n):
        for j in range(n):
            cnt += s[i][j]!=t[i][j]
    ans = min(ans, cnt)
    lv -= 1
print(ans)
```

# Weak Takahashi
* 間違い
```python
H,W=map(int,input().split())
C=[input()for _ in range(H)]
dp = [[0]*W for _ in range(H)]
dp[0][0]=1
for i in range(H):
    for j in range(W):
        if C[i][j]=="#": continue
        if i-1 >= 0 and C[i-1][j]!="#": dp[i][j]+=dp[i-1][j]+1
        if j-1 >= 0 and C[i][j-1]!="#": dp[i][j]+=dp[i][j-1]+1

ans = 0
for i in range(H):
    for j in range(W):
        print(dp[i][j],end=" ")
    print()
for row in dp:
    ans = max(ans, max(row))
print(ans)
```


# メモ化DFS

Weak Takahashi

<a href="https://atcoder.jp/contests/abc232/tasks/abc232_d" target="_blank">問題リンク</a>
```python
def dfs(i,j):
    if C[i][j]=="#":
        memo[i][j] = 0
        return 0
    if i==H-1 and j==W-1:
        memo[i][j] = 1
        return 1
    if memo[i][j]:
        return memo[i][j]
    
    best = 0
    for dx,dy in ((0,1),(1,0)):
        nx = i + dx
        ny = j + dy
        if 0 <= nx < H and 0 <= ny < W:
            best = max(best, dfs(nx,ny))
    
    # return best + 1
    memo[i][j] = best + 1
    return memo[i][j]

ans = dfs(0,0) # i,j,n

print(ans)
```

# 遷移が右or下方向のみ⇒右下から左上へ二重ループ

```python
# 再帰
# f(i,j): i,jから初めて高橋くんが通るマスの数
# f(i,j)=max(f(i+1,j),f(i,j+1))+1
# 初期化 f(i,j) = 1
H,W=map(int,input().split())
C=[input()for _ in range(H)]
f = [[0]*(W+1) for _ in range(H+1)]
for i in range(H-1,-1,-1):
    for j in range(W-1,-1,-1):
        if C[i][j]=="#": continue
        f[i][j] = max(f[i+1][j],f[i][j+1])+1
        # if i+1<H and f[i][j]<=f[i+1][j] and C[i+1][j]!="#": f[i][j] += f[i+1][j]
        # if j+1<W and f[i][j]<=f[i][j+1] and C[i][j+1]!="#": f[i][j] += f[i][j+1]

print(f[0][0])
```

## 番兵
* 番兵は無害な値を置いておく。
* 今回の場合、0

## 遷移
* 遷移元の計算結果(そのマスから進んで訪れるマスの個数)

## 状態
* 状態 = (自分自身のマス) + (遷移元の計算結果)
* 常に, 1 + dfs(i+dx,j+dy)

## 遷移の集約と状態の確定
* 全ての遷移を`max`で集約して、計算結果が確定する
* 次に注意する。
* ⭕️ `max(全ての遷移) + 1`
* ❌ `max(全ての遷移 + 1)`
* これは次のように実装する
* 2段階で行う。
  1. 遷移させた計算結果を`max`で集約する。
  2. 集約した値に常に`+1`すれば計算結果を確定させることができる。
* 擬似コード
* `best = 0`
* `best = max(best, dfs(i+dx,j+dy)`
* **メモ化**
* `return 計算結果`
  * 次のうちどちらでもACするがメモ化することが大事
  * `return best + 1` 
  * `return memo[i][j]` 

# メモ化DFSの実装上の注意点

## メモ化

* 大事なシステム。これがないとTLEする
* 今回、`return`するときは常に`memo`の値である
* `memo`に記憶されていない場合
  * **`memo`に記憶してから**返す。
  * 遷移だけ書いて満足して`memo`に記憶するのを忘れがちなので注意。
* `memo`に記憶してあるなら、`memo`を返す


## 到達不可能な状態の処理
* 普通のDFSと同様と思われるがどちらでも書き漏れがなければ良い
* ✅遷移する前に枝刈りする
  * 推奨。テキトーに書くと`dfs()`を呼び出すまでぐちゃぐちゃするが、ちゃんとそうならないように書けばそれほどではない。
* ⚠️現在の状態で`return 0`しても良い？
  * これはなんでうまく行くのかわかっていない。
