const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const markdownItPrism = require('markdown-it-prism');
require('prismjs');
require('prismjs/components/prism-c');
require('prismjs/components/prism-cpp');
require('prismjs/components/prism-python');
require('prismjs/components/prism-javascript');
require('prismjs/plugins/line-numbers/prism-line-numbers');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(markdownItPrism, {
    plugins: ['line-numbers'],
    preAttributes: { class: 'line-numbers' }
  });

const notesDir = path.join(__dirname, '../notes');
const distDir = path.join(__dirname, '../dist');
const files = fs.readdirSync(notesDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const src = fs.readFileSync(path.join(notesDir, file), 'utf8');
  // 1行目の見出しをタイトルに
  const firstLine = src.split('\n')[0];
  const match = firstLine.match(/^#\s*(.+)/);
  const title = match ? match[1] : file.replace('.md', '');

  const rendered = md.render(src).replace(/<pre class="language-/g, '<pre class="line-numbers language-');

  const html = `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-vsc-dark-plus.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-numbers/prism-line-numbers.min.css">
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
        code[class*="language-"], pre[class*="language-"] {
        font-family: 'Cascadia Mono', 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;
        font-size: 94%;
        }
        pre.line-numbers > code {
            padding-top: 0.1em; /* お好みで調整 */
            position: relative;
        }
        code:not([class*="language-"]) {
          background: #f5f2f0;
          color: #c7254e;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.95em;
          font-family: 'Cascadia Mono', 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;
        }

        /* 行番号 */
        .line-numbers .line-numbers-rows { border-right: 1px solid #ddd; }
        .line-numbers .line-numbers-rows > span {
         /*padding-top: 0.2em;*/
          padding-bottom: 0.1065em;
        }
        
        .line-numbers-rows > span:before { color: #999; }
        
        /* KaTeX 改善版 */
        .katex {
        font-size: 1.1em;
        }
        
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

        /* コードブロックが25行以上の場合スクロール */
        pre.line-numbers {
          max-height: 32em; /* 1行1.28em×25行=32em程度で調整 */
          overflow-y: auto;
        }
    </style>
  </head>
  <body>
    <div id="scrollTopBtn" style="
  position: fixed;
  right: 2.2em;
  bottom: 2.2em;
  z-index: 999;
  padding: 0.7em 1.2em;
  border-radius: 50px;
  background: #3182ce;
  color: #fff;
  text-decoration: none;
  box-shadow: 0 2px 8px #0002;
  font-size: 1.1em;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
  ">
  ↑ トップへ戻る
</div>
<script>
  document.getElementById('scrollTopBtn').onclick = function() {
    window.scrollTo({top:0,behavior:'smooth'});
    return false;
  };
</script>
    <div class="note">
      ${rendered}
      <div style="margin-top:2em;">
        <a href="/notes.html">ノート一覧に戻る</a>
      </div>
    </div>

    <!-- Prism.js & 言語 & line-numbers -->
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-python.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-javascript.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-c.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-cpp.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
    <script>
        Prism.highlightAll();
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
            {left: "\\(", right: "\\)", display: false},
            {left: "\\[", right: "\\]", display: true}
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



const links = files.map(f => {
  const src = fs.readFileSync(path.join(notesDir, f), 'utf8');
  const firstLine = src.split('\n')[0];
  const match = firstLine.match(/^#\s*(.+)/);
  const title = match ? match[1] : f.replace('.md', '');
  return `<li><a href="${f.replace('.md', '.html')}" rel="noopener noreferrer">${title}</a></li>`;
}).join('\n');

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
    ul { padding-left: 1.2em; }
    a { color: #3182ce; text-decoration: underline; transition: color 0.2s; }
    a:hover { color: #2c5282; }
  </style>
</head>
<body>
  <div class="note-list">
    <h1>ノート一覧</h1>
    <ul>
      ${links}
    </ul>
    <a href="/" style="display:block;margin-top:2em;">トップページへ戻る</a>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'notes.html'), notesHtml);