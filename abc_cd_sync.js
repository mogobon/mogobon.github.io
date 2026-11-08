/* ABC C/D GitHub summaries sync. Notes and review history remain device-local. */
(() => {
'use strict';
const OWNER='mogobon', REPO='mogobon.github.io';
const ENDPOINT='https://api.github.com/repos/'+OWNER+'/'+REPO+'/contents/public/abc_cd_overrides.json';
const KEY='abc-cd-summary-drafts-v1', TOKEN_KEY='abc-cd-sync-token-session-v1';
const byId=x=>document.getElementById(x);
const initial=new Map(data.map(x=>[x.id,x.summary]));
const allowed=new Set(initial.keys());
let remote={version:1,summaries:{}},token='',dirty={},loaded=false,saving=false,editing=false;
let timer=null,conflict=null,error='',lastId='',revision=0;
function escapeText(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function formatSummary(it){
 const value=dirty[it.id]?.text ?? remote.summaries[it.id];
 return value===undefined?initial.get(it.id):'<p>'+escapeText(value)+'</p>';
}
function applySummaries(){for(const it of data)it.summary=formatSummary(it)}
function loadLocal(){
 try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');
 for(const [k,d] of Object.entries(v))if(allowed.has(k)&&typeof d?.text==='string'&&typeof d.base==='string')dirty[k]=d;
 }catch(e){console.warn('Draft read failed',e)}
}
function saveLocal(){
 try{localStorage.setItem(KEY,JSON.stringify(dirty))}catch(e){error='端末への保存に失敗';console.error(e)}
}
function count(){return Object.keys(dirty).length}
function status(){
 let message='GitHubデータを読み込み中…',kind='neutral';
 if(conflict){message='別端末との編集競合があります';kind='warn'}
 else if(error){message='同期エラー：'+error;kind='warn'}
 else if(saving){message='GitHubへ保存中…';kind='pending'}
 else if(count()&&!token){message='端末に保存済み・GitHub未同期';kind='warn'}
 else if(count()){message='自動保存待ち（約8秒）';kind='pending'}
 else if(loaded){message=token?'GitHubと同期済み':'GitHubの公開データを表示中';kind='ok'}
 byId('sync-state').textContent=message;byId('sync-state').dataset.kind=kind;
 byId('sync-count').textContent=count()+'件未同期';
 byId('sync-now').disabled=!token||!count()||saving;
}
function createUI(){
 const style=document.createElement('style');
 style.textContent='.syncbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px;color:#64748b;font-size:.8rem}.syncbar button,.edit-summary{border:1px solid #cbd5e1;background:white;border-radius:9px;padding:7px 10px;color:#1d4ed8;font:inherit}.syncbar [data-kind=warn]{color:#b45309}.syncbar [data-kind=ok]{color:#059669}.syncbar [data-kind=pending]{color:#1d4ed8}.syncpanel{border:1px solid #e2e8f0;background:white;border-radius:12px;padding:15px;margin:12px 0;font-size:.87rem;line-height:1.65}.syncpanel h2{font-size:1rem;margin:0}.syncpanel input[type=password]{width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font-size:1rem}.syncpanel .actions{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.syncpanel button{padding:8px 10px;border:1px solid #cbd5e1;border-radius:9px;background:white;font:inherit}.syncpanel .primary{background:#2563eb;color:white;border-color:#2563eb}.syncpanel .fine{font-size:.78rem;color:#64748b}.editorbar{display:flex;justify-content:flex-end;margin:-10px 0 12px}.edit-summary{font-size:.83rem}#sync-editor{display:none;width:100%;min-height:23svh;border:1px solid #93c5fd;border-radius:10px;padding:12px;font-size:1rem;line-height:1.7}#sync-editor.active{display:block}#sync-conflict{border:1px solid #f59e0b;background:#fffbeb;padding:12px;border-radius:10px;margin-top:10px}#sync-conflict[hidden]{display:none}';
 document.head.append(style);
 const bar=document.createElement('div');bar.className='syncbar';
 bar.innerHTML='<span id="sync-state" aria-live="polite"></span><span id="sync-count"></span><button type="button" id="sync-open">GitHub同期を設定</button><button type="button" id="sync-now">今すぐ同期</button>';
 document.querySelector('.topinner').append(bar);
 const p=document.createElement('div');p.className='syncpanel';p.id='sync-panel';p.hidden=true;
 p.innerHTML=[
 '<h2>GitHub同期（要約は公開）</h2>',
 '<p>要約を編集すると、入力停止後に自動でGitHubへ保存します。別端末でもページを開けば取得できます。</p>',
 '<p><a href="https://github.com/settings/personal-access-tokens" target="_blank" rel="noopener noreferrer">既存PATの設定を確認</a>：<b>Resource owner = mogobon</b>／<b>Repository access = Only select repositories → mogobon.github.io</b>／<b>Repository permissions → Contents = Read and write</b>。トークンが期限切れなら新規作成してください。設定変更後は下の欄から再接続します。</p>',
 '<label for="sync-token">GitHubトークン（チャットには貼らない）</label>',
 '<input id="sync-token" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_...">',
 '<label><input id="sync-remember" type="checkbox"> このタブのセッション中は接続を保持</label>',
 '<div class="actions"><button type="button" class="primary" id="sync-connect">接続する</button><button type="button" id="sync-disconnect">接続解除</button><button type="button" id="sync-refresh">再取得</button></div>',
 '<section id="sync-conflict" hidden><b id="sync-conflict-title"></b><p>同じ問題を別端末でも編集したため、自動上書きを停止しました。</p><button type="button" id="sync-use-local">自分の変更を採用</button><button type="button" id="sync-use-remote">GitHub側を採用</button></section>',
 '<p class="fine">403でも未同期の要約はこのSafariに残ります。Safariのサイトデータを削除しないでください。トークンをチャットに貼らないでください。要約は公開されますが、考察メモ・理解度は公開しません。トークンは通常メモリだけに保持します。</p>'
 ].join('');
 document.querySelector('.topinner').append(p);
 const front=byId('front'),summary=byId('summary');
 const bar2=document.createElement('div');bar2.className='editorbar';
 bar2.innerHTML='<button type="button" class="edit-summary" id="sync-edit">要約を編集 ✎</button>';
 summary.before(bar2);
 const editor=document.createElement('textarea');editor.id='sync-editor';editor.setAttribute('aria-label','問題の要約');summary.after(editor);
 for(const el of [bar2,editor]){
   el.addEventListener('click',e=>e.stopPropagation());
   el.addEventListener('keydown',e=>e.stopPropagation());
 }
 byId('sync-open').onclick=()=>{p.hidden=!p.hidden};
 byId('sync-now').onclick=()=>upload();
 byId('sync-connect').onclick=connect;
 byId('sync-disconnect').onclick=disconnect;
 byId('sync-refresh').onclick=()=>refresh(true);
 byId('sync-use-local').onclick=()=>resolve(true);
 byId('sync-use-remote').onclick=()=>resolve(false);
 byId('sync-edit').onclick=e=>{e.stopPropagation();toggleEdit(!editing)};
 editor.oninput=onEdit;
 editor.onblur=()=>{if(token && count() && !conflict)queue(1200)};
}
function item(){return options()[index]}
function currentText(it){
 return dirty[it.id]?.text ?? remote.summaries[it.id] ?? decode(initial.get(it.id));
}
function toggleEdit(value){
 const it=item();if(!it)return;
 editing=value;
 byId('sync-editor').classList.toggle('active',editing);
 byId('summary').hidden=editing;
 byId('sync-edit').textContent=editing?'編集を閉じる':'要約を編集 ✎';
 if(editing){byId('sync-editor').value=currentText(it);byId('sync-editor').focus()}
}
function repaint(){
 const it=item();if(!it)return;
 if(lastId && lastId!==it.id && editing)toggleEdit(false);
 lastId=it.id;
 if(!editing)byId('sync-editor').value=currentText(it);
 byId('summary').textContent=format('<p>'+escapeText(currentText(it))+'</p>');
 if(window.typesetSummary)window.typesetSummary();
}
function onEdit(){
 const it=item();if(!it)return;
 const previous=dirty[it.id],base=previous?.base ?? (remote.summaries[it.id]??'');
 dirty[it.id]={text:byId('sync-editor').value,base,stamp:Date.now()};
 revision++;error='';saveLocal();applySummaries();status();
 if(token && !conflict)queue(8000);
}
function queue(ms){clearTimeout(timer);timer=setTimeout(()=>upload(),ms);status()}
function decodeBase64(encoded){
 return new TextDecoder().decode(Uint8Array.from(atob(encoded.replace(/\s/g,'')),c=>c.charCodeAt(0)));
}
function encodeBase64(text){
 const arr=new TextEncoder().encode(text);let out='';
 for(let i=0;i<arr.length;i+=8192)out+=String.fromCharCode(...arr.subarray(i,i+8192));
 return btoa(out);
}
async function getRemote(auth){
 const headers={'Accept':'application/vnd.github+json'};
 if(auth && token)headers.Authorization='Bearer '+token;
 const res=await fetch(ENDPOINT+'?nocache='+Date.now(),{headers,cache:'no-store'});
 if(!res.ok){
   if(res.status===403)throw new Error('GitHub HTTP 403：トークンのResource owner・対象リポジトリ・Contents権限を確認してください');
   throw new Error('GitHub HTTP '+res.status);
 }
 const body=await res.json(),doc=JSON.parse(decodeBase64(body.content));
 if(doc.version!==1||!doc.summaries||Array.isArray(doc.summaries)||typeof doc.summaries!=='object')throw new Error('同期ファイル形式エラー');
 for(const [k,v] of Object.entries(doc.summaries))if(!allowed.has(k)||typeof v!=='string')throw new Error('同期データの検証エラー');
 return {sha:body.sha,doc};
}
async function refresh(notify){
 try{
 const r=await getRemote(!!token);remote=r.doc;loaded=true;error='';
 for(const [key,d] of Object.entries(dirty))if(d.text===(remote.summaries[key]??''))delete dirty[key];
 saveLocal();applySummaries();originalDraw();repaint();status();
 if(token&&count()&&!conflict)queue(1500);
 }catch(e){if(notify||!loaded){error=e.message||String(e);status()}}
}
async function connect(){
 const entered=byId('sync-token').value.trim();
 if(!entered){error='トークンが未入力です';status();return}
 token=entered;byId('sync-token').value='';
 try{
 const r=await getRemote(true);remote=r.doc;loaded=true;error='';
 if(byId('sync-remember').checked)sessionStorage.setItem(TOKEN_KEY,token);
 else sessionStorage.removeItem(TOKEN_KEY);
 applySummaries();originalDraw();repaint();status();
 byId('sync-panel').hidden=true;
 if(count())queue(1500);
 }catch(e){token='';sessionStorage.removeItem(TOKEN_KEY);error='接続失敗：'+(e.message||e);status()}
}
function disconnect(){
 token='';clearTimeout(timer);sessionStorage.removeItem(TOKEN_KEY);
 byId('sync-remember').checked=false;status();
}
async function upload(force){
 clearTimeout(timer);if(!token||saving||!count()||conflict&&!force){status();return}
 saving=true;error='';status();
 const snapshot=Object.fromEntries(Object.entries(dirty).map(([k,v])=>[k,{...v}]));
 const oldRevision=revision;
 try{
 let completed=false;
 for(let n=0;n<3;n++){
   const r=await getRemote(true);
   const next={version:1,summaries:{...r.doc.summaries}};
   conflict=null;
   for(const [key,d] of Object.entries(snapshot)){
     const other=r.doc.summaries[key]??'';
     if(!force&&other!==d.base&&other!==d.text){
       conflict={key,theirs:other};
       byId('sync-conflict-title').textContent='競合：'+key.toUpperCase();
       byId('sync-conflict').hidden=false;byId('sync-panel').hidden=false;
       break;
     }
     next.summaries[key]=d.text;
   }
   if(conflict)break;
   const result=await fetch(ENDPOINT,{
     method:'PUT',
     headers:{'Accept':'application/vnd.github+json','Content-Type':'application/json','Authorization':'Bearer '+token},
     body:JSON.stringify({message:'Update ABC C/D card summaries',content:encodeBase64(JSON.stringify(next,null,2)+'\n'),sha:r.sha,branch:'main'})
   });
   if(result.status===409)continue;
   if(!result.ok){
     const detail=await result.json().catch(()=>({}));
     if(result.status===403)throw new Error('GitHub HTTP 403：トークンの書き込み権限を確認してください（Contents: Read and write）');
     throw new Error('GitHub HTTP '+result.status+' '+(detail.message||''));
   }
   remote=next;loaded=true;completed=true;
   for(const [k,d] of Object.entries(snapshot))if(dirty[k]?.stamp===d.stamp && dirty[k]?.text===d.text)delete dirty[k];
   saveLocal();applySummaries();originalDraw();repaint();
   break;
 }
 if(!completed && !conflict)throw new Error('競合が続いたため保存を保留しました');
 }catch(e){
   error=e.message||String(e);
   if(/GitHub HTTP 403/.test(error)){
     token='';
     sessionStorage.removeItem(TOKEN_KEY);
   }
 }
 finally{
   saving=false;status();
   if(!error&&!conflict&&count()&&revision!==oldRevision&&token)queue(8000);
 }
}
function resolve(useLocal){
 if(!conflict)return;
 const c=conflict;conflict=null;byId('sync-conflict').hidden=true;
 if(useLocal){if(dirty[c.key])dirty[c.key].base=c.theirs;saveLocal();upload(true)}
 else{
   delete dirty[c.key];remote.summaries[c.key]=c.theirs;
   saveLocal();applySummaries();originalDraw();repaint();status();
 }
}
loadLocal();createUI();
const originalDraw=draw;
draw=function(){originalDraw();repaint()};
applySummaries();draw();status();
try{
 const remembered=sessionStorage.getItem(TOKEN_KEY);
 if(remembered){token=remembered;byId('sync-remember').checked=true;refresh(true)}
 else refresh(false);
}catch(e){refresh(false)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!saving)refresh(false)});
window.addEventListener('online',()=>{refresh(false);if(token&&count())queue(1500)});
})();