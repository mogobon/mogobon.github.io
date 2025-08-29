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