import { Float, MeshDistortMaterial } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger, TextPlugin } from 'gsap/all';
import React, { Component, ReactNode, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP);

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    // fallback visual já é suficiente para evitar loop de erro/white screen
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function ReactiveOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, pointer.y * 0.3, 0.04);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, pointer.x * 0.45, 0.04);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, pointer.y * 0.08, 0.04);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -0.25 + pointer.x * 0.1, 0.04);

    meshRef.current.rotation.z += 0.0015;
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.45) * 0.015);
  });

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#7dd3fc"
          roughness={0.35}
          metalness={0.2}
          distort={0.2}
          speed={1.2}
          transparent
          opacity={0.72}
        />
      </mesh>
    </Float>
  );
}

function AuroraGlow() {
  return (
    <div className="absolute inset-0">
      <div className="absolute -left-16 top-1/4 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -right-10 top-1/3 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="absolute bottom-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/55 to-slate-950" />
    </div>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const typeRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const threeWrapRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const phrases = useMemo(
    () => ['Software sob medida', 'Design de elite', 'Automações inteligentes'],
    [],
  );

  useGSAP(
    () => {
      if (!heroRef.current || !titleRef.current || !typeRef.current || !cursorRef.current || !threeWrapRef.current) {
        return;
      }

      const typeTl = gsap.timeline({ repeat: -1, repeatDelay: 0.35 });

      phrases.forEach((phrase) => {
        typeTl
          .to(typeRef.current, { duration: 1.3, text: phrase, ease: 'none' })
          .to({}, { duration: 1.05 })
          .to(typeRef.current, { duration: 0.9, text: '', ease: 'none' })
          .to({}, { duration: 0.2 });
      });

      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      const destroyTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top+=120',
          scrub: 1,
        },
      });

      destroyTl
        .to(
          titleRef.current,
          {
            letterSpacing: '0.6em',
            filter: 'blur(15px)',
            opacity: 0,
            y: -60,
            ease: 'none',
          },
          0,
        )
        .to(
          typeRef.current,
          {
            opacity: 0,
            filter: 'blur(10px)',
            y: -35,
            ease: 'none',
          },
          0,
        )
        .to(
          threeWrapRef.current,
          {
            opacity: 0,
            scale: 0.92,
            z: -220,
            filter: 'blur(8px)',
            ease: 'none',
          },
          0,
        )
        .to(
          '#next-section',
          {
            y: -90,
            ease: 'none',
          },
          0,
        );

      return () => {
        typeTl.kill();
        destroyTl.kill();
      };
    },
    { scope: heroRef, dependencies: [phrases] },
  );

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      <AuroraGlow />

      <div ref={threeWrapRef} className="absolute inset-0">
        <CanvasErrorBoundary fallback={null}>
          {!webglFailed ? (
            <Canvas
              camera={{ position: [0, 0, 3], fov: 52 }}
              gl={{ antialias: false, powerPreference: 'high-performance' }}
              dpr={[1, 1.5]}
              performance={{ min: 0.5 }}
              onCreated={({ gl }) => {
                const contextLost = () => setWebglFailed(true);
                gl.domElement.addEventListener('webglcontextlost', contextLost, { once: true });
              }}
              fallback={null}
            >
              <ambientLight intensity={0.45} />
              <pointLight position={[2, 2, 3]} intensity={0.75} color="#67e8f9" />
              <ReactiveOrb />
            </Canvas>
          ) : null}
        </CanvasErrorBoundary>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <div>
          <h1
            ref={titleRef}
            className="text-4xl font-bold tracking-wide text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.35)] md:text-7xl"
          >
            Nova Flow —
          </h1>

          <p className="mt-6 min-h-12 text-xl text-cyan-100 md:text-3xl">
            <span ref={typeRef} />
            <span ref={cursorRef} className="ml-1 font-light">
              _
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
