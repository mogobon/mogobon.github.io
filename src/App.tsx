import { createSignal, onMount, onCleanup} from 'solid-js'
import './App.css'

declare function particlesJS(id: string, options: unknown): void;

function App() {
  const [timeline] = createSignal([
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
      <div class="container">
        <header class="text-center">
          <h1 class="text-4xl font-bold">Mogobonのページへようこそ</h1>
          <p class="mt-4">Explore my journey in competitive programming and more!</p>
        </header>

        <section class="links">
          <h2 class="text-2xl font-semibold">Links</h2>
          <ul>
            <li><a href="https://atcoder.jp/users/mogobon" target="_blank">Atcoder Profile</a></li>
            <li><a href="https://twitter.com/Mogobon" target="_blank">X (Twitter)</a></li>
            <li><a href="https://youtube.com/@mogobon6633" target="_blank">YouTube</a></li>
          </ul>
        </section>
        <section class="atcoder考察">
          <h2 class="text-2xl font-semibold">AtCoderの考察</h2>
          <ul>
            <li>
              <a href="/rireki.html" target="_blank" rel="noopener noreferrer">
                AHC040
              </a>
            </li>
          </ul>
        </section>
        

       

        <section class="timeline">
          <h2 class="text-2xl font-semibold">Timeline</h2>
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
