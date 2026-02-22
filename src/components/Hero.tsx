import gsap from 'gsap';
import { ScrollTrigger, TextPlugin } from 'gsap/all';
import { useEffect, useMemo, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const typeRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => ['Software', 'Design', 'Engenharia'], []);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !typeRef.current || !cursorRef.current || !gridRef.current) {
      return;
    }

    const typeTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.25 });
    words.forEach((word) => {
      typeTimeline
        .to(typeRef.current, { duration: 0.95, text: word, ease: 'none' })
        .to({}, { duration: 0.8 })
        .to(typeRef.current, { duration: 0.65, text: '', ease: 'none' })
        .to({}, { duration: 0.2 });
    });

    const cursorTween = gsap.to(cursorRef.current, {
      opacity: 0,
      yoyo: true,
      repeat: -1,
      duration: 0.45,
      ease: 'none',
    });

    const parallaxTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    parallaxTimeline
      .to(titleRef.current, { yPercent: -18, ease: 'none' }, 0)
      .to(gridRef.current, { yPercent: -6, ease: 'none' }, 0)
      .to(typeRef.current, { yPercent: -8, opacity: 0.8, ease: 'none' }, 0);

    return () => {
      typeTimeline.kill();
      cursorTween.kill();
      parallaxTimeline.kill();
    };
  }, [words]);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center border-b border-[#1D1D1F] bg-black px-6 md:px-12">
      <div ref={gridRef} className="pointer-events-none absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[linear-gradient(to_right,#1d1d1f_1px,transparent_1px),linear-gradient(to_bottom,#1d1d1f_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="relative z-10 max-w-6xl">
        <h1 ref={titleRef} className="text-[14vw] font-black uppercase leading-[0.88] tracking-[-0.04em] text-[#F5F5F7] md:text-[10rem]">
          Nova Flow —
        </h1>
        <p className="mt-5 text-xl font-semibold uppercase tracking-[0.12em] text-[#F5F5F7] md:text-3xl">
          <span ref={typeRef} />
          <span ref={cursorRef}>_</span>
        </p>

        <button
          data-magnetic
          className="mt-10 inline-flex items-center justify-center border border-[#F5F5F7] bg-[#F5F5F7] px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition-colors duration-200 hover:bg-black hover:text-[#F5F5F7]"
        >
          Iniciar Projeto
        </button>
      </div>
    </section>
  );
}

export default Hero;
