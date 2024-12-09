import { createSignal, onMount, onCleanup} from 'solid-js'
import './App.css'

declare function particlesJS(id: string, options: unknown): void;

function App() {
  const [timeline] = createSignal([
    { date: '2024-12-09', event: 'AHC040の日記を書きました' },
    { date: '2024-11-20', event: 'ホームページの見た目を整えました' },
  ])
  const [particlesInitialized, setParticlesInitialized] = createSignal(false);
  let particleInterval: number | null = null;

  onMount(() => {
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
            line_linked: {
              enable: true,
              color: '#48b0d5',
            },
            color: {
              value: '#48b0d5',
            },
            size: {
              value: 3,
              random: true,
            },
          },
          interactivity: {
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
  });

  onCleanup(() => {
    if (particleInterval) {
      cancelAnimationFrame(particleInterval);
    }
  });
  

  return (
    <>
      <div id="particles-js" class="background-animation"></div>
      <div class="container space-y-12">
        <header class="text-center">
          <h1 class="text-4xl font-bold">もごぼんのページへようこそ</h1>
          <p class="mt-4">Explore my journey in competitive programming and more!</p>
        </header>

        <section class="links text-center">
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
        <section class="atcoder考察">
          <h2 class="text-2xl font-semibold mb-6">AtCoderの考察</h2>
          <ul>
            <li>
              <a href="/rireki.html" target="_blank" rel="noopener noreferrer">
                AHC040
              </a>
            </li>
          </ul>
        </section>
        

       

        <section class="timeline">
          <h2 class="text-2xl font-semibold mb-6">Timeline</h2>
          <ul>
            {timeline().map(item => (
              <li>
                <strong>{item.date}</strong>: {item.event}
              </li>
            ))}
          </ul>
        </section>

        
      </div>
    </>
  )
}

export default App
