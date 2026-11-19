import { useState, useRef } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PROFILE_INFO, TECHNICAL_SKILLS, SkillCategory } from '../data/portfolioData';

type FilterTab = 'All' | SkillCategory;

const SKILL_FILTERS: FilterTab[] = ['All', 'Frontend', 'Backend & Database', 'Tools'];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [failedIcons, setFailedIcons] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 115,
    damping: 25,
    mass: 0.34,
  });

  // Bidirectional scroll entrance & exit for the top 3 focus circles & section shell
  const leftCircleX = useTransform(
    smoothProgress,
    [0, 0.16, 0.84, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [-36, 0, 0, -30]
  );
  const rightCircleX = useTransform(
    smoothProgress,
    [0, 0.16, 0.84, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [36, 0, 0, 30]
  );
  const centerCircleScale = useTransform(
    smoothProgress,
    [0, 0.16, 0.84, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.88, 1, 1, 0.9]
  );
  const topBandOpacity = useTransform(
    smoothProgress,
    [0, 0.14, 0.86, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.35, 1, 1, 0.35]
  );
  const topBandY = useTransform(
    smoothProgress,
    [0, 0.16, 0.84, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [28, 0, 0, -24]
  );
  const shellScale = useTransform(
    smoothProgress,
    [0, 0.14, 0.86, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.97, 1, 1, 0.97]
  );

  // Bidirectional scroll entrance & exit for the Technical Stack grid
  const { scrollYProgress: stackProgress } = useScroll({
    target: stackRef,
    offset: ['start end', 'end start'],
  });
  const smoothStackProgress = useSpring(stackProgress, {
    stiffness: 115,
    damping: 25,
    mass: 0.32,
  });
  const stackOpacity = useTransform(
    smoothStackProgress,
    [0, 0.14, 0.86, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.35, 1, 1, 0.35]
  );
  const stackY = useTransform(
    smoothStackProgress,
    [0, 0.16, 0.84, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [26, 0, 0, -22]
  );

  const filteredSkills =
    activeFilter === 'All'
      ? TECHNICAL_SKILLS
      : TECHNICAL_SKILLS.filter((skill) => skill.category === activeFilter);

  const cycleFilter = (direction: -1 | 1) => {
    const currentIndex = SKILL_FILTERS.indexOf(activeFilter);
    const nextIndex = (currentIndex + direction + SKILL_FILTERS.length) % SKILL_FILTERS.length;
    setActiveFilter(SKILL_FILTERS[nextIndex]);
  };

  return (
    <div className="bg-[#F6F6F7]">
      <motion.section
        id="skills"
        ref={sectionRef}
        style={{ scale: shellScale }}
        className="relative z-10 bg-[#08080B] grid-dark text-zinc-100 rounded-b-[2rem] sm:rounded-b-[3.25rem] pt-16 sm:pt-24 pb-20 sm:pb-24 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-20">
          {/* Top 3-Circle Showcase Band with Bidirectional Scroll Motion */}
          <motion.div
            style={{ opacity: topBandOpacity, y: topBandY }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-10 items-center"
          >
            {/* Left Info Block */}
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
                  Education
                </p>
                <p className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                  {PROFILE_INFO.education}
                </p>
                <p className="text-xs text-zinc-400">{PROFILE_INFO.major}</p>
              </div>
              <div className="flex items-center gap-1.5 pt-1" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Center 3 Circles with Scroll-Linked Convergence */}
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center -space-x-3 sm:-space-x-2">
                <motion.div
                  style={{ x: leftCircleX }}
                  whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white text-zinc-950 flex flex-col items-center justify-center text-center p-3 shadow-xl z-10 cursor-default"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                    Major
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">
                    TRPL
                  </span>
                </motion.div>

                <motion.div
                  style={{ scale: centerCircleScale }}
                  whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.06 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#DC2626] text-white flex flex-col items-center justify-center text-center p-3 shadow-[0_12px_35px_rgba(220,38,38,0.45)] z-20 cursor-default"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-red-100">
                    Skills
                  </span>
                  <span className="font-display text-3xl sm:text-4xl font-bold tabular-nums">
                    {TECHNICAL_SKILLS.length}
                  </span>
                </motion.div>

                <motion.div
                  style={{ x: rightCircleX }}
                  whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#111116] border border-white/15 text-white flex flex-col items-center justify-center text-center p-3 shadow-xl z-10 cursor-default"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    Stage
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight">
                    Beginner
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Right Quote / Mission Block */}
            <div className="space-y-2">
              <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                &ldquo;{PROFILE_INFO.aboutParagraphs[1]}&rdquo;
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {PROFILE_INFO.aboutParagraphs[2]}
              </p>
            </div>
          </motion.div>

          {/* Technical Skills Grid */}
          <motion.div
            ref={stackRef}
            style={{ opacity: stackOpacity, y: stackY }}
            className="space-y-8 pt-6 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1.5">
                <p className="text-xs font-mono uppercase tracking-widest text-red-500">
                  Technical Stack
                </p>
                <h2
                  style={{ textWrap: 'balance' }}
                  className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight text-white"
                >
                  Tools &amp; Technologies
                </h2>
              </div>

              {/* Filter Tabs with Smooth Shared-Layout Pill */}
              <div
                role="tablist"
                aria-label="Filter technical skills"
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#111116] border border-white/10 rounded-full self-start"
              >
                {SKILL_FILTERS.map((filter) => {
                  const isSelected = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveFilter(filter)}
                      className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                        isSelected ? 'text-zinc-950' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="skills-filter-pill"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                          className="absolute inset-0 bg-white rounded-full"
                        />
                      )}
                      <span className="relative z-10">{filter}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animated Layout Grid of Skill Cards */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill, idx) => {
                  const showPlaceholder =
                    skill.isPlaceholder || !skill.iconSrc || failedIcons[skill.id];

                  return (
                    <motion.article
                      layout
                      key={skill.id}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.94, y: -8 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(idx * 0.03, 0.16),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={prefersReducedMotion ? undefined : { y: -5 }}
                      className="group relative bg-[#101015] border border-white/10 hover:border-red-500/60 rounded-2xl p-6 transition-colors duration-200 flex flex-col justify-between gap-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {showPlaceholder ? (
                          <div
                            title="Placeholder icon — replace in src/data/portfolioData.ts"
                            className="w-16 h-16 rounded-xl border border-dashed border-zinc-600 bg-zinc-900/80 flex flex-col items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-2"
                          >
                            <span className="font-mono text-sm font-bold text-red-400">
                              {skill.placeholderCode || 'ICON'}
                            </span>
                            <span className="text-[9px] text-zinc-500 uppercase">Placeholder</span>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.08] p-2.5 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-2">
                            <img
                              src={skill.iconSrc}
                              alt={`${skill.name} icon`}
                              referrerPolicy="no-referrer"
                              onError={() =>
                                setFailedIcons((prev) => ({ ...prev, [skill.id]: true }))
                              }
                              className={`w-full h-full object-contain ${skill.iconClassName ?? ''}`}
                            />
                          </div>
                        )}

                        <span className="font-mono text-xs text-zinc-600 group-hover:text-red-500 transition-colors tabular-nums">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                          {skill.name}
                        </h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">{skill.focusNote}</p>
                        <p className="pt-1 text-[11px] text-zinc-500">
                          {skill.category}
                          {skill.isPlaceholder && ' · Asset placeholder'}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Bottom Corner Crimson Circular Arrows matching video 00:04 */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => cycleFilter(-1)}
                aria-label="Previous skill category"
                className="w-11 h-11 rounded-full bg-[#DC2626] hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                Showing {activeFilter} · {filteredSkills.length} items
              </p>

              <button
                type="button"
                onClick={() => cycleFilter(1)}
                aria-label="Next skill category"
                className="w-11 h-11 rounded-full bg-[#DC2626] hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
