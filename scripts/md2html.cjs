const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItPrism = require('markdown-it-prism');
require('prismjs');
require('prismjs/components/prism-c');
require('prismjs/components/prism-cpp');
require('prismjs/components/prism-python');
require('prismjs/components/prism-javascript');
// require('prismjs/plugins/line-numbers/prism-line-numbers');

function markdownItProtectMath(md) {
  md.inline.ruler.before('emphasis', 'math_protect', function(state, silent) {
    const start = state.pos;
    if (state.src[start] !== '$') return false;
    let match = state.src.slice(start).match(/^\${2}([\s\S]+?)\${2}/);
    if (!match) return false;
    if (!silent) {
      const token = state.push('math_block', '', 0);
      token.content = match[1];
    }
    state.pos += match[0].length;
    return true;
  });

  md.renderer.rules.math_block = function(tokens, idx) {
    return `<div>$$${tokens[idx].content}$$</div>`;
  };
}

// MarkdownItインスタンス生成
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(markdownItProtectMath)
  .use(markdownItPrism, {
    // plugins: ['line-numbers'],
    // preAttributes: { class: 'line-numbers' }
  });

const notesDir = path.join(__dirname, '../notes');
const distDir = path.join(__dirname, '../dist');
const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.md'));



function getTags(src) {
  const tagMatch = src.match(/tags:\s*\[([^\]]+)\]/);
  if (!tagMatch) return [];
  // カンマ区切り形式: tags: [tag1, tag2, tag3]
  let arr = tagMatch[1].replace(/\\,/g, '<<COMMA>>').split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
  // 置換を元に戻す
  arr = arr.map(s => s.replace(/<<COMMA>>/g, ','));
  return arr;
}

