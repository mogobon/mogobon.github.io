#!/usr/bin/env python3
"""ABC C/D 200問を低頻度で取得し、単一HTMLの復習ページを生成する。"""
import html, json, random, re, time
from pathlib import Path
import requests
from bs4 import BeautifulSoup

COUNT=100
LATEST=483
OUT=Path("public/abc_cd_200.html")
session=requests.Session()
session.headers.update({"User-Agent":"MogobonStudyDeck/1.0 (personal study; polite rate limiting)"})
cards=[]
for abc in range(LATEST,LATEST-COUNT,-1):
    for letter in ("c","d"):
        task=f"abc{abc}_{letter}"
        url=f"https://atcoder.jp/contests/abc{abc}/tasks/{task}?lang=ja"
        try:
            r=session.get(url,timeout=25)
            r.raise_for_status()
            soup=BeautifulSoup(r.text,"html.parser")
            title=soup.select_one("span.h2") or soup.select_one("title")
            statement=soup.select_one("#task-statement .lang-ja") or soup.select_one("#task-statement")
            if statement is None: raise ValueError("statement not found")
            for bad in statement.select("script,style"): bad.decompose()
            # AtCoderの数式はMathJaxでレンダリングする
            cards.append({"id":task,"url":url,"title":title.get_text(" ",strip=True) if title else task,
                          "body":str(statement)})
            print("OK",task,flush=True)
        except Exception as e:
            print("FAILED",task,str(e),flush=True)
            cards.append({"id":task,"url":url,"title":task,"body":"<p>問題文を取得できませんでした。再実行してください。</p>"})
        time.sleep(2.5+random.random()*1.5)
data=json.dumps(cards,ensure_ascii=False).replace("</","<\\/")
page=r'''<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ABC C・D 200問 | 通勤問題集</title>
<!-- tags: [問題集] -->
<style>
:root{font-family:system-ui,-apple-system,sans-serif;color:#172333;background:#f4f7fb}
*{box-sizing:border-box}body{margin:0}header{position:sticky;top:0;background:#ffffffed;backdrop-filter:blur(8px);padding:12px 16px;border-bottom:1px solid #dce3ed;z-index:5}
h1{font-size:1.15rem;margin:0 0 9px}main{max-width:820px;margin:auto;padding:12px}button,select,input,textarea{font:inherit}button,select{border:1px solid #cbd5e1;background:white;border-radius:9px;padding:7px 11px}
.controls{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.card{background:white;border:1px solid #dce3ed;border-radius:14px;margin:12px 0;padding:16px;overflow:hidden}
.card h2{font-size:1.05rem;margin:0 0 10px}.meta{font-size:.8rem;color:#64748b}.statement{font-size:.95rem;line-height:1.7;overflow-x:auto}
.statement img{max-width:100%}.statement pre{overflow-x:auto}.statement h3{font-size:1rem}.statement .part{margin:1em 0}
details{margin-top:12px;border-top:1px solid #eee;padding-top:10px}textarea{width:100%;min-height:95px;border:1px solid #cbd5e1;border-radius:8px;padding:10px}
footer{padding:20px;text-align:center;color:#64748b}a{color:#2563eb}.status{margin-top:12px} .hidden{display:none}
</style>
<script>window.MathJax={tex:{inlineMath:[['$','$'],['\\(','\\)']],displayMath:[['$$','$$'],['\\[','\\]']]},options:{skipHtmlTags:['script','noscript','style','textarea','pre','code']}};</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script></head>
<body><header><h1>ABC C・D 200問 — 通勤問題集</h1><div class="controls">
<select id="filter"><option value="all">C・Dすべて</option><option value="c">Cのみ</option><option value="d">Dのみ</option><option value="todo">未着手</option><option value="review">要復習</option></select>
<button id="expand">全問題文を表示</button><span id="count"></span></div></header>
<main id="cards"></main><footer>メモと進捗はこの端末のブラウザに保存されます。問題文の出典：AtCoder（各カードから原文へ移動可能）。</footer>
<script id="dataset" type="application/json">__DATA__</script>
<script>
const data=JSON.parse(document.getElementById('dataset').textContent);
const root=document.getElementById('cards');
const storeKey='abc-cd-200-v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch(e){}
function save(){localStorage.setItem(storeKey,JSON.stringify(saved))}
function render(){
 const f=document.getElementById('filter').value;root.replaceChildren();let n=0;
 for(const item of data){
  const s=saved[item.id]||{};
  if(f==='c'&&!item.id.endsWith('_c')||f==='d'&&!item.id.endsWith('_d')||f==='todo'&&s.status||f==='review'&&s.status!=='review')continue;
  n++;
  const card=document.createElement('article');card.className='card';
  const heading=document.createElement('h2');heading.textContent=item.title;card.append(heading);
  const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener';link.textContent='AtCoder原文';card.append(link);
  const details=document.createElement('details');details.open=true;
  const summary=document.createElement('summary');summary.textContent='問題文';details.append(summary);
  const body=document.createElement('div');body.className='statement';body.innerHTML=item.body;details.append(body);card.append(details);
  const status=document.createElement('select');status.className='status';
  [['','未着手'],['thinking','考察中'],['review','要復習'],['done','理解済み']].forEach(([v,label])=>{const o=document.createElement('option');o.value=v;o.textContent=label;status.append(o)});
  status.value=s.status||'';status.onchange=()=>{saved[item.id]={...saved[item.id],status:status.value};save()};card.append(status);
  const notes=document.createElement('details');const ns=document.createElement('summary');ns.textContent='考察・ポイント（自分で記入）';notes.append(ns);
  const ta=document.createElement('textarea');ta.placeholder='最初の着眼点／使った典型／変形した部分／WAの原因';ta.value=s.note||'';
  ta.oninput=()=>{saved[item.id]={...saved[item.id],note:ta.value};save()};notes.append(ta);card.append(notes);root.append(card);
 }
 document.getElementById('count').textContent=n+'問';
 if(window.MathJax?.typesetPromise) MathJax.typesetPromise([root]).catch(()=>{});
}
document.getElementById('filter').onchange=render;
document.getElementById('expand').onclick=()=>{const a=[...document.querySelectorAll('.card>details:first-of-type')];const open=a.some(x=>!x.open);a.forEach(x=>x.open=open)};
render();
</script></body></html>'''
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(page.replace("__DATA__",data),encoding="utf-8")
print("Generated",OUT,len(cards))
