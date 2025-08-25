tags: [バチャ参加記]
# 地獄の灰色100問マラソン記録用

* 復習用
* 問題リンク: [地獄の灰色100問マラソン](https://kenkoooo.com/atcoder/#/contest/show/38d1aa05-f757-42cc-b7f5-816d62824d83?activeTab=Problems)

```python

# ❌は初手の方針で間違え
# 自分はこの方針で解き進めてしまうくせがあるので直そう

"""Apple Pie"""
a,p=map(int,input().split())
# print(3*a//2+p//2) # ❌綺麗に解こうとしない
# かけらを2で割った時の商、
# コーナーケース
    # りんごがかけらとくっついてアップルパイになる
piece = p + 3*a
print(piece//2)

"""Takahashi's Secret"""
# sim
n, x = map(int,input().split())
a = list(map(lambda x:int(x)-1,input().split()))
known = [False]*n
# ❌誤読（iが昇順に決まっていく・よくあるパターン）
# for i in range(n):
#     if not known[a[i]]:
#         known[a[i]] = True
# print(sum(known))

# よくあるパターンから入らずに、問題文をちゃんと読もう
# x -> a[x] -> a[a[x]] -> ...
# の時系列で決まっていく
# 自己ループはない
# 一度も戻って来ずに全部埋まるか、途中で知っている人に戻ってくるか
# だから爆発しない、O(N)
x -= 1
known[x] = True
while not known[a[x]]:
    known[a[x]] = True
    x = a[x]
print(sum(known))    

"""Pasta"""
n,m=map(int,input().split())
a=list(map(int,input().split()))
b=list(map(int,input().split()))
from collections import Counter
cnt = Counter(a)
for i in range(m):
    # 存在しないは0以下、0未満で間違えた
    if cnt[b[i]] <= 0: exit(print('No'))
    cnt[b[i]] -= 1
print('Yes')

"""Trimmed Mean"""
n = int(input())
x = [0]+list(map(int,input().split()))
x.sort()
sm = sum(x)
ans = 0
# sm -= x[1:n+1]
# sm -= x[-n:] # ❌スライスに夢中でとんでもないことをした
sm -= sum(x[1:n+1]) + sum(x[-n:])
print(sm/(3*n))

"""Cat"""
n = int(input())
s = input()
# s.replace("na","nya")❌
# print(s) 
# ❌ デバッグプリントの残し→Test&Submitで防げる
i = 0
ans = []
while i < n:
    if i+1 < n and s[i]+s[i+1]=="na":
        ans.append("nya")
        i += 2
    else:
        ans.append(s[i])
        i += 1
print("".join(ans))

"""Chessboard"""
h,w=8,8
s = [input()for _ in range(h)]

for i in range(h):
    for j in range(w):
        if s[i][j]=="*":px,py=i,j
nx = h-1-px
ny = py
abc = 'abcdefghijklmnopqrstuvwxyz'
# abc = 'abcdefgh'
num = "123456789"
print(abc[ny]+num[nx])

"""Anyway Takahashi"""
a,b,c,d=map(int,input().split())
print((a+b)*(c-d))
print("Takahashi")

"""Sharing Cookies"""
a,b=map(int,input().split())
if a%3==0 or b%3==0 or (a+b)%3==0:
    # exit(print('Yes')) # ❌焦りすぎ
    exit(print('Possible'))
# print("No")
print('Impossible')

"""Meal Delivery"""
x,a,b=map(int,input().split())
if abs(x-a)<abs(x-b):
    print("A")
else:
    print("B")

"""Five Antennas"""
a=[int(input())for _ in range(5)]
k = int(input())
n = len(a)
from itertools import combinations
for p,q in combinations(a,2):
    if abs(p-q)>k: exit(print(":("))
print("Yay!")

"""Bitter Alchemy"""
# ❌ 騒音などうるさい環境だと集中力が落ちる
n,x=map(int,input().split())
m=[int(input()) for _ in range(n)]
# 1回作って、残りは全て最小
ans = n
# x %= sum(m) # ❌一回引く≠あまり
x -= sum(m)
m.sort()

ans += x//m[0]

# while x > 0:
#     x -= m[0]
#     ans += 1
# ❌引きすぎる

print(ans)
# ❌ 作戦・計画を言語化できていない状態で実装して沼
# ぐるぐる回ってからではない
# m.sort() # ❌処理がパンクしてソートするのを忘れた
# sm = sum(m)
# ans = (x//sm)*n
# x%=sm
# # 貪欲に最小を使う方が良い
# ans += (x//m[0])
# print(ans)
# # ❌最適でない組み合わせ
# # for i in range(n):
# #     if x - m[i] >= 0:
# #         x -= m[i]
# #         ans += 1
# #     else:
# #         break

"""Bitter Alchemy(改)"""
n,x=map(int,input().split())
a=[int(input())for _ in range(n)]
# 一回作って残りは安いやつ
# xからsum(a)を引いて、nとx//a[0]を足す
x -= sum(a)
a.sort()
ans = n + x//a[0]
print(ans)

"""Sandglass2"""
# 上がt落ちると下は何g
x,t=map(int,input().split())
print(max(0,x-t))

"""Subscribers"""
# ❌場合分けをテキトーに考えて間違える
n,a,b=map(int,input().split())
print(min(a,b),0 if n-(a+b)>=0 else (a+b)-n)

"""Haiku"""
s=input().split(",")
# ❌.split()は戻り値がリスト
# アンパックを忘れない
print(*s) 

"""Security"""
s = input()
n = 4
for i in range(n-1):
    if s[i]==s[i+1]:
        exit(print("Bad"))
print("Good")

"""Saturday"""
day = {"Monday":0, "Tuesday":1, "Wednesday":2, "Thursday":3, "Friday":4}
print(5-day[input()])


"""Find Takahashi"""
n=int(input())
h=list(map(int,input().split()))
print(h.index(max(h))+1)

"""Append"""
a=[]
for _ in range(int(input())):
    op=list(map(int,input().split()))
    if op[0]==1:
        a.append(op[1])
    else:
        print(a[-op[1]])

"""Exponentional or Quadratic"""
n = int(input())
if n < 2 or 4 < n:
    print('Yes')
else:
    print('No')

"""Sumo"""
s = input()
o = sum([c == "o"for c in s])
x = sum([c == "x"for c in s])
o += 15 - o # ❌ o += 15 - x
print("YES"if o >= 8 else "NO")

""" Traveling AtCoDeer Problem"""
n=int(input())
a=list(map(int,input().split()))
a.sort()
print(a[-1]-a[0])

"""September 9"""
n = input()
for c in n:
    if c == "9":
        exit(print('Yes'))
print('No')

"""Century"""
print((int(input())+99)//100)

"""Ball Distribution"""
n,k=map(int,input().split())
if k==1:exit(print(0))
n -= k
m,M=1,1
M+=n
print(M-m)

"""Ball Distribution(改)"""
n,k=map(int,input().split())
print(n-k if k!=1 else 0)

"""Visiblity"""
h,w,x,y=map(int,input().split())
s=[input()for _ in range(h)]
x,y=x-1,y-1
#左
ans = 1
c = 0
while y-c-1 >= 0 and s[x][y-c-1]!="#":
    c += 1
ans += c
#右
c = 0
while y+c+1 < w and s[x][y+c+1]!="#":
    c += 1
ans += c
#上
c = 0
while x-c-1 >= 0 and s[x-c-1][y]!="#":
    c += 1
ans += c
#下
c = 0
while x+c+1 < h and s[x+c+1][y]!="#":
    c += 1
ans += c
print(ans)

"""Visiblity(改)"""
# グリッドをまっすぐ一つずつ調べるはfor文との相性がいい
h,w,x,y=map(int,input().split())
s=[input()for _ in range(h)]
x,y=x-1,y-1
ans = 1
for i in range(x+1,h):
    if s[i][y] == "#": break
    ans += 1
for i in range(x-1,-1,-1):
    if s[i][y] == "#": break
    ans += 1
for j in range(y-1,-1,-1):
    if s[x][j] == "#": break
    ans += 1
for j in range(y+1,w):
    if s[x][j] == "#": break
    ans += 1
print(ans)

"""Weather Prediction"""
s = input()
if s == "Sunny": print("Cloudy")
elif s == "Cloudy": print("Rainy")
else: print("Sunny")

"""ABC420A"""
x,y=map(int,input().split())
l=[i for i in range(1,13)]
i=l.index(x)
l[(i+y)%12]

"""2^N"""
# N <= 30で十分高速(57ms)
# 2^30≒10^9
print(2**int(input()))

"""Remove It"""
ans = []
n,x=map(int,input().split())
a = list(map(int,input().split()))
for c in a:
    if c != x: ans.append(c)
print(*ans)

"""You should output ARC, though this is ABC."""
r,c=map(lambda x:int(x)-1,input().split())
# ❌ s=[input()for _ in range(2)]
s = [list(map(int,input().split())) for _ in range(2)]
print(s[r][c])

"""Which is ahead?"""
n = int(input())
p = list(map(lambda x:int(x)-1,input().split()))
p2i = [0]*n
for i in range(n): p2i[p[i]]=i
for _ in range(int(input())):
    a,b=map(lambda x:int(x)-1,input().split())
    if p2i[a] > p2i[b]:
        print(b+1)
    else:
        print(a+1)
"""God Sequence"""
# ❌: 実装が遅い
a,b=map(int,input().split())
p = [i for i in range(1,a+1)]
m = [-i for i in range(1,b+1)]
if a > b:
    # mの末尾をいじる
    n = a - b 
    new = m[-1]
    for i in range(b+1,a+1):
        new -= i
    m.pop()
    m.append(new)
elif a < b:
    # pの末尾をいじる
    n = b - a 
    new = p[-1]
    for i in range(a+1,b+1):
        new += i
    p.pop()
    p.append(new)

ans = m + p
print(*ans)

"""Faling Asleep"""
n = int(input())
playlist = []
s = [0]
t = []
for _ in range(n):
    name, time = input().split()
    time = int(time)
    playlist.append(name)
    s.append(s[-1]+time)

x = input()

for i in range(n):
    if playlist[i] == x:
        asleep = i
        break

print(s[n] - s[asleep + 1])

"""Perfix?"""
s = input()
t = input()
if len(s) > len(t):
    exit(print('No'))
n = len(s)
m = len(t)
for i in range(n):
    if s[i] != t[i]: exit(print('No'))
print('Yes')

"""Judge Status Summary"""
n = int(input())
s = [input()for _ in range(n)]
from collections import Counter
cnt = Counter(s)
print(f"AC x {cnt['AC']}")
print(f"WA x {cnt['WA']}")
print(f"TLE x {cnt['TLE']}")
print(f"RE x {cnt['RE']}")

"""Task Scheduling Problem"""
from itertools import permutations
a = list(map(int,input().split()))
ans = 300
for p in permutations(range(3)):
    cost = 0
    for i,idx in enumerate(p):
        if i == 0: 
            past = a[idx]
        else:
            now = a[idx]
            cost += abs(past - now)
            past = now
    ans = min(ans, cost)
print(ans)

"""Task Scheduling Problem"""
from itertools import permutations
a = list(map(int,input().split()))
n = 3
ans = 300
for i in range(n):
    cost = 0
    for j in range(n):# ❌ nC2だからrange(i+1,n)
        if i == j: continue 
        cost += abs(a[i] - a[j])
    ans = min(ans, cost)
print(ans)

"""Task Scheduling Problem"""
# 最短距離問題と同じ
a = list(map(int, input().split()))
print(max(a) - min(a))

"""Harshad Number"""
x = int(input())
fx = sum(list(map(int,list(str(x)))))
if x%fx == 0:
    print('Yes')
else:
    print('No')

# ❌焦りすぎ
# n = int(input())
# ❌ここの処理が複雑になり頭がパンクしてテキトーになった
# fx = sum(list(map(int,list(str(n)))))
# if fx%n == 0:
#     print('Yes')
# else:
#     print('No')

"""Exact Price"""
x = int(input())
# ❌ x%100==0 つけ忘れてWA
# ❌「100 円硬貨が 1 枚以上入っており、それ以外には何も入っていません。」=「100円玉しか入っておらず、それが1枚以上です。」
print("Yes"if x >= 100 and x%100==0 else "No")

"""Happy Birthday!"""
x,y=map(int,input().split())
# ❌ >= 8 とか論理記号で悩んだ
if x >= 9 or y >= 9:
    print(":(")
else:
    print("Yay!")

"""Rainy Season"""
s = input()
rle = []
for c in s:
    if rle and rle[-1][0] == c:
        rle[-1][1]+=1
    else:
        rle.append([c,1])
ans = 0
for ch, cnt in rle:
    # ❌ans = max(ans, cnt)
    if ch == "R": ans = max(ans, cnt)
print(ans)

"""Rainy Season"""
#なぜ通らない❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓
# 理由あとで考える。以下はWAです。
s = input()
l = 0
ans = 0
for r in range(3):
    while s[l] != "R" and l < r:
        l += 1
    ans = max(ans, r-l+1)
print(ans)
#❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓❓

"""Rainy Season"""
s = input()
# 言い換え & 個数で考える。
b = [s[i]=="R"for i in range(3)]
p1 = s[0] == "R"
p2 = s[1] == "R"
p3 = s[2] == "R"
if p1 and p2 and p3:
    print(3)
elif (p1 and p2) or (p2 and p3):
    print(2)
elif p1 or p2 or p3:
    print(1)
else:
    print(0)

"""First Grid"""
# ❌ s=[input()for _ in range(2)]
s = [list(input())for _ in range(2)]
cnt = 0
p1 = [["#","."],[".","#"]]
p2 = [[".","#"],["#","."]]
for i in range(2):
    for j in range(2):
        cnt += s[i][j]=="#"
if cnt >= 3:
    print('Yes')
elif cnt >= 2:
    if s == p1 or s == p2:
        print('No')
    else:
        print('Yes')

"""Perfect String"""
s = input()
n = len(s)
p1 = any([s[i].isupper() for i in range(n)])
p2 = any([s[i].islower() for i in range(n)])
p3 = True
for i in range(n):
    for j in range(i+1,n):
        if s[i] == s[j]:
            p3 = False
            break
if p1 and p2 and p3:
    print('Yes')
else:
    print('No')

"""Gentle Pairs"""

from math import gcd
from fractions import Fraction
n = int(input())
p = [tuple(map(int,input().split()))for _ in range(n)]
ans = 0
for i in range(n):
    for j in range(i+1,n):
        # ❌複数の変数代入を一気にやろうとして間違えた
        # ❌x1,x2,y1,y2 = p[i][0],p[i][1],p[j][0],p[j][1] 
        x1,y1 = p[i][0],p[i][1]
        x2,y2 = p[j][0],p[j][1]
        dx = x2 - x1
        dy = y2 - y1
        
        # 制約より存在しない
        # if dx == 0: continue
        # ❌ これをcontinueしていた
        if dy == 0:
            ans += 1
            continue
        
        # これでも良い
        # if abs(dx) >= abs(dy):
        #     ans += 1
        
        # 以下の処理は不要
        if dx < 0:
            dx = -dx
            dy = -dy
        
        t = abs(gcd(dx,dy))
        
        dx //= t
        dy //= t
        
        if abs(dy) <= abs(dx):
            ans += 1
print(ans)

"""Gentle Pairs"""

n = int(input())
p = []
p = [tuple(map(int,input().split()))for _ in range(n)]
ans = 0
for i in range(n):
    for j in range(i+1,n):
        x1,x2=p[i][0],p[j][0]
        y1,y2=p[i][1],p[j][1]
        dx=x1-x2
        dy=y1-y2
        if abs(dy) <= abs(dx):
            ans += 1
print(ans)

"""Already 2018"""
s = list(input())
s[3]='8'
print("".join(s))

"""Smartphone Addiction"""

full,m,t=map(int,input().split())
now = full
flg = True
timeline = [tuple(map(int,input().split()))for _ in range(m)]
prev = 0
for i in range(m):    
    now -= timeline[i][0] - prev
    if now <= 0: flg = False
    # たす
    now = min(full, now + timeline[i][1] - timeline[i][0])
    prev = timeline[i][1]
if now - (t - prev) <= 0: flg = False
print('Yes'if flg else'No')
# ❌ 失敗
# for i in range(m):
#     a,b=map(int,input().split())
#     print(f"now={now}")
#     if now - a <= 0:
#         flg = False    
#     now -= a
#     print(f"now={now}")
#     now += (b-a)
#     print(f"now={now}")
#     if i == m-1:
#         last = b

# if now - last <= 0:
#     flg = False

# print('Yes'if flg else'No')

"""Can't Wait for Holiday"""
l={"SUN":7,"MON":6,"TUE":5,"WED":4,"THU":3,"FRI":2,"SAT":1}
s = input()
print(l[s])

"""Can you solve this?"""
n,m,c=map(int,input().split())
b = list(map(int,input().split()))
a = [list(map(int,input().split()))for _ in range(n)]
ans = 0
# ❌ケアレスミス C の存在を忘れて内積にしている
for i in range(n):
    cost = 0
    for j in range(m):
        cost += a[i][j]*b[j]
    ans += (cost + c > 0)
print(ans)
# import numpy as np
# b=np.array(list(map(int,input().split())))
# a = [np.array(list(map(int,input().split()))) for _ in range(n)]
# print(a)
# ans = 0
# for i in range(n):
#     print(np.dot(a[i], b))
#     ans += np.dot(a[i], b) > 0
# print(ans)

"""Batting Average"""
# 正しい解
a,b=map(int,input().split())
print(f"{b/a:.3f}")


# # 解2
# d, c = s.split(".")
# c = list(c)
# if len(c) <= 2:
#     for _ in range(len(c)): c.append("0")

# 解1
# スライスを使っても何番目が気になる
# コーナー 10.00
d, c = s.split(".")
if len(c) <= 2:
    c += "0"*(3-len(c))
else:
    if int(c[-1]) >= 5:
        c = c[:2] + str(int(c[2]) + 1)
    else:
        c = c[:3]
print(d + "." + c)
        
# ❌コーナー、idxのマジックナンバー、コードぐっちゃぐちゃ
# # print(s)
# if len(s) <= 4:
#     s += "0"*(5-len(s))
# else:
#     if int(s[5]) >= 5: 
#         s = s[:4] + str(int(s[4])+1)
#     else: s = s[:4+1]
# print(s)

"""Heavy Rotation"""
n = int(input())
if n%2 == 1:
    print("Black")
else:
    print("White")

"""Eating Symbols Easy"""
s = input()
ans = 0

for i in range(4):
    if s[i]=="+":
        ans += 1
    else:
        ans -= 1
print(ans)

"""Hina Arare"""
n = int(input())
s = list(input().split())
from collections import Counter
cnt = Counter(s)
if len(cnt) == 3: 
    print("Three")
else:
    print("Four")

"""Remaing Balls"""
s,t=input().split()
a,b=map(int,input().split())
from collections import defaultdict
cnt = defaultdict(int)
cnt[s] = a
cnt[t] = b
u = input()
cnt[u] -= 1
print(cnt[s],cnt[t])

"""Remaing Balls(改)"""
s,t=input().split()
a,b=map(int,input().split())
u = input()
if s == u: a -= 1
else: b -= 1
print(a, b)

"""Programming Education"""
op = int(input())
if op == 1: print("Hello World")
else:
    a = int(input())
    b = int(input())
    print(a+b)

"""ABCxxx"""
n = int(input())
print("ABC"+str(n))

"""Uneven Numbers"""
n = int(input())
ans = 0
for i in range(1,n+1):
    ans += len(str(i))%2 == 1
print(ans)

"""Trick or Treat"""
n,k=map(int,input().split())
cnt = [0]*n
for _ in range(k):
    d = int(input())
    a = list(map(lambda x:int(x)-1,input().split()))
    for i in range(d):
        cnt[a[i]] += 1
ans = 0
for i in range(n):
    # ❌それっぽい見た目をしているので間違えた
    # if cnt[a[i]] == 0: 
    if cnt[i] == 0: 
        ans += 1
print(ans)

"""Multi Test Cases"""
for _ in range(int(input())):
    n = int(input())
    a = list(map(int,input().split()))
    ans = 0
    for i in range(n):
        if a[i]%2 == 1:
            ans += 1
    print(ans)

"""Hitachi Sring"""
s = input()
n = len(s)
if n%2 != 0: exit(print('No'))
for i in range(0,n-1,2):
    if s[i]+s[i+1]!="hi":
        exit(print('No'))
print('Yes')

# ⭕️hiが繋がってできる = hiの連接のみの文字列
# ❌hiが含まれている
# s = input()
# n = len(s)
# for i in range(n-1):
#     if s[i]+s[i+1]=="hi":
#         exit(print('Yes'))
# print('No')

"""Triple Metre"""
t = "oxx"*100
s = input()
n = len(s)
for st in range(3):
    for i in range(n):
        # s[st+i] それっぽい見た目をしているがだめ
        if s[i] != t[st+i]:
            break
    else:
        exit(print('Yes'))
print('No')

"""Two Rectangles"""
a,b,c,d=map(int,input().split())
print(max(a*b,c*d))

"""Water Pressure"""
d = int(input())
print(d/100)

"""Default Price"""
n,m=map(int,input().split())
eat = list(input().split())
d = list(input().split())
p = list(map(int,input().split()))
from collections import defaultdict
dd = defaultdict(lambda: p[0])
for i in range(m):
    dd[d[i]] = p[i+1]
ans = 0
for i in range(n):
    ans += dd[eat[i]]
print(ans)

"""Extended ABC"""
s = input()
rle = []
for c in s:
    if rle and rle[-1][0] == c:
        rle[-1][1] += 1
    else:
        rle.append([c,1])
used={"A":False,"B":False,"C":False}
# print(rle)
for ch, _ in rle:
    
    if used["C"] and (ch == "A" or ch == "B"):
        exit(print('No'))
    
    if used["B"] and ch == "A":
        exit(print('No'))
    
    used[ch] = True

print('Yes')

# ❌面倒臭い & 誤読方針
# s = input()
# rle = []
# for c in s:
#     if rle and rle[-1][0] == c:
#         rle[-1][1] += 1
#     else:
#         rle.append([c,1])
# l = []
# for ch, _ in rle:
#     l.append(ch)
# if l == ["A","B","C"]: # ❌いきあたりばったり。8通りに気づく
#     exit(print('Yes'))
# print('No') 

"""MissingNo."""
# ❌ 連続と不連続で場合わけしない。
# 連続する場合、両端が定まらないので、歯抜けの配列しか与えられない。
# 歯抜けを探す問題になる。
n=int(input())
a=list(map(int,input().split()))
a.sort()
for i in range(n-1):
    if a[i] + 1 != a[i+1]:
        print(a[i] + 1)
        break

"""Tires"""
# 誘導に乗っかる
s=input()
if len(s) == 2:
    print("er")
else:
    if s[-3:] == "ist":
        print("ist")
    else:
        print("er")

"""Christmas Eve Eve"""
n = int(input())
p = [int(input()) for _ in range(n)]
p.sort()
p[-1]//=2
print(sum(p))

"""Measure"""
s = input()
if len(s) == 2:
    print(s)
else:
    # print("".join(list(reversed(s))))
    print(s[::-1])

"""Quizzes"""
n,x=map(int,input().split())
s=input()
for c in s:
    if c == "x":
        # x -= 1 # ❌
        x = max(0, x-1)
    else:
        x += 1
print(x)

"""Takahashi's Failure"""
n, k = map(int,input().split())
a = list(map(int,input().split()))
b = list(map(int,input().split()))
mx = max(a)
mxidx = []
for i in range(n):
    if a[i] == mx:
        mxidx.append(i+1)
for i in mxidx:
    if i in b:
        exit(print('Yes'))
print('No')

"""ReLU"""

def relu(x):
    # ❌ return 入れ忘れ
    return max(x, 0)
x = int(input())
print(relu(x))

"""Bitwise Exclusive Or"""
a,b=map(int,input().split())
print(a^b)

"""Discount"""
# a * (100-x)/100 = b を xについて解く
a,b=map(int,input().split())
x = 100*(a-b)/a
print(x)

"""Last Two Digits"""
n = int(input())
n = list(str(n))
print(n[1]+n[2])

"""HonestOrDishonest"""

a,b=input().split()
if a == "H":
    if b == "H":
        print("H")
    else:
        print("D")
else:
    if b == "H":
        print("D")
    else:
        print("H")

"""Remaing Time"""
time = [i for i in range(0,23+1)]

st, to = map(int,input().split())

i = time.index(st)

print(time[(i + to)%len(time)])

"""World Cup"""
y=int(input())
amari = y % 4
if amari == 2:
    print(y)
elif amari == 3:
    print(y + 3)
elif amari == 0:
    print(y + 2)
else:
    print(y + 1)

# ❌ 焦ってはいけない、ではなく、焦っていると碌なことをやらない
# y=int(input())
# print(y+(y-2)%4)


"""String Shifting"""
s = input()
n = len(s)
mx = s
mn = s
for i in range(n):
    s = s[1:] + s[0]
    if mx < s:
        mx = s
    if mn > s:
        mn = s
print(mn)
print(mx)

"""PC on the Table"""

h,w=map(int,input().split())
s=[list(input())for _ in range(h)]
ans = []
for i in range(h):
    temp = []
    j = 0
    while j < w:
        if j+1<w and s[i][j]+s[i][j+1]=="TT":
            temp.append("PC")
            j += 2
        else:
            temp.append(s[i][j])
            j += 1
    ans.append(temp)
for row in ans:
    print("".join(row))

"""Adjacent Squares"""
h,w=map(int,input().split())
r,c=map(lambda x:int(x)-1,input().split())

p1 = 0<=r+1<h and 0<=c<w
p2 = 0<=r-1<h and 0<=c<w
p3 = 0<=r<h and 0<=c+1<w
p4 = 0<=r<h and 0<=c-1<w

p = [p1,p2,p3,p4]
print(sum(p))

"""Poisonous Cookies"""
# ❌沼 条件を整理する。
a,b,c=map(int,input().split())
ans = b
if a + b >= c:
    ans += c
else:
    ans += a + b + 1
print(ans)

"""Cabbages"""
# ノートに図を書く
n,a,x,y=map(int,input().split())
if a > n:
    print(x*n)
else:
    print(x*a + (n-a)*y)

"""Line Sensor"""
h,w=map(int,input().split())
c = list(input()for _ in range(h))
ans = []
for j in range(w):
    cnt = 0
    for i in range(h):
        cnt += c[i][j] == "#"
    ans.append(cnt)
print(*ans)

# h,w=map(int,input().split())
# s = list(zip(*[list(input())for _ in range(h)]))
# ans = []
# # print(s)
# for j in range(w):
#     sm = 0
#     for i in range(h):
#         if s[j][i] == "#":
#             sm += 1
#     ans.append(sm)
# print(*ans)

"""Slot"""
c=input()
if c[0]==c[1]==c[2]:
    print("Won")
else:
    print("Lost")

"""Crane and Turtle"""

x,y=map(int,input().split())
def f(kame,x, y): 
    return x - kame >= 0 and 2*kame == y-2*x >= 0
for kame in range(0, x+1):
    if f(kame, x, y): exit(print('Yes'))
print('No')

"""Horizon"""
x = int(input())
from math import sqrt
print(sqrt(x*(12800000+x)))

"""Growth Record"""
n,m,x,t,d=map(int,input().split())
if n <= x:
    s = t - n*d
else:
    s = t - x*d

if m <= x:
    print(s + m*d)
else:
    print(s + x*d)

# 整理が足りない。
# n,m,x,t,d=map(int,input().split())
# if x<=m:
#     print(t)
# else:
#     print(m*d)


"""Takahashi Calender"""

M,D=map(int,input().split())
ans = 0
# 入力dとループない変数dの競合
for month in range(1,M+1):
    for day in range(1,D+1):
        d = str(day)
        if len(d) < 2: continue
        d1 = int(d[-1])
        d10 = int(d[-2])
        if d1 >= 2 and d10 >= 2 and d1*d10 == month:
            ans += 1
print(ans)

"""Tenki"""
s=input()
t=input()
print(sum([s[i]==t[i]for i in range(3)]))

"""Matrix Transposition"""
h,w=map(int,input().split())
# b=list(zip(*[list(map(int,input().split()))for _ in range(h)]))
# まとめて書くと上だが、
a = [list(map(int,input().split()))for _ in range(h)]
b = list(zip(*a))
# こちらの方が見やすい
for i in range(w):
    for j in range(h):
        print(b[i][j],end=" ")
    print()

"""ASCII code"""
n = int(input())
n -= 97

abc = 'abcdefghijklmnopqrstuvwxyz'
print(abc[n])

"""Feeris Wheel"""
a,b=map(int,input().split())
if a >= 13:
    print(b)
elif 6 <= a <= 12:
    print(b//2)
else:
    print(0)

"""Vanishing Pitch"""
v,t,s,d=map(int,input().split())
# ❌ サンプルを見てない
# if t<=d<=s:
if v*t<=d<=v*s:
    exit(print('No'))
print('Yes')

"""ABC Preparation"""
a=list(map(int,input().split()))
m = min(a)
print(m)

"""Step"""
# たして前の人に合わせる
n = int(input())
a = list(map(int,input().split()))
cost = 0
for i in range(1,n):
    if a[i-1] >= a[i]:
        cost += a[i-1] - a[i]
        a[i] = a[i-1]
print(cost)

"""abc of ABC"""
s = input()
flg = 0
for c in s:
    if c == "a": flg |= 1
    if c == "b": flg |= 2
    if c == "c": flg |= 4
if flg == (1<<3)-1:
    exit(print('Yes'))
print('No')


# AC済み
# s=list(input())
# s.sort()
# s = "".join(s)
# # print(s) # ❌debug print 消し忘れ
# if s=="abc":
#     exit(print('Yes'))
# print('No')


"""Grid Repainting"""
h,w=map(int,input().split())
s = [list(input())for _ in range(h)]
for i in range(h):
    for j in range(w):
        if s[i][j]==".":
            for c in range(1,5+1):
                c = str(c)
                for dx,dy in zip(*[[0,0,-1,1],[1,-1,0,0]]):
                    if not (0<=i+dx<h and 0<=j+dy<w): continue
                    
                    if s[i+dx][j+dy]==c:
                        break
                else:
                    s[i][j]=c
                    # breakはどちらでもいいが、
                    break # breakがないと一度見つかっても他の探し続ける（枝刈り-100ms)
for i in range(h):
    for j in range(w):
        print(s[i][j],end="")
    print()

"""Two Coins"""
a,b,c=map(int,input().split())
p = a+b>c # ax+by=cの解を求めてWAを20分くらいやっていた
print('Yes'if p else'No')

"""和風いろはちゃんイージー"""
a=list(map(int,input().split()))
a.sort()
if a==[5,5,7]:
    exit(print('YES')) # ❌Yes
print('NO')
# あるいは
# a=list(map(int,input().split()))
# f,s=0,0
# n = len(a)
# for i in range(n):
#     if a[i]==5: f+=1
#     if a[i]==7: s+=1
# if s==1 and f==2:
#     print('YES')
# else:
#     print('NO')

"""Payment"""
n = int(input())
pay = 0
while pay < n:
    pay += 1000

print(pay - n)

# ans = (10000 - N) % 1000という方法もあるらしいがわかっていない

"""Sum of Two Integers"""
n = int(input())
ans = 0
for i in range(1,n):
    x = i
    y = n - i
    if x != y:
        ans += 1
ans //= 2
print(ans)

# 偶奇で場合わけもできるが考えるよりこっちの方が脳みそを使わない

"""ringring"""

a = list(map(int,input().split()))
n = len(a)
ans = 10**18 + 1
for i in range(n):
    for j in range(i+1,n):
        ans = min(ans, a[i]+a[j])
print(ans)
```

## 反省 

* 間違えリスト
  * ❌を列挙する

- ❌綺麗に解こうとしない
- ❌誤読（iが昇順に決まっていく・よくあるパターン）
- ❌スライスに夢中でとんでもないことをした
- s.replace("na","nya")❌
- ❌ デバッグプリントの残し→Test&Submitで防げる
- ❌焦りすぎ
- ❌ 騒音などうるさい環境だと集中力が落ちる
- ❌一回引く≠あまり
- ❌引きすぎる(while文)
- ❌ 作戦・計画を言語化できていない状態で実装して沼
- ❌処理がパンクしてソートするのを忘れた
- ❌最適でない組み合わせ(最適解が得られない方針ミス)
- ❌場合分けをテキトーに考えて間違える
- ❌.split()は戻り値がリスト(知らなかった)
- o += 15 - o # ❌ o += 15 - x
- `r,c=map(lambda x:int(x)-1,input().split())`
- ❌ s=[input()for _ in range(2)]
- ❌: 実装が遅い()
- ❌ nC2だからrange(i+1,n)
- ❌焦りすぎ
- ❌ここの処理が複雑になり頭がパンクしてテキトーになった
- ❌ x%100==0 つけ忘れてWA
- ❌「100 円硬貨が 1 枚以上入っており、それ以外には何も入っていません。」=「100円玉しか入っておらず、それが1枚以上です。」
- ❌ >= 8 とか論理記号で悩んだ(`or, and`)
- ❌ans = max(ans, cnt)
- ❌ s=[input()for _ in range(2)]
- `s = [list(input())for _ in range(2)]`
- ❌複数の変数代入を一気にやろうとして間違えた
- ❌x1,x2,y1,y2 = p[i][0],p[i][1],p[j][0],p[j][1] 
- ❌ケアレスミス C の存在を忘れて内積にしている
- ❌コーナー、idxのマジックナンバー、コードぐっちゃぐちゃ(スライス多用しすぎ)
- ❌それっぽい見た目をしているので間違えた
    - `if cnt[a[i]] == 0: `
- ⭕️hiが繋がってできる = hiの連接のみの文字列
- ❌hiが含まれている(誤読)
- ❌s[st+i] それっぽい見た目をしているがだめ
        `if s[i] != t[st+i]:`⭕️
- ❌面倒臭い & 誤読方針
- ❌ 連続と不連続で場合わけしない。（不要な冗長な場合わけ）
- ⭕️誘導に乗っかる
- ❌ return 入れ忘れ
- if l == ["A","B","C"]: # ❌いきあたりばったり。8通りに気づく
- ❌ 焦ってはいけない、ではなく、焦っていると碌なことをやらない
- ❌沼 条件を整理する。
- ❌ サンプルを見てない
- ❌debug print 消し忘れ
- exit(print('YES')) # ❌Yes