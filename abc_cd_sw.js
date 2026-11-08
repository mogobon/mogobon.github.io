/* ABC C/D 200問 flashcards — offline app shell. No GitHub API response is cached. */
'use strict';
const VERSION='abc-cd-pwa-v1';
const CACHE='abc-cd-shell-'+VERSION;
const MATH_CACHE='abc-cd-math-'+VERSION;
const ASSETS=[
 '/abc_cd_cards.html',
 '/abc_cd_sync.js',
 '/abc_cd_200.html',
 '/abc_cd_manifest.webmanifest',
 '/icons/abc-cd-192.png',
 '/icons/abc-cd-512.png'
];
const MATHJAX='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';

self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
   const cache=await caches.open(CACHE);
   await cache.addAll(ASSETS);
   // MathJax is optional: offline questions must still load if its CDN is blocked.
   try{
     const request=new Request(MATHJAX,{mode:'no-cors'});
     const response=await fetch(request);
     await (await caches.open(MATH_CACHE)).put(request,response);
   }catch(e){console.warn('MathJax offline prefetch skipped',e)}
   await self.skipWaiting();
 })());
});

self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
   for(const key of await caches.keys()){
     if((key.startsWith('abc-cd-shell-')||key.startsWith('abc-cd-math-'))&&key!==CACHE&&key!==MATH_CACHE)
       await caches.delete(key);
   }
   await self.clients.claim();
 })());
});

self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 // GitHub's Contents API must always be fetched live to avoid overwriting remote edits.
 if(url.hostname==='api.github.com')return;
 if(url.origin===self.location.origin){
   if(url.pathname==='/abc_cd_overrides.json')return;
   if(!url.pathname.startsWith('/abc_cd_')&&!url.pathname.startsWith('/icons/abc-cd-'))return;
   event.respondWith((async()=>{
     const cache=await caches.open(CACHE);
     try{
       const response=await fetch(request);
       if(response.ok)await cache.put(url.pathname,response.clone());
       return response;
     }catch(e){
       const cached=await cache.match(url.pathname);
       if(cached)return cached;
       if(request.mode==='navigate'){
         const app=await cache.match('/abc_cd_cards.html');
         if(app)return app;
       }
       return Response.error();
     }
   })());
   return;
 }
 // Cache MathJax's dynamically fetched script/fonts after their first online use.
 if(url.hostname==='cdn.jsdelivr.net'&&url.pathname.includes('mathjax')){
   event.respondWith((async()=>{
     const cache=await caches.open(MATH_CACHE);
     const cached=await cache.match(request);
     if(cached)return cached;
     try{
       const response=await fetch(request);
       if(response.ok||response.type==='opaque')await cache.put(request,response.clone());
       return response;
     }catch(e){return Response.error()}
   })());
 }
});
