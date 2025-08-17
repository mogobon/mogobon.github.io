import { createSignal, onMount, onCleanup } from 'solid-js'
import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css';

declare function particlesJS(id: string, options: unknown): void;

function App() {
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
  
  const [timeline] = createSignal([
    { date: '2024-12-09', event: 'AHC040の日記を書きました' },
    { date: '2024-11-20', event: 'ホームページの見た目を整えました' },
    { date: '2025-03-28', event: 'ADT→ABC Converterをおきました' }
  ]);
  
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
                 class="flex items-center gap-3 p-3 rounded-lg bg-gray-200 hover:bg-black-600 
                        transition-all duration-300 text-black shadow-md">
                <i class="fas fa-code text-xl w-8"></i>
                <span>Atcoder Profile</span>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/Mogobon" target="_blank" 
                 class="flex items-center gap-3 p-3 rounded-lg bg-black hover:bg-white-600 
                        transition-all duration-300 text-white shadow-md">
                <i class="fab fa-x-twitter text-xl w-8"></i>
                <span>X (Twitter)</span>
              </a>
            </li>
            <li>
              <a href="https://youtube.com/@mogobon6633" target="_blank" 
                 class="flex items-center gap-3 p-3 rounded-lg bg-red-500 hover:bg-red-600 
                        transition-all duration-300 text-white shadow-md">
                <i class="fab fa-youtube text-xl w-8"></i>
                <span>YouTube</span>
              </a>
            </li>
            <li>
              <a href="https://qiita.com/Mogobon" target="_blank" 
                 class="flex items-center gap-3 p-3 rounded-lg bg-green-500 hover:bg-green-600 
                        transition-all duration-300 text-white shadow-md">
                <i class="fas fa-pen-to-square text-xl w-8"></i>
                <span>Qiita</span>
              </a>
            </li>
            <li>
              <a href="https://note.com/mogobon/" target="_blank" 
                 class="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-black-700 
                        transition-all duration-300 text-black shadow-md">
                <i class="fas fa-book text-xl w-8"></i>
                <span>note</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/mogobon" target="_blank" 
                 class="flex items-center gap-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-800 
                        transition-all duration-300 text-white shadow-md">
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
            <li>
              <a href="/kyopro-note.html" target="_blank" rel="noopener noreferrer">
                競プロノート
              </a>
            </li>
          </ul>
        </section>

        <section class="timeline mb-8">
          <h2 class="text-2xl font-semibold mb-6">このブログに起こったこと</h2>
          <ul>
            {timeline().map(item => (
              <li>
                <strong>{item.date}</strong>: {item.event}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default App
