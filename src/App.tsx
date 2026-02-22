import { useEffect } from 'react';
import Lenis from 'lenis';
import Hero from './components/Hero';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      smoothWheel: true,
      syncTouch: false,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-slate-950 text-white">
      <Hero />

      <section
        id="next-section"
        className="relative z-20 -mt-20 min-h-screen rounded-t-3xl border border-white/10 bg-slate-950/80 px-6 pb-16 pt-32 backdrop-blur-xl md:px-12"
      >
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {[
            {
              title: 'Web Experiences',
              description: 'Interfaces premium com motion design, performance e personalidade.',
            },
            {
              title: 'AI Automations',
              description: 'Fluxos inteligentes para reduzir operação e escalar processos.',
            },
            {
              title: 'Digital Products',
              description: 'Produtos digitais sob medida para posicionar sua marca no futuro.',
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-md"
            >
              <h3 className="text-xl font-semibold text-cyan-200">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-200/90">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-soft-light">
        <div className="grain h-full w-full" />
      </div>
    </main>
  );
}

export default App;
