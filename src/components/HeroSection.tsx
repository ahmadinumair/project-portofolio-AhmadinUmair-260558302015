import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { PROFILE_INFO } from '../data/portfolioData';

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [circleRadius, setCircleRadius] = useState(175);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateRadius = () => {
      const { width, height } = el.getBoundingClientRect();
      const r = Math.round(
        Math.min(Math.max(Math.min(width * 0.29, height * 0.36), 120), 215)
      );
      setCircleRadius(r);
    };

    updateRadius();
    const ro = new ResizeObserver(updateRadius);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    mass: 0.35,
  });

  // Beat 1 (Light 00:00) -> Beat 2 (Dark + Crimson Circle 00:01–00:02)
  const darkOverlayOpacity = useTransform(smoothProgress, [0.16, 0.52], [0, 1]);
  const lightIntroOpacity = useTransform(smoothProgress, [0.1, 0.4], [1, 0]);
  const lightIntroY = useTransform(
    smoothProgress,
    [0.1, 0.4],
    [0, prefersReducedMotion ? 0 : -28]
  );

  // Crimson focal circle expands smoothly from center and masks black text inside it
  const crimsonProgress = useTransform(smoothProgress, [0.18, 0.62], [0, 1]);
  const crimsonCircleOpacity = useTransform(smoothProgress, [0.18, 0.38], [0, 1]);
  const crimsonClipPath = useTransform(
    crimsonProgress,
    (p) => `circle(${(p * circleRadius).toFixed(1)}px at 50% 54%)`
  );

  // Giant condensed title scales & expands in dark beat
  const giantTitleScale = useTransform(smoothProgress, [0.22, 0.66], [0.85, 1]);
  const giantTitleOpacity = useTransform(smoothProgress, [0.24, 0.56], [0, 1]);
  const giantTitleY = useTransform(
    smoothProgress,
    [0.24, 0.66],
    [prefersReducedMotion ? 0 : 24, 0]
  );

  // Bottom bar smooth crossfade without overlapping portrait
  const lightBarPointer = useTransform(smoothProgress, (v) => (v < 0.38 ? 'auto' : 'none'));
  const darkFooterOpacity = useTransform(smoothProgress, [0.44, 0.75], [0, 1]);
  const darkFooterY = useTransform(
    smoothProgress,
    [0.44, 0.75],
    [prefersReducedMotion ? 0 : 18, 0]
  );
  const darkBarPointer = useTransform(smoothProgress, (v) => (v >= 0.44 ? 'auto' : 'none'));

  // Portrait depth parallax
  const portraitScale = useTransform(smoothProgress, [0, 0.6, 1], [1, 1.05, 0.98]);
  const portraitY = useTransform(
    smoothProgress,
    [0, 0.6, 1],
    prefersReducedMotion ? [0, 0, 0] : [14, 0, -10]
  );

  const scrollToDarkBeat = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top + containerRef.current.offsetHeight * 0.54;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  // Shared typography layout so the outer white layer and inner black layer align to the sub-pixel
  const renderBeatTwoTypography = (variant: 'white' | 'black') => {
    const isBlack = variant === 'black';
    return (
      <motion.div
        style={{
          opacity: giantTitleOpacity,
          scale: giantTitleScale,
          y: giantTitleY,
        }}
        className="absolute inset-x-4 sm:inset-x-8 top-[16%] sm:top-[18%] flex flex-col items-center pointer-events-none select-none"
      >
        <div
          className={`flex items-center justify-center gap-1.5 mb-2 font-display text-base sm:text-lg tracking-widest ${
            isBlack ? 'text-[#08080B]' : 'text-zinc-400'
          }`}
        >
          <span>I</span>
          <span>I</span>
          <span>I</span>
        </div>
        <div
          className={`w-full max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 ${
            isBlack ? 'text-[#08080B]' : 'text-zinc-200'
          }`}
        >
          <span>Politeknik IDN</span>
          <span>Bogor</span>
          <span>Software Eng.</span>
          <span>Aspiring Dev</span>
        </div>
        <p
          aria-hidden="true"
          style={{ fontFamily: '"Noto Sans JP", var(--font-display)' }}
          className={`w-full text-center font-black tracking-[0.12em] leading-[0.9] text-[clamp(3rem,13.5vw,10.5rem)] whitespace-nowrap ${
            isBlack ? 'text-[#08080B]' : 'text-white'
          }`}
        >
          次へ進む
        </p>
      </motion.div>
    );
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[195vh] bg-[#F6F6F7]"
    >
      {/* Sticky Full-Viewport 3-Row Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden grid grid-rows-[auto_1fr_auto] pt-20 pb-6 sm:pb-8">
        {/* Background Layer A: Crisp Light Grid Studio (00:00) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#F6F6F7] grid-light pointer-events-none"
        />

        {/* Background Layer B: Stark Obsidian Dark Stage (00:01 - 00:02) */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: darkOverlayOpacity }}
          className="absolute inset-0 bg-[#08080B] grid-dark pointer-events-none"
        />

        {/* Row 1: Subtle Architectural Crosshair Frame */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="relative z-30 max-w-6xl mx-auto w-full px-5 sm:px-8 flex items-center justify-between text-[11px] font-mono text-zinc-500 pointer-events-none"
        >
          <span>+</span>
          <span className="tracking-widest uppercase">Bogor · Indonesia</span>
          <span>+</span>
        </motion.div>

        {/* Row 2: Center Layered Composition */}
        <div
          ref={stageRef}
          className="relative max-w-6xl mx-auto w-full px-5 sm:px-8 flex flex-col items-center justify-end overflow-hidden"
        >
          {/* BEAT 1: Light Entrance Headline (00:00) */}
          <motion.div
            style={{ opacity: lightIntroOpacity, y: lightIntroY }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-5 sm:inset-x-8 top-[12%] sm:top-[15%] z-10 flex flex-col items-center text-center pointer-events-none"
          >
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500 mb-2">
              {PROFILE_INFO.education}
            </p>
            <h1
              style={{ textWrap: 'balance' }}
              className="mx-auto font-display font-bold uppercase tracking-tight leading-[0.88] text-[clamp(2.5rem,9.5vw,7.2rem)] text-zinc-950 whitespace-nowrap"
            >
              {PROFILE_INFO.fullName}
            </h1>
            <div className="w-full max-w-[clamp(18rem,56vw,44rem)] flex items-center justify-between text-[11px] sm:text-sm font-semibold uppercase tracking-widest text-zinc-700 mt-2.5">
              <span>Software Eng.</span>
              <span className="tabular-nums">2026</span>
            </div>
          </motion.div>

          {/* Subtle Light Ambient Circle (Beat 1) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              style={{
                opacity: lightIntroOpacity,
                width: circleRadius * 2,
                height: circleRadius * 2,
                top: '54%',
              }}
              animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-900/10 bg-zinc-200/55"
            />
          </div>

          {/* BEAT 2 LAYER A (Outside Red Circle): White Typography */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {renderBeatTwoTypography('white')}
          </div>

          {/* BEAT 2 LAYER B (Inside Red Circle): Crimson Disc + Masked Black Typography */}
          <motion.div
            aria-hidden="true"
            style={{
              opacity: crimsonCircleOpacity,
              clipPath: crimsonClipPath,
            }}
            className="absolute inset-0 z-[15] bg-[#DC2626] pointer-events-none"
          >
            {renderBeatTwoTypography('black')}
          </motion.div>

          {/* Foreground Cutout Portrait (z-20, sits in front of circle and split-color text) */}
          <motion.div
            style={{ scale: portraitScale, y: portraitY }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 w-full max-w-[240px] sm:max-w-[295px] md:max-w-[325px] max-h-[48vh] sm:max-h-[51vh] aspect-[4/5] flex items-end justify-center pointer-events-none"
          >
            <img
              src={PROFILE_INFO.portraitSrc}
              alt="Portrait of Ahmadin Umair"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain object-bottom drop-shadow-[0_24px_38px_rgba(0,0,0,0.45)]"
            />
          </motion.div>
        </div>

        {/* Row 3: Dedicated Bottom Slot */}
        <div className="relative z-30 max-w-6xl mx-auto w-full px-5 sm:px-8 pt-4">
          <div className="relative min-h-[72px] flex items-center">
            {/* Beat 1 Bottom Cue */}
            <motion.div
              style={{ opacity: lightIntroOpacity, pointerEvents: lightBarPointer }}
              className="w-full flex items-center justify-between gap-4 border-t border-zinc-900/10 pt-4"
            >
              <p className="text-xs sm:text-sm font-medium text-zinc-600">
                {PROFILE_INFO.roleTitle} · {PROFILE_INFO.tagline}
              </p>
              <button
                type="button"
                onClick={scrollToDarkBeat}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-zinc-950 hover:bg-red-600 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <span>Scroll to Enter</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </button>
            </motion.div>

            {/* Beat 2 Bottom Editorial Info + CTA + Rotating Stamp */}
            <motion.div
              style={{
                opacity: darkFooterOpacity,
                y: darkFooterY,
                pointerEvents: darkBarPointer,
              }}
              className="absolute inset-x-0 bottom-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-white/10 pt-4"
            >
              <div className="max-w-md space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-red-500">
                  About Me
                </p>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {PROFILE_INFO.shortIntro}
                </p>
              </div>

              <div className="flex items-center gap-3.5 self-start sm:self-center shrink-0">
                <a
                  href="#skills"
                  className="group h-11 inline-flex items-center gap-3 pl-5 pr-2 rounded-full border border-white/25 hover:border-red-500 bg-[#08080B]/95 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:scale-[1.03] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <span>Explore Skills</span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-zinc-950 group-hover:bg-red-600 group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>

                <div
                  aria-hidden="true"
                  className="flex relative w-14 h-14 items-center justify-center shrink-0"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                    <defs>
                      <path
                        id="hero-stamp-circle"
                        d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                      />
                    </defs>
                    <text className="fill-zinc-300 text-[10px] font-mono uppercase tracking-[0.2em]">
                      <textPath href="#hero-stamp-circle">
                        LEARNING · BUILDING · GROWING ·
                      </textPath>
                    </text>
                  </svg>
                  <span className="absolute w-[40px] h-[16px] overflow-hidden">
                    <img
                      src="/assets/profile/au-monogram.png"
                      alt=""
                      referrerPolicy="no-referrer"
                      style={{
                        width: '205%',
                        height: '339%',
                        left: '-52.5%',
                        top: '-113%',
                      }}
                      className="absolute max-w-none"
                    />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
