import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react';

const RIBBON_ITEMS = [
  'Ahmadin Umair',
  'Politeknik IDN Bogor',
  'Software Engineering',
  'HTML · CSS · JS',
  'PHP · Laravel',
  'Tailwind CSS',
  'Learning · Building · Growing',
];

export default function MarqueeDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.3,
  });

  const stripX = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [60, -180]
  );

  const repeated = [...RIBBON_ITEMS, ...RIBBON_ITEMS, ...RIBBON_ITEMS];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative bg-[#08080B] py-5 overflow-hidden select-none"
    >
      <div className="-rotate-1 scale-[1.03] perforated-ribbon py-2.5 shadow-[0_12px_32px_rgba(220,38,38,0.28)]">
        <motion.div style={{ x: stripX }} className="flex w-max items-center">
          {repeated.map((item, idx) => (
            <div key={`${item}-${idx}`} className="flex items-center shrink-0">
              <span className="px-5 text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-white whitespace-nowrap">
                {item}
              </span>
              <span className="text-white/60 text-xs">·</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