const notesInfo = files.map(f => {
  const src = fs.readFileSync(path.join(notesDir, f), 'utf8');
  // 最初の # 見出しをタイトルに
  const match = src.match(/^#\s*(.+)/m);
  const title = match ? match[1].trim() : f.replace('.md', '');
  const tags = getTags(src);
  return { file: f, title, tags };
});

const tagMap = {};
notesInfo.forEach(note => {
  if (note.tags.length === 0) {
    if (!tagMap['タグなし']) tagMap['タグなし'] = [];
    tagMap['タグなし'].push(note);
  } else {
    note.tags.forEach(tag => {
      if (!tagMap[tag]) tagMap[tag] = [];
      tagMap[tag].push(note);
    });
  }
});


let linksByTag = '';
Object.keys(tagMap).forEach(tag => {
  linksByTag += `<h2 style="font-size:1em;opacity:0.7;">${tag}</h2>\n<ul>\n`;
  linksByTag += tagMap[tag].map(note =>
    `<li><a href="${note.file.replace('.md', '.html')}">${note.title}</a></li>`
  ).join('\n');
  linksByTag += `\n</ul>\n`;
});


const notesHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ノート一覧</title>
  <style>
    body { font-family: 'Inter', 'Noto Sans JP', Arial, sans-serif; background: #f7f8fa; color: #222; }
    .note-list { max-width: 600px; margin: 2em auto; background: #fff; padding: 2em; border-radius: 12px; box-shadow: 0 4px 24px #0001; }
    h1 { color: #2b6cb0; }
    h2 { color: #3182ce; margin-top: 2em; }
    ul { padding-left: 1.2em; }
    a { color: #3182ce; text-decoration: underline; transition: color 0.2s; }
    a:hover { color: #2c5282; }

    .note-tags {
      margin-bottom: 0.5em;
      font-size: 0.78em;
      opacity: 0.6;
      text-align: left;
    }
    .note-tags .tag {
      background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%);
      color: #fff;
      border-radius: 6px;
      padding: 0.15em 0.7em;
      margin-right: 0.3em;
      font-size: 0.78em;
      display: inline-block;
      vertical-align: middle;
      box-shadow: 0 2px 8px #2193b022;
      letter-spacing: 0.03em;
      border: none;
    }
    .note-tags-hr {
      border: none;
      border-top: 1px solid #bcd;
      margin: 0.7em 0 1.2em 0;
    }

    #backToNotesBtn {
      position: fixed;
      top: 1.2em;
      left: 1.2em;
      z-index: 1000;
      padding: 0.6em 1.2em;
      border-radius: 32px;
      background: #7ed957; /* 黄緑色 */
      color: #fff;
      font-size: 1em;
      font-weight: 500;
      border: none;
      box-shadow: 0 2px 8px #2193b022;
      cursor: pointer;
      opacity: 0.92;
      transition: opacity 0.2s, background 0.2s;
      text-decoration: none;
      display: inline-block;
    }
    #backToNotesBtn:hover {
      opacity: 1;
      background: #5bbf2b; /* 濃い黄緑色 */
    }

    #scrollTopBtn {
      /* インラインで青色指定されていても、CSSで色とホバーを上書き */
      background: #3182ce !important; /* 青色 */
      color: #fff;
      text-decoration: none;
      box-shadow: 0 2px 8px #0002;
      font-size: 1.1em;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s, background 0.2s;
      display: inline-block;
      position: fixed;
      right: 2.2em;
      bottom: 2.2em;
      z-index: 999;
      padding: 0.7em 1.2em;
      border-radius: 50px;
    }
    #scrollTopBtn:hover {
      opacity: 1;
      background: #205493 !important; /* 濃い青色 */
    }

    @media (max-width: 600px) {
      .katex, .katex-display {
        font-size: 1.3em !important;
      }
    }
  </style>
</head>
<body>
  <div class="note-list">
    <div class="note-warning" style="background:#fffbe6;color:#b7791f;padding:1em 1.2em;border-radius:8px;margin-bottom:1.5em;font-size:0.98em;">
      ※スマートフォン表示では一部レイアウト（コードの行番号や数式など）が崩れる場合があります。
    </div>
    <h1>ノート一覧</h1>
    ${linksByTag}
    <a href="/" style="display:block;margin-top:2em;">トップページへ戻る</a>
  </div>
</body>
</html>
`;

files.forEach(file => {
  const src = fs.readFileSync(path.join(notesDir, file), 'utf8');
  // タグ行・---行を除外して本文だけ抽出
  const body = src
    .split('\n')
    .filter(line => !/^tags:\s*\[.*\]/.test(line) && !/^---\s*$/.test(line))
    .join('\n');

  const match = body.match(/^#\s*(.+)/m);
  const title = match ? match[1].trim() : file.replace('.md', '');

  const tags = getTags(src);
  const tagsHtml = tags.length
    ? `<div class="note-tags"><span class="tag">${tags.join('</span><span class="tag">')}</span></div>`
    : '';
  const backLink = `<div style="margin-bottom:1em;"><a href="/notes.html">ノート一覧に戻る</a></div>`;

//   const rendered = md.render(body).replace(/<pre class="language-/g, '<pre class="line-numbers language-');
  const rendered = md.render(body);

  // const backLinkBtn = `<a id="backToNotesBtn" href="/notes.html">ノート一覧へ戻る</a>`;

  const html = `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-vsc-dark-plus.css">
    <!--<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-numbers/prism-line-numbers.min.css">-->
    <style>
        body {
        background: #f7f8fa;
        color: #222;
        font-family: 'Inter', 'Noto Sans JP', Arial, sans-serif;
        margin: 0;
        padding: 0;
        }
        .note {
        max-width: 800px;
        margin: 2em auto;
        background: #fff;
        padding: 2em 2.5em;
        border-radius: 12px;
        box-shadow: 0 4px 24px #0001;
        }
        h1, h2, h3 {
        color: #2b6cb0;
        margin-top: 1.5em;
        }
        a { color: #3182ce; text-decoration: underline; transition: color 0.2s; }
        a:hover { color: #2c5282; }

        /* コード用 */
        pre[class*="language-"] {
        border-radius: 6px;
        margin: 1.5em 0;
        }
        pre {
          position: relative;
          max-height: 38em; /* 1行1.28em×30行=38em程度で調整 */
          overflow-y: auto;
          padding-top: 2.2em; /* ボタン分の余白 */
        }
        code[class*="language-"], pre[class*="language-"] {
        font-family: 'Cascadia Mono', 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;
        font-size: 94%;
        }
        <!--pre.line-numbers > code {
            padding-top: 0.1em; /* お好みで調整 */
            position: relative;
        }-->
        code:not([class*="language-"]) {
          background: #f5f2f0;
          color: #c7254e;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.95em;
          font-family: 'Cascadia Mono', 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;
        }

        /* 行番号 */
        /*
        .line-numbers .line-numbers-rows { border-right: 1px solid #ddd; }
        .line-numbers .line-numbers-rows > span {
          padding-top: 0.2em;
          padding-bottom: 0.1065em;
        }*/

        /*.line-numbers-rows > span:before { color: #999; }*/
        
        /* KaTeX 改善版 */
        /*.katex {
        font-size: 1.1em;
        }*/
        
        /* ディスプレイ数式の修正 */
        .katex-display {
        display: block !important;
        margin: 1.5em 0 !important;
        text-align: center !important;
        overflow-x: auto;
        overflow-y: hidden;
        }
        
        /* 段落内のディスプレイ数式も確実にブロック表示 */
        p .katex-display {
        display: block !important;
        margin: 1.5em 0 !important;
        }
        
        /* インライン数式 */
        .katex:not(.katex-display) {
        display: inline-block;
        margin-left: 0.1em;
        margin-right: 0.1em;
        }

        hr { border: none; border-top: 1px solid #e2e8f0; margin: 2em 0; }
        ul { padding-left: 1.2em; }

  /* コードブロックが50行以上の場合スクロール（preに直接適用） */

        aside {
          display: block;
          background: #f0f8ff;
          padding: 1em 1.2em;
          margin: 1.5em 0;
          border-radius: 12px;
          color: #222;
        }

        #backToNotesBtn {
          position: fixed;
          top: 1.2em;
          left: 1.2em;
          z-index: 1000;
          padding: 0.6em 1.2em;
          border-radius: 32px;
          background: #7ed957; /* 黄緑色 */
          color: #fff;
          font-size: 1em;
          font-weight: 500;
          border: none;
          box-shadow: 0 2px 8px #2193b022;
          cursor: pointer;
          opacity: 0.92;
          transition: opacity 0.2s, background 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        #backToNotesBtn:hover {
          opacity: 1;
          background: #5bbf2b; /* 濃い黄緑色 */
        }

        #scrollTopBtn {
          /* インラインで青色指定されていても、CSSで色とホバーを上書き */
          background: #3182ce !important; /* 青色 */
          color: #fff;
          text-decoration: none;
          box-shadow: 0 2px 8px #0002;
          font-size: 1.1em;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s, background 0.2s;
          display: inline-block;
          position: fixed;
          right: 2.2em;
          bottom: 2.2em;
          z-index: 999;
          padding: 0.7em 1.2em;
          border-radius: 50px;
        }
        #scrollTopBtn:hover {
          opacity: 1;
          background: #205493 !important; /* 濃い青色 */
        }

        @media (max-width: 600px) {
          .katex, .katex-display {
            font-size: 1.15em !important;
          }
        }
    </style>
  </head>
  <body>
    <!-- <div id="scrollTopBtn">
  ↑ トップへ戻る
</div> -->
<script>
  document.getElementById('scrollTopBtn').onclick = function() {
    window.scrollTo({top:0,behavior:'smooth'});
    return false;
  };
</script>
  
  <div class="note">
    ${rendered}
    ${backLink}
  </div>

    <!-- Prism.js & 言語 & line-numbers -->
    <style>
      pre {
        position: relative;
      }
      .copy-btn {
        position: absolute;
        top: 0.18em;
        right: 0.18em;
        background: #222;
        color: #fff;
        border: 1.5px solid #888;
        border-radius: 5px;
        padding: 0.13em 0.6em;
        font-size: 0.92em;
        cursor: pointer;
        opacity: 0.85;
        z-index: 10;
        transition: opacity 0.2s, background 0.2s, border 0.2s;
        box-shadow: 0 2px 6px #0002;
      }
      .copy-btn:hover {
        opacity: 1;
        background: #000;
        border-color: #222;
        box-shadow: 0 2px 8px #0004;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-python.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-javascript.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-c.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-cpp.min.js"></script>
    <!--<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-numbers/prism-line-numbers.min.js"></script>-->
    <script>
      Prism.highlightAll();
      // コードブロックにコピーボタン追加
      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('pre > code').forEach(function(codeBlock) {
          var pre = codeBlock.parentElement;
          if (pre.querySelector('.copy-btn')) return;
          var btn = document.createElement('button');
          btn.className = 'copy-btn';
          btn.textContent = 'copy';
          btn.onclick = function() {
            navigator.clipboard.writeText(codeBlock.textContent);
            btn.textContent = 'copied!';
            setTimeout(function(){ btn.textContent = 'copy'; }, 1200);
          };
          pre.appendChild(btn);
        });
      });
    </script>
    <!-- KaTeX本体とauto-render拡張 -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js" integrity="sha384-cMkvdD8LoxVzGF/RPUKAcvmm49FQ0oxwDF3BGKtDXcEc+T1b2N+teh/OJfpU0jr6" crossorigin="anonymous"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js" integrity="sha384-hCXGrW6PitJEwbkoStFjeJxv+fSOOQKOPbJxSfM6G5sWZjAyWhXiTIIAmQqnlLlh" crossorigin="anonymous"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
        renderMathInElement(document.body, {
            delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false},
            ],
            throwOnError: false
        });
        });
    </script>
  </body>
  </html>
    `;
  fs.writeFileSync(path.join(distDir, file.replace('.md', '.html')), html);
});



// const links = files.map(f => {
//   const src = fs.readFileSync(path.join(notesDir, f), 'utf8');
//   const firstLine = src.split('\n')[0];
//   const match = firstLine.match(/^#\s*(.+)/);
//   const title = match ? match[1] : f.replace('.md', '');
//   return `<li><a href="${f.replace('.md', '.html')}" rel="noopener noreferrer">${title}</a></li>`;
// }).join('\n');

fs.writeFileSync(path.join(distDir, 'notes.html'), notesHtml);





