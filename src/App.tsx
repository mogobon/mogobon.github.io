export default App
// TreeNode型定義（再掲）
import { createSignal, onMount, onCleanup } from 'solid-js'
import timeline from './timeline.json';
import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

declare function particlesJS(id: string, options: unknown): void;

function App() {
  // rproj内のHTMLファイルをimport.meta.globで取得
  // rproj配下の全HTMLファイルを再帰的に取得
  const articleFiles = import.meta.glob('/public/rproj/**/*.html', { as: 'raw' });
  type Article = {
    title: string;
    path: string; // /rproj/xxx.html
  };
  const [tree, setTree] = createSignal<TreeNode[]>([]);

  // HTMLからメタデータ抽出
  function extractMeta(html: string): Omit<Article, 'path'> {
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    return {
      title: titleMatch ? titleMatch[1] : '',
    };
  }

  // 初回マウント時に記事一覧をセット
  onMount(async () => {
    const entries = Object.entries(articleFiles);
    const loaded: Article[] = await Promise.all(entries.map(async ([path, loader]) => {
      const html = await loader();
      const meta = extractMeta(html);
      // /public/rproj/以降のパスを取得
      const relPath = path.replace('/public/', '/');
      return { ...meta, path: relPath };
    }));
    setTree(buildTree(loaded));

    // ツリー構造を構築
  function buildTree(articles: Article[]): TreeNode[] {
    const root: TreeNode[] = [];
    for (const article of articles) {
      const parts = article.path.replace('/rproj/', '').split('/');
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let node = current.find(n => n.name === part);
        if (!node) {
          node = { name: part, children: [] };
          current.push(node);
        }
        if (i === parts.length - 1) {
          node.article = article;
        }
        current = node.children!;
      }
    }
    return root;
  }
  });
  // 時間帯に応じた挨拶を生成する関数
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'おはようございます！';
    } else if (hour >= 12 && hour < 18) {
      return 'こんにちは！';
    } else {
      return 'こんばんは！';
    }
  };

  // 現在の日本時間を取得するシグナル
  const [currentTime, setCurrentTime] = createSignal(new Date().toLocaleString('ja-JP', { 
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }));
  
  const [greeting] = createSignal(getGreeting());
  
  
  const [particlesInitialized, setParticlesInitialized] = createSignal(false);
  let particleInterval: number | null = null;
  let timeInterval: number | null = null;

  onMount(() => {
    // パーティクルの初期化
    const tryParticle = () => {
      if (
        typeof particlesJS === 'function' &&
        !particlesInitialized() &&
        (document.querySelector('#particles-js') as HTMLDivElement)?.clientWidth > 0
      ) {
        setParticlesInitialized(true);
        particlesJS('particles-js', {
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: '#48b0d5', // 水色
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 0.7,
              random: false,
            },
            size: {
              value: 3,
              random: true,
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#48b0d5', // 水色
              opacity: 0.5,
              width: 1,
            },
            move: {
              enable: true,
              speed: 3,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'repulse',
              },
              onclick: {
                enable: true,
                mode: 'push',
              },
            },
          },
        });
      } else {
        requestAnimationFrame(tryParticle);
      }
    };
    particleInterval = requestAnimationFrame(tryParticle);
    
    // 時計の更新（1秒ごと）
    timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('ja-JP', { 
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);
  });

  onCleanup(() => {
    if (particleInterval) {
      cancelAnimationFrame(particleInterval);
    }
    if (timeInterval) {
      clearInterval(timeInterval);
    }
  });
  
  return (
    <div class="absolute inset-0 flex items-start md:items-center justify-center overflow-auto py-4">
      <div id="particles-js" class="fixed inset-0 z-0"></div>
      
      <div class="container mx-auto px-4 py-8 z-10 mt-4 md:my-auto">
        <header class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold">もごぼんのページへようこそ</h1>
          <p class="mt-4">{greeting()}</p> 
          <p class="mt-2 text-sm md:text-base">現在の時刻は {currentTime()}</p>
        </header>

        <section class="links text-center mb-8">
          <h2 class="text-2xl font-semibold mb-6">Links</h2>
          <ul class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <li>
              <a href="https://atcoder.jp/users/mogobon" target="_blank"
                 class="flex items-center gap-3 p-3 rounded-lg bg-gray-200 active:bg-black-600 focus:bg-black-600 transition-all duration-300 text-black shadow-md">
                <i class="fas fa-code text-xl w-8"></i>
                <span>Atcoder Profile</span>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/Mogobon" target="_blank"
                 class="flex items-center gap-3 p-3 rounded-lg bg-black active:bg-white-600 focus:bg-white-600 transition-all duration-300 text-white shadow-md">
                <i class="fab fa-x-twitter text-xl w-8"></i>
                <span>X (Twitter)</span>
              </a>
            </li>
            <li>
              <a href="https://youtube.com/@mogobon6633" target="_blank"
                 class="flex items-center gap-3 p-3 rounded-lg bg-red-500 active:bg-red-600 focus:bg-red-600 transition-all duration-300 text-white shadow-md">
                <i class="fab fa-youtube text-xl w-8"></i>
                <span>YouTube</span>
              </a>
            </li>
            <li>
              <a href="https://qiita.com/Mogobon" target="_blank"
                 class="flex items-center gap-3 p-3 rounded-lg bg-green-500 active:bg-green-600 focus:bg-green-600 transition-all duration-300 text-white shadow-md">
                <i class="fas fa-pen-to-square text-xl w-8"></i>
                <span>Qiita</span>
              </a>
            </li>
            <li>
              <a href="https://note.com/mogobon/" target="_blank"
                 class="flex items-center gap-3 p-3 rounded-lg bg-white active:bg-black-700 focus:bg-black-700 transition-all duration-300 text-black shadow-md">
                <i class="fas fa-book text-xl w-8"></i>
                <span>note</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/mogobon" target="_blank"
                 class="flex items-center gap-3 p-3 rounded-lg bg-gray-700 active:bg-gray-800 focus:bg-gray-800 transition-all duration-300 text-white shadow-md">
                <i class="fab fa-github text-xl w-8"></i>
                <span>GitHub</span>
              </a>
            </li>
          </ul>
        </section>
        
        <section class="atcoderの物置き場 mb-8">
          <h2 class="text-2xl font-semibold mb-6">AtCoderの物置き場</h2>
          <ul>
            <li>
              <a href="/rireki.html" target="_blank" rel="noopener noreferrer">
                AHC040
              </a>
            </li>
            <li>
              <a href="/adt-to-abc.html" target="_blank" rel="noopener noreferrer">
                ADT→ABC Converter
              </a>
            </li>
            {/* <li>
              <a href="/notes.html" rel="noopener noreferrer">
                競プロノート一覧
              </a>
            </li> */}
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-6">記事一覧（ツリー表示）</h2>
          <div class="bg-white rounded-lg shadow p-4" style="text-align:left; font-family:monospace;">
            {tree().length === 0 ? (
              <p>記事がありません</p>
            ) : (
              <TreeView nodes={tree()} level={1} />
            )}
          </div>
        </section>
        <section class="timeline mb-8">
          <h2 class="text-2xl font-semibold mb-6">このブログに起こったこと</h2>
          <div class="flex justify-center">
            <ul class="text-left max-w-lg w-full mx-auto">
              {timeline.map(item => (
                <li>
                  <strong>{item.date}</strong>: {item.event}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

// TreeNode型定義
type TreeNode = {
  name: string;
  children?: TreeNode[];
  article?: {
    title: string;
    path: string;
  };
};

// ツリー表示用コンポーネント
function TreeView(props: { nodes: TreeNode[]; level?: number; parentLines?: string[] }) {
  // ディレクトリごとに開閉状態を管理
  const [openDirs, setOpenDirs] = createSignal<{ [key: string]: boolean }>({});
  // ディレクトリノードのユニークキー生成
  function getNodeKey(node: TreeNode, parentPath: string = ''): string {
    return parentPath + '/' + node.name;
  }
  // 再帰描画
  function renderNodes(nodes: TreeNode[], level: number, parentPath: string) {
    return nodes.map(node => {
      const indent = level * 2;
      const nodeKey = getNodeKey(node, parentPath);
      if (node.article) {
        // ファイル
        return (
          <div style={`margin-left:${indent}em; display:flex; align-items:center;`}>
            <span style="margin-right:0.5em;"><i class="fas fa-file"></i></span>
            <a href={node.article.path} rel="noopener" class="text-base text-black hover:underline">
              {node.article.title || node.name}
            </a>
          </div>
        );
      } else {
        // ディレクトリ
        const isOpen = openDirs()[nodeKey] ?? false;
        return (
          <div>
            <div style={`margin-left:${indent}em; margin-top:1em; display:flex; align-items:center; cursor:pointer;`} onClick={() => {
              setOpenDirs({ ...openDirs(), [nodeKey]: !isOpen });
            }}>
              <span style="margin-right:0.5em;"><i class={isOpen ? 'fas fa-folder-open' : 'fas fa-folder'}></i></span>
              <span class="font-bold text-xl text-blue-700">{node.name}</span>
            </div>
            {isOpen && node.children && node.children.length > 0 && (
              <div>
                {renderNodes(node.children, level + 1, nodeKey)}
              </div>
            )}
          </div>
        );
      }
    });
  }
  return (
    <div style={`text-align:left; font-family:monospace;`}>
      {renderNodes(props.nodes, props.level ?? 0, '')}
    </div>
  );
}
