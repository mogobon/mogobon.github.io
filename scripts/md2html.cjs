const fs = require('fs');
const MarkdownIt = require('markdown-it');
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
//   breaks: true
})
  .use(require('markdown-it-prism'), {
    plugins: ['line-numbers'],
    preAttributes: { class: 'line-numbers' }
  });

const src = fs.readFileSync('kyopro-note.md', 'utf8');

const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>競プロノート</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" integrity="sha384-5TcZemv2l/9On385z///+d7MSYlvIEw9FuZTIdZ14vJLqWphw7e7ZPuOiCHJcFCP" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-vsc-dark-plus.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.css">
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
      font-size: 0.95em;
    }

    /* 行番号 */
    .line-numbers .line-numbers-rows { border-right: 1px solid #ddd; }
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
  </style>
</head>
<body>
  <div class="note">
    ${md.render(src)}
  </div>

  <!-- Prism.js & 言語 & line-numbers -->
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-python.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-javascript.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-c.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-cpp.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
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

fs.writeFileSync('dist/kyopro-note.html', html);
