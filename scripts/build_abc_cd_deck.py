#!/usr/bin/env python3
"""ABC C/D 200問を低頻度で取得し、単一HTMLの復習ページを生成する。"""
import html, json, random, re, time
from pathlib import Path
import requests
from bs4 import BeautifulSoup

COUNT=100
LATEST=483
OUT=Path("public/abc_cd_200.html")
def summarize(statement):
    """Create a compact review prompt; do not reproduce the full statement.

    This heuristic extraction is NOT a verified human-written summary.
    Complex requirements need confirmation on the official task page.
    """
    root = BeautifulSoup(str(statement), 'html.parser')
    section = next((x for x in root.select('section')
                    if (h := x.find('h3')) and '問題文' in h.get_text(' ', strip=True)), None)
    if section is None:
        raise ValueError('Japanese problem section missing')
    # Preserve TeX math boundaries when extracting the summaries.
    from bs4 import NavigableString
    for var in root.find_all("var"):
        var.replace_with(NavigableString(r"\(" + var.get_text(" ",strip=True) + r"\)"))
    def tidy(x):
        return re.sub(r'\s+', ' ', x).strip()
    def cut(x, maximum):
        x = tidy(x)
        if len(x) <= maximum:
            return x
        end = max(x.rfind('。', 0, maximum+1), x.rfind('．', 0, maximum+1))
        if end > maximum//2:
            return x[:end+1]
        return x[:maximum].rstrip(' 、，')+'…'
    paragraphs = [tidy(p.get_text(' ',strip=True)) for p in section.find_all('p')]
    paragraphs = [p for p in paragraphs if p]
    if not paragraphs:
        raise ValueError('No Japanese statement paragraphs found')
    first = paragraphs[0]
    goal = next((p for p in reversed(paragraphs)
                 if re.search('求め|答え|判定|出力|数え|最小|最大', p)), paragraphs[-1])
    middle = [p for p in paragraphs[1:-1] if p != goal]
    bits = [cut(first, 170)]
    if middle:
        bits.append(cut(middle[0], 115))
    if goal != first:
        bits.append('問：'+cut(goal, 190))
    bullets = [tidy(li.get_text(' ',strip=True)) for li in section.find_all('li')]
    bullets = [x for x in bullets if x]
    if bullets:
        bits.append('条件：'+cut(' / '.join(bullets[:2]),120))
    return ' '.join(bits)

session=requests.Session()
session.headers.update({"User-Agent":"MogobonStudyDeck/1.0 (personal study; polite rate limiting)"})
cards=[]
failures=[]
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
                          "body":"<p>"+html.escape(summarize(statement))+"</p>"})
            print("OK",task,flush=True)
        except Exception as e:
            print("FAILED",task,str(e),flush=True)
            failures.append(task)
            cards.append({"id":task,"url":url,"title":task,"body":"<p>問題文を取得できませんでした。再実行してください。</p>"})
        time.sleep(2.5+random.random()*1.5)
if failures:
    raise SystemExit(f"Aborting: {len(failures)} task(s) failed: {failures}")
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
<button id="expand">要点を開閉</button><span id="count"></span></div></header>
<p style="max-width:820px;margin:12px auto;padding:0 18px;color:#64748b;font-size:.85rem">問題は自動抽出した短縮版です。複雑な条件は公式原文も確認してください。解法の着眼点は「考察・ポイント」に自分で記録できます。</p><main id="cards"></main><footer>自動短縮版のため条件の欠落があり得ます。厳密な確認はAtCoder原文で。メモと進捗はこの端末に保存されます。</footer>
<script id="dataset" type="application/json">__DATA__</script>
<script>
const data=JSON.parse(document.getElementById('dataset').textContent);
const root=document.getElementById('cards');

/* bs4.get_text() in earlier imports removed the <var> boundaries.
   Restore inline math for the already-summarized 200 cards without re-scraping. */
function mathify(markup) {
  const temp=document.createElement('div');temp.innerHTML=markup;
  return (temp.textContent||'').split(/([^\x00-\x7F]+)/).map(s=>{
    if (s.includes('\\\\(') || s.includes('\\\\[')) return s;
    if (!/(\\[a-zA-Z]+|[A-Za-z0-9]\s*_\s*(?:\{|[A-Za-z0-9])|[A-Za-z0-9]\s*\^\s*(?:\{|[A-Za-z0-9]))/.test(s)) return s;
    const lead=(s.match(/^\s*/)||[''])[0];
    const trail=(s.match(/\s*$/)||[''])[0];
    return lead+'\\('+s.trim()+'\\)'+trail;
  }).join('');
}

const storeKey='abc-cd-200-v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch(e){}
function save(){localStorage.setItem(storeKey,JSON.stringify(saved))}
function render(){
 const f=document.getElementById('filter').value;if(window.MathJax?.typesetClear) MathJax.typesetClear([root]);root.replaceChildren();let n=0;
 for(const item of data){
  const s=saved[item.id]||{};
  if(f==='c'&&!item.id.endsWith('_c')||f==='d'&&!item.id.endsWith('_d')||f==='todo'&&s.status||f==='review'&&s.status!=='review')continue;
  n++;
  const card=document.createElement('article');card.className='card';
  const heading=document.createElement('h2');heading.textContent=item.title;card.append(heading);
  const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener';link.textContent='AtCoder原文';card.append(link);
  const details=document.createElement('details');details.open=true;
  const summary=document.createElement('summary');summary.textContent='問題の要点（自動短縮版）';details.append(summary);
  const body=document.createElement('div');body.className='statement';body.textContent=mathify(item.body);details.append(body);card.append(details);
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
window.addEventListener('load',()=>{if(window.MathJax?.typesetPromise) MathJax.typesetPromise([root]).catch(console.error)});
document.getElementById('filter').onchange=render;
document.getElementById('expand').onclick=()=>{const a=[...document.querySelectorAll('.card>details:first-of-type')];const open=a.some(x=>!x.open);a.forEach(x=>x.open=open)};
render();
</script></body></html>'''
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(page.replace("__DATA__",data),encoding="utf-8")
print("Generated",OUT,len(cards))
