import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import Hero from './components/Hero';

gsap.registerPlugin(ScrollTrigger);

const standards = [
  { label: '01', title: 'Performance', text: 'Arquitetura enxuta com foco em velocidade real e previsibilidade de render.' },
  { label: '02', title: 'Escalabilidade', text: 'Base técnica preparada para evolução contínua sem dívida de interface.' },
  { label: '03', title: 'Experiência', text: 'Microinterações precisas e linguagem visual consistente em toda a jornada.' },
];

const solutions = ['Software / ERP', 'Mobile', 'IA / Automações', 'Dashboards'];

const methodology = [
  { step: 'Diagnóstico', description: 'Mapeamos gargalos, metas de negócio e oportunidades de produto.' },
  { step: 'Arquitetura', description: 'Definimos stack, fluxos e diretrizes de interface com rigor técnico.' },
  { step: 'Construção', description: 'Executamos sprints curtas com validação contínua e controle de qualidade.' },
  { step: 'Otimização', description: 'Ajustamos performance e escala com monitoramento real de uso.' },
];

function App() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.05, smoothWheel: true });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    const onMouseMove = (event: MouseEvent) => {
      if (!cursorRef.current) return;
      gsap.to(cursorRef.current, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.15,
        ease: 'power3.out',
      });
    };

    const magneticElements = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
    const cleanups: Array<() => void> = [];

    magneticElements.forEach((element) => {
      const move = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        gsap.to(element, { x: x * 0.15, y: y * 0.15, duration: 0.25, ease: 'power2.out' });
      };

      const leave = () => gsap.to(element, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });

      const enter = () => cursorRef.current?.classList.add('cursor--active');
      const leaveCursor = () => cursorRef.current?.classList.remove('cursor--active');

      element.addEventListener('mousemove', move);
      element.addEventListener('mouseleave', leave);
      element.addEventListener('mouseenter', enter);
      element.addEventListener('mouseleave', leaveCursor);

      cleanups.push(() => {
        element.removeEventListener('mousemove', move);
        element.removeEventListener('mouseleave', leave);
        element.removeEventListener('mouseenter', enter);
        element.removeEventListener('mouseleave', leaveCursor);
      });
    });

    window.addEventListener('mousemove', onMouseMove);

    const standardItems = gsap.utils.toArray<HTMLElement>('[data-standard-item]');
    standardItems.forEach((item) => {
      const inner = item.querySelector('[data-standard-inner]');
      if (!inner) return;
      gsap.fromTo(
        inner,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
        },
      );
    });

    const methodItems = gsap.utils.toArray<HTMLElement>('[data-method-item]');
    methodItems.forEach((item) => {
      gsap.to(item, {
        opacity: 1,
        scrollTrigger: {
          trigger: item,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
          onEnter: () => gsap.to(methodItems, { opacity: 0.2, duration: 0.12 }),
          onEnterBack: () => gsap.to(methodItems, { opacity: 0.2, duration: 0.12 }),
          onToggle: (self) => {
            if (self.isActive) gsap.to(item, { opacity: 1, duration: 0.12 });
          },
        },
      });
    });

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', onMouseMove);
      cleanups.forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="bg-black text-[#F5F5F7]">
      <div ref={cursorRef} className="custom-cursor" />
      <Hero />

      <section className="border-b border-[#1D1D1F] bg-black px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl border border-[#1D1D1F]">
          <div className="grid md:grid-cols-3">
            {standards.map((item, index) => (
              <article
                key={item.title}
                data-standard-item
                className={`overflow-hidden p-8 ${index > 0 ? 'border-t border-[#1D1D1F] md:border-l md:border-t-0' : ''}`}
              >
                <div data-standard-inner>
                  <p className="font-mono text-xs tracking-[0.2em] text-[#8F8F93]">{item.label}</p>
                  <h3 className="mt-4 text-3xl font-black uppercase">{item.title}</h3>
                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#C7C7CC]">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#1D1D1F] bg-black px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-4">
          {solutions.map((solution) => (
            <article
              key={solution}
              data-magnetic
              className="group border border-[#1D1D1F] bg-[#0A0A0A] p-8 transition-transform duration-200 hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(-2deg)]"
            >
              <p className="text-lg font-bold uppercase tracking-[0.08em]">{solution}</p>
              <p className="mt-10 text-xs uppercase tracking-[0.16em] text-[#8F8F93] transition-transform duration-200 group-hover:translate-x-1">
                Construção sob medida
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-[#1D1D1F] bg-black px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.2fr_2fr]">
          <div className="md:sticky md:top-12 md:h-fit">
            <h2 className="text-5xl font-black uppercase leading-none md:text-7xl">Methodology</h2>
          </div>

          <div className="space-y-12">
            {methodology.map((item) => (
              <article key={item.step} data-method-item className="opacity-20 transition-opacity">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8F8F93]">{item.step}</p>
                <p className="mt-3 max-w-xl text-2xl font-semibold leading-snug md:text-3xl">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-b border-[#1D1D1F] bg-black px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-[16vw] font-black uppercase leading-none tracking-[-0.03em] md:text-[11rem]">NEXT LEVEL?</h2>
          <button
            data-magnetic
            className="mt-12 border border-[#F5F5F7] px-10 py-4 text-xs font-bold uppercase tracking-[0.16em] transition-colors hover:bg-[#F5F5F7] hover:text-black"
          >
            Falar com a Nova Flow
          </button>
        </div>
      </footer>

      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.06]">
        <div className="grain h-full w-full" />
      </div>
    </main>
  );
}

export default App;
