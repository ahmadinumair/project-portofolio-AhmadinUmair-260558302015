import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Plus,
  X,
} from 'lucide-react';
import {
  PROFILE_INFO,
  PROJECTS,
  ProjectCategory,
  ProjectItem,
  ProjectScreen,
} from '../data/portfolioData';

type ProjectFilter = 'All' | ProjectCategory;
type StageViewMode = 'strips' | 'spotlight';

const PROJECT_FILTERS: ProjectFilter[] = ['All', 'Web App', 'Landing Page', 'Dashboard UI'];

interface GalleryTile {
  id: string;
  project: ProjectItem;
  screenIndex: number;
  screen: ProjectScreen;
  objectPositionClass?: string;
}

interface DesktopSlotStyle {
  positionClass: string;
  aspectClass: string;
  depth: 'fast' | 'medium' | 'slow' | 'counter';
}

// Staggered spatial layout matching the reference video (00:03 - 00:05 & 00:14 - 00:15)
const GALLERY_SPATIAL_SLOTS: DesktopSlotStyle[] = [
  // 0: Mid-left dominant frame (next to centered "Gallery")
  { positionClass: 'left-[10%] top-[24%] w-[26%] z-10', aspectClass: 'aspect-[4/3]', depth: 'fast' },
  // 1: Upper-right featured frame
  { positionClass: 'right-[12%] top-[10%] w-[27%] z-10', aspectClass: 'aspect-[16/10]', depth: 'slow' },
  // 2: Bottom-center-right mid frame
  { positionClass: 'left-[48%] top-[60%] w-[23%] z-10', aspectClass: 'aspect-[16/10]', depth: 'medium' },
  // 3: Top-left small distant frame
  { positionClass: 'left-[1%] top-[6%] w-[15%] z-[5]', aspectClass: 'aspect-[16/10]', depth: 'counter' },
  // 4: Bottom-left overlapping inset frame (foreground depth)
  { positionClass: 'left-[22%] top-[64%] w-[17%] z-20', aspectClass: 'aspect-[16/10]', depth: 'fast' },
  // 5: Far-right edge accent frame
  { positionClass: 'right-[-2%] top-[52%] w-[16%] z-[5]', aspectClass: 'aspect-[16/10]', depth: 'counter' },
];

interface ProjectsSectionProps {
  replayKey?: number;
}

export default function ProjectsSection({ replayKey = 0 }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const entranceRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');
  const [viewMode, setViewMode] = useState<StageViewMode>('strips');
  const [activeProjectId, setActiveProjectId] = useState<string>(PROJECTS[0].id);
  const [hoveredStripId, setHoveredStripId] = useState<string | null>(null);
  const [spotlightScreenIdx, setSpotlightScreenIdx] = useState<number>(0);

  // Lightbox modal state
  const [lightboxState, setLightboxState] = useState<{
    project: ProjectItem;
    screenIndex: number;
  } | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (replayKey > 0) {
      setViewMode('strips');
      setActiveFilter('All');
      setSpotlightScreenIdx(0);
    }
  }, [replayKey]);

  // Scroll-linked header kinetic split ("Projects by Umair") — bidirectional entrance & exit
  const { scrollYProgress: headerProgress } = useScroll({
    target: headerRef,
    offset: ['start end', 'end start'],
  });
  const smoothHeaderProgress = useSpring(headerProgress, {
    stiffness: 115,
    damping: 25,
    mass: 0.34,
  });
  const lineOneX = useTransform(
    smoothHeaderProgress,
    [0, 0.34, 0.68, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [32, 0, 0, -32]
  );
  const lineTwoX = useTransform(
    smoothHeaderProgress,
    [0, 0.34, 0.68, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [-32, 0, 0, 32]
  );
  const headerOpacity = useTransform(
    smoothHeaderProgress,
    [0, 0.25, 0.74, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.15, 1, 1, 0.15]
  );
  const headerY = useTransform(
    smoothHeaderProgress,
    [0, 0.32, 0.7, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [22, 0, 0, -22]
  );

  // Scroll-linked Motion-Graphic Aperture Entrance & Exit for #projects-cinema-stage
  const { scrollYProgress: entranceProgress } = useScroll({
    target: entranceRef,
    offset: ['start 96%', 'end 8%'],
  });
  const smoothEntrance = useSpring(entranceProgress, {
    stiffness: 115,
    damping: 25,
    mass: 0.32,
  });
  const stageScale = useTransform(
    smoothEntrance,
    [0, 0.22, 0.8, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.93, 1, 1, 0.94]
  );
  const stageY = useTransform(
    smoothEntrance,
    [0, 0.22, 0.8, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [42, 0, 0, -38]
  );
  const stageOpacity = useTransform(
    smoothEntrance,
    [0, 0.18, 0.84, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.25, 1, 1, 0.22]
  );
  const stageClipPath = useTransform(smoothEntrance, (p) => {
    if (prefersReducedMotion) return 'inset(0% 0% 0% 0%)';
    let insetRatio = 0;
    if (p < 0.22) {
      insetRatio = 1 - p / 0.22;
    } else if (p > 0.8) {
      insetRatio = (p - 0.8) / 0.2;
    }
    const clamped = Math.min(Math.max(insetRatio, 0), 1);
    return `inset(${(clamped * 3.4).toFixed(2)}% ${(clamped * 4.4).toFixed(2)}% ${(clamped * 3.4).toFixed(2)}% ${(clamped * 4.4).toFixed(2)}%)`;
  });
  const topWipeScaleX = useTransform(
    smoothEntrance,
    [0.03, 0.22, 0.78, 0.96],
    prefersReducedMotion ? [1, 1, 1, 1] : [0, 1, 1, 0]
  );
  const bottomWipeScaleX = useTransform(
    smoothEntrance,
    [0.04, 0.24, 0.72, 0.94],
    prefersReducedMotion ? [1, 1, 1, 1] : [0, 0.35, 1, 0]
  );

  const filteredProjects = useMemo(
    () =>
      activeFilter === 'All'
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === activeFilter),
    [activeFilter]
  );

  const activeProject = useMemo(
    () =>
      filteredProjects.find((p) => p.id === activeProjectId) ||
      filteredProjects[0] ||
      PROJECTS[0],
    [filteredProjects, activeProjectId]
  );

  const activeProjectIndex = Math.max(
    filteredProjects.findIndex((p) => p.id === activeProject.id),
    0
  );

  const handleSelectStrip = (project: ProjectItem) => {
    setActiveProjectId(project.id);
    setSpotlightScreenIdx(0);
    setViewMode('spotlight');
  };

  const handleBackToStrips = () => {
    setViewMode('strips');
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleStepSpotlightProject = useCallback(
    (delta: 1 | -1) => {
      if (filteredProjects.length <= 1) return;
      const nextIdx =
        (activeProjectIndex + delta + filteredProjects.length) % filteredProjects.length;
      setActiveProjectId(filteredProjects[nextIdx].id);
      setSpotlightScreenIdx(0);
    },
    [filteredProjects, activeProjectIndex]
  );

  const handleExploreProjectGallery = () => {
    document
      .getElementById('opened-project-gallery')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openLightbox = (project: ProjectItem, screenIndex = 0) => {
    setLightboxState({ project, screenIndex });
  };

  useEffect(() => {
    if (!lightboxState) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxState(null);
      } else if (event.key === 'ArrowRight') {
        setLightboxState((prev) => {
          if (!prev) return null;
          const total = prev.project.gallery.length;
          return {
            project: prev.project,
            screenIndex: (prev.screenIndex + 1) % total,
          };
        });
      } else if (event.key === 'ArrowLeft') {
        setLightboxState((prev) => {
          if (!prev) return null;
          const total = prev.project.gallery.length;
          return {
            project: prev.project,
            screenIndex: (prev.screenIndex - 1 + total) % total,
          };
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxState]);

  const markImageFailed = (key: string) => {
    setFailedImages((prev) => ({ ...prev, [key]: true }));
  };

  const currentSpotlightScreen =
    activeProject.gallery[spotlightScreenIdx] || activeProject.gallery[0];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-[#F6F6F7] grid-light text-zinc-950 pt-16 sm:pt-24 pb-20 sm:pb-28 overflow-x-clip"
    >
      {/* ACT 1: Light Editorial Title Header ("Projects by Umair") */}
      <motion.div
        ref={headerRef}
        style={{ opacity: headerOpacity, y: headerY }}
        className="max-w-6xl mx-auto px-5 sm:px-8 space-y-6 pb-12 sm:pb-16"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 tabular-nums">
            Archive 01—{String(PROJECTS.length).padStart(2, '0')}
          </span>
          <div className="max-w-xs text-right text-xs text-zinc-600 leading-relaxed">
            <p className="font-mono uppercase tracking-widest text-zinc-900 font-semibold mb-1">
              Selected Work
            </p>
            <p>
              Interactive web applications, landing concepts, and UI dashboards designed while
              studying software engineering.
            </p>
          </div>
        </div>

        <div className="py-2 space-y-1 overflow-hidden">
          <motion.div
            style={{ x: lineOneX }}
            className="flex items-baseline justify-center gap-4"
          >
            <span className="font-display text-[clamp(3.2rem,9.5vw,6.8rem)] font-bold uppercase tracking-tight leading-[0.88] text-zinc-950">
              Projects
            </span>
          </motion.div>
          <motion.div
            style={{ x: lineTwoX }}
            className="flex items-baseline justify-center gap-3 sm:gap-5"
          >
            <span className="text-sm sm:text-base font-medium italic text-zinc-500">by</span>
            <span className="font-display text-[clamp(3.2rem,9.5vw,6.8rem)] font-bold uppercase tracking-tight leading-[0.88] text-zinc-950">
              Umair
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* ACT 2 & ACT 3: Matte Obsidian Reference Canvas with Bidirectional Scroll Aperture */}
      <div
        id="projects-cinema-stage"
        ref={entranceRef}
        className="relative mx-auto max-w-[1380px] sm:px-5 lg:px-8"
      >
        <motion.div
          style={{
            scale: stageScale,
            y: stageY,
            opacity: stageOpacity,
            clipPath: stageClipPath,
          }}
          className="relative bg-[#111113] text-zinc-100 border-y sm:border border-white/10 shadow-[0_32px_90px_rgba(8,8,11,0.42)] overflow-hidden"
        >
          {/* Top & Bottom Crimson Motion-Graphic Wipe Hairlines */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: topWipeScaleX, transformOrigin: 'center' }}
            className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent z-30 pointer-events-none"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleX: bottomWipeScaleX, transformOrigin: 'center' }}
            className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent z-30 pointer-events-none"
          />

          {/* Continuous Vertical Architectural Hairline Columns matching reference video */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid grid-cols-2 lg:grid-cols-6"
          >
            <div className="border-r border-white/[0.05] h-full" />
            <div className="border-r border-white/[0.05] h-full hidden lg:block" />
            <div className="border-r border-white/[0.05] h-full hidden lg:block" />
            <div className="border-r border-white/[0.05] h-full hidden lg:block" />
            <div className="border-r border-white/[0.05] h-full hidden lg:block" />
            <div className="h-full" />
          </div>

          {/* ACT 2: Studio Header + Left Sidebar Rail + Vertical Strips / Widescreen Hero */}
          <div
            ref={stageRef}
            className="relative z-10 px-5 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-10 sm:pb-14"
          >
            {/* Internal Studio Top Bar matching reference video (00:00) */}
            <motion.div
              key={`studio-bar-${replayKey}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: -14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between gap-4 pb-8"
            >
              <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                <span className="relative w-[34px] h-[14px] overflow-hidden shrink-0">
                  <img
                    src="/assets/profile/au-monogram.png"
                    alt="AU"
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
                <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  Archive
                </span>
              </div>

              <span className="font-display text-xl sm:text-2xl font-bold uppercase tracking-[0.16em] text-[#E50914]">
                PROJECTS
              </span>

              {/* Profile lockup mirroring top-right of reference video */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="w-7 h-7 rounded-full overflow-hidden border border-white/15 bg-zinc-900 shrink-0">
                  <img
                    src={PROFILE_INFO.portraitSrc}
                    alt={PROFILE_INFO.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </span>
                <span className="hidden sm:inline text-xs font-medium text-zinc-300">
                  {PROFILE_INFO.fullName}
                </span>
              </div>
            </motion.div>

            {/* Stage Layout: Left Sidebar Rail + Right Strip/Widescreen Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr] gap-6 lg:gap-8 items-center min-h-[440px]">
              {/* Left Sidebar Navigation Rail */}
              <motion.aside
                key={`rail-${replayKey}`}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.12 }}
                transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex lg:flex-col justify-between gap-4 lg:gap-6 self-start lg:pt-8"
              >
                <nav
                  aria-label="Filter projects by category"
                  className="flex flex-wrap lg:flex-col gap-3"
                >
                  {PROJECT_FILTERS.map((filter) => {
                    const isSelected = activeFilter === filter;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => {
                          setActiveFilter(filter);
                          const firstMatch =
                            filter === 'All'
                              ? PROJECTS[0]
                              : PROJECTS.find((p) => p.category === filter);
                          if (firstMatch) {
                            setActiveProjectId(firstMatch.id);
                            setSpotlightScreenIdx(0);
                          }
                        }}
                        className={`relative text-left text-[11px] font-mono uppercase tracking-[0.18em] transition-colors whitespace-nowrap py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xs ${
                          isSelected ? 'text-white font-semibold' : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-opacity ${
                              isSelected ? 'bg-[#E50914] opacity-100' : 'opacity-0'
                            }`}
                          />
                          <span>{filter}</span>
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {viewMode === 'spotlight' && (
                  <button
                    type="button"
                    onClick={handleBackToStrips}
                    className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-400 hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>All Strips</span>
                  </button>
                )}
              </motion.aside>

              {/* Right Interactive Canvas: Vertical Strips OR Expanded Widescreen Spotlight */}
              <div className="min-w-0">
                <AnimatePresence mode="wait">
                  {viewMode === 'strips' ? (
                    <motion.div
                      key={`strips-${activeFilter}-${replayKey}`}
                      initial={prefersReducedMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.985 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Tall Narrow Vertical Strips matching video 00:00 & 00:07–00:10 */}
                      <div
                        className={`grid gap-2.5 sm:gap-3 ${
                          filteredProjects.length <= 2
                            ? 'grid-cols-2'
                            : filteredProjects.length === 3
                            ? 'grid-cols-1 sm:grid-cols-3'
                            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                        }`}
                      >
                        {filteredProjects.map((project, idx) => {
                          const isHovered = hoveredStripId === project.id;
                          const isDimmed = hoveredStripId !== null && !isHovered;

                          return (
                            <motion.button
                              key={`${project.id}-${replayKey}`}
                              type="button"
                              onClick={() => handleSelectStrip(project)}
                              onMouseEnter={() => setHoveredStripId(project.id)}
                              onMouseLeave={() => setHoveredStripId(null)}
                              initial={
                                prefersReducedMotion
                                  ? false
                                  : { opacity: 0, y: -44, clipPath: 'inset(0% 0% 100% 0%)' }
                              }
                              whileInView={{
                                opacity: 1,
                                y: 0,
                                clipPath: 'inset(0% 0% 0% 0%)',
                              }}
                              viewport={{ once: false, amount: 0.06 }}
                              transition={{
                                duration: 0.58,
                                delay: idx * 0.065,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className={`group relative text-center h-[260px] sm:h-[380px] lg:h-[440px] rounded-none overflow-hidden bg-[#0A0A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                                isHovered ? 'z-10' : ''
                              }`}
                            >
                              {/* Crimson Motion-Graphic Shutter Wipe Edge */}
                              {!prefersReducedMotion && (
                                <motion.span
                                  aria-hidden="true"
                                  initial={{ y: '0%', opacity: 0.95 }}
                                  whileInView={{ y: '105%', opacity: 0 }}
                                  viewport={{ once: false, amount: 0.06 }}
                                  transition={{
                                    duration: 0.5,
                                    delay: idx * 0.065 + 0.03,
                                    ease: [0.22, 1, 0.36, 1],
                                  }}
                                  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#E50914] via-[#E50914]/40 to-transparent z-20"
                                />
                              )}
                              <div
                                className={`w-full h-full transition-opacity duration-200 ${
                                  isDimmed ? 'opacity-55' : 'opacity-100'
                                }`}
                              >
                                {!failedImages[project.id] ? (
                                  <img
                                    src={project.thumbnailSrc}
                                    alt={project.title}
                                    referrerPolicy="no-referrer"
                                    onError={() => markImageFailed(project.id)}
                                    className={`w-full h-full object-cover object-left-top transition-all duration-500 ease-out ${
                                      isHovered
                                        ? 'scale-[1.05] brightness-100 saturate-105'
                                        : 'brightness-[0.52] saturate-[0.82]'
                                    }`}
                                  />
                                ) : (
                                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center p-4 text-sm text-zinc-400">
                                    {project.title}
                                  </div>
                                )}
                              </div>

                              {/* Subtle vignette for centered vertical text legibility */}
                              <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/65 transition-opacity duration-300"
                              />

                              {/* Minimal Centered Label matching video 00:00 ("Action & Adventure", "Sci-Fi & Fantasy") */}
                              <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  {project.category}
                                </span>
                                <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                                  {project.title}
                                </h3>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ) : (
                    /* Widescreen Expanded Hero matching video 00:01–00:03 & 00:11–00:13 */
                    <motion.div
                      key={`spotlight-${activeProject.id}`}
                      initial={
                        prefersReducedMotion
                          ? false
                          : { opacity: 0, scaleX: 0.35, scaleY: 0.96 }
                      }
                      animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                      exit={
                        prefersReducedMotion
                          ? undefined
                          : { opacity: 0, scaleX: 0.5, scaleY: 0.96 }
                      }
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="relative rounded-none overflow-hidden bg-[#08080A] min-h-[420px] sm:min-h-[460px] flex flex-col justify-between"
                    >
                      {/* Full-bleed Widescreen Screenshot */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${activeProject.id}-${spotlightScreenIdx}`}
                          initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.03 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0"
                        >
                          {!failedImages[currentSpotlightScreen.src] ? (
                            <img
                              src={currentSpotlightScreen.src}
                              alt={`${activeProject.title} — ${currentSpotlightScreen.label}`}
                              referrerPolicy="no-referrer"
                              onError={() => markImageFailed(currentSpotlightScreen.src)}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                              {activeProject.title}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {/* Clean Cinematic Left & Bottom Scrims */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-[#111113]/92 via-[#111113]/60 to-transparent"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#111113]/90 via-transparent to-[#111113]/25"
                      />

                      {/* Top Corner Controls: Project Switcher & Screen Dots */}
                      <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between gap-4">
                        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                          {activeProject.category} · {activeProject.year}
                        </span>

                        <div className="flex items-center gap-3">
                          {activeProject.gallery.length > 1 && (
                            <div className="flex items-center gap-1.5">
                              {activeProject.gallery.map((scr, idx) => (
                                <button
                                  key={scr.src}
                                  type="button"
                                  onClick={() => setSpotlightScreenIdx(idx)}
                                  aria-label={`View ${scr.label}`}
                                  className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                                    idx === spotlightScreenIdx
                                      ? 'w-5 bg-[#E50914]'
                                      : 'w-1.5 bg-white/35 hover:bg-white/70'
                                  }`}
                                />
                              ))}
                            </div>
                          )}

                          {filteredProjects.length > 1 && (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStepSpotlightProject(-1)}
                                aria-label="Previous project"
                                className="w-7 h-7 rounded-full border border-white/25 hover:border-white text-white/80 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStepSpotlightProject(1)}
                                aria-label="Next project"
                                className="w-7 h-7 rounded-full border border-white/25 hover:border-white text-white/80 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle-Left Display Title matching "Interstellar" in video 00:02 */}
                      <div className="relative z-10 px-6 sm:px-10 my-auto py-8 max-w-xl space-y-3">
                        <h3
                          style={{ textWrap: 'balance' }}
                          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-white"
                        >
                          {activeProject.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-200/90 leading-relaxed max-w-md">
                          {activeProject.summary}
                        </p>
                      </div>

                      {/* Bottom Dual Controls matching "Watch (→)" & "Add to My List (+)" in video 00:02 */}
                      <div className="relative z-10 px-6 sm:px-10 pb-6 sm:pb-8 flex flex-wrap items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={handleExploreProjectGallery}
                          className="group inline-flex items-center gap-3 text-xs sm:text-sm font-medium text-white hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full"
                        >
                          <span>Gallery</span>
                          <span className="w-8 h-8 rounded-full border border-white/45 group-hover:border-[#E50914] group-hover:bg-[#E50914] inline-flex items-center justify-center transition-colors">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </button>

                        <div className="flex items-center gap-5">
                          <button
                            type="button"
                            onClick={() => openLightbox(activeProject, spotlightScreenIdx)}
                            className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium text-zinc-200 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full"
                          >
                            <span>Inspect Screens</span>
                            <span className="w-8 h-8 rounded-full border border-white/45 group-hover:border-white inline-flex items-center justify-center transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                            </span>
                          </button>

                          {activeProject.githubUrl && (
                            <a
                              href={activeProject.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${activeProject.title} GitHub`}
                              className="w-8 h-8 rounded-full border border-white/30 hover:border-white text-zinc-300 hover:text-white inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ACT 3: Pure Reference-Matched Parallax "Gallery" Canvas (ONLY opens when a project is opened) */}
          <AnimatePresence>
            {viewMode === 'spotlight' && (
              <ProjectParallaxGallery
                activeProject={activeProject}
                failedImages={failedImages}
                onImageError={markImageFailed}
                onOpenLightbox={openLightbox}
                onBackToStrips={handleBackToStrips}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Multi-Screen Full-Resolution Lightbox Modal */}
      <AnimatePresence>
        {lightboxState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/88 backdrop-blur-sm"
            onClick={() => setLightboxState(null)}
          >
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0A0A0D] text-white border border-white/15 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="sticky top-0 z-20 bg-[#0A0A0D]/95 backdrop-blur-md flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span>{lightboxState.project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{lightboxState.project.year}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums text-red-400">
                    Screen {String(lightboxState.screenIndex + 1).padStart(2, '0')} /{' '}
                    {String(lightboxState.project.gallery.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {lightboxState.project.gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxState((prev) =>
                            prev
                              ? {
                                  project: prev.project,
                                  screenIndex:
                                    (prev.screenIndex - 1 + prev.project.gallery.length) %
                                    prev.project.gallery.length,
                                }
                              : null
                          )
                        }
                        aria-label="Previous screen"
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxState((prev) =>
                            prev
                              ? {
                                  project: prev.project,
                                  screenIndex:
                                    (prev.screenIndex + 1) % prev.project.gallery.length,
                                }
                              : null
                          )
                        }
                        aria-label="Next screen"
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setLightboxState(null)}
                    aria-label="Close project details"
                    className="w-8 h-8 inline-flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-8 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${lightboxState.project.id}-${lightboxState.screenIndex}`}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#121218] border border-white/10">
                      <img
                        src={lightboxState.project.gallery[lightboxState.screenIndex].src}
                        alt={`${lightboxState.project.title} — ${
                          lightboxState.project.gallery[lightboxState.screenIndex].label
                        }`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain bg-[#08080B]"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-white">
                        {lightboxState.project.gallery[lightboxState.screenIndex].label}
                      </span>
                      <span className="text-zinc-400">
                        {lightboxState.project.gallery[lightboxState.screenIndex].caption}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Screen Switcher Thumbnails */}
                {lightboxState.project.gallery.length > 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {lightboxState.project.gallery.map((scr, idx) => {
                      const isActive = idx === lightboxState.screenIndex;
                      return (
                        <button
                          key={scr.src}
                          type="button"
                          onClick={() =>
                            setLightboxState({
                              project: lightboxState.project,
                              screenIndex: idx,
                            })
                          }
                          className={`group text-left rounded-lg p-1.5 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                            isActive
                              ? 'border-[#DC2626] bg-[#DC2626]/10'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                          }`}
                        >
                          <div className="aspect-[16/10] w-full rounded overflow-hidden bg-zinc-900 mb-1.5">
                            <img
                              src={scr.src}
                              alt={scr.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <p
                            className={`text-[11px] font-medium truncate ${
                              isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                            }`}
                          >
                            {scr.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <p className="text-xs font-mono uppercase tracking-wider text-red-400">
                    {lightboxState.project.subtitle}
                  </p>
                  <h3
                    id="project-modal-title"
                    className="font-display text-3xl font-bold uppercase tracking-tight text-white"
                  >
                    {lightboxState.project.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {lightboxState.project.details}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                      Technologies Used
                    </p>
                    <p className="text-xs font-mono text-red-400">
                      {lightboxState.project.technologies.join(' · ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {lightboxState.project.githubUrl && (
                      <a
                        href={lightboxState.project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded-full transition-colors whitespace-nowrap"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {lightboxState.project.demoUrl && (
                      <a
                        href={lightboxState.project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-200 border border-white/15 hover:border-white/30 rounded-full transition-colors whitespace-nowrap"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface ProjectParallaxGalleryProps {
  activeProject: ProjectItem;
  failedImages: Record<string, boolean>;
  onImageError: (src: string) => void;
  onOpenLightbox: (project: ProjectItem, screenIndex: number) => void;
  onBackToStrips: () => void;
}

function ProjectParallaxGallery({
  activeProject,
  failedImages,
  onImageError,
  onOpenLightbox,
  onBackToStrips,
}: ProjectParallaxGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ['start end', 'end start'],
  });
  const smoothGalleryProgress = useSpring(galleryProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.35,
  });

  const yFast = useTransform(
    smoothGalleryProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [64, -76]
  );
  const yMedium = useTransform(
    smoothGalleryProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [36, -42]
  );
  const ySlow = useTransform(
    smoothGalleryProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [18, -22]
  );
  const yCounter = useTransform(
    smoothGalleryProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-24, 30]
  );

  const galleryHeadingOpacity = useTransform(
    smoothGalleryProgress,
    [0, 0.25, 0.75, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.15, 1, 1, 0.15]
  );
  const galleryHeadingScale = useTransform(
    smoothGalleryProgress,
    [0, 0.28, 0.72, 1],
    prefersReducedMotion ? [1, 1, 1, 1] : [0.88, 1, 1, 0.9]
  );
  const galleryHeadingY = useTransform(
    smoothGalleryProgress,
    [0, 0.3, 0.7, 1],
    prefersReducedMotion ? [0, 0, 0, 0] : [26, 0, 0, -26]
  );

  const getDepthY = (depth: DesktopSlotStyle['depth']) => {
    switch (depth) {
      case 'fast':
        return yFast;
      case 'medium':
        return yMedium;
      case 'slow':
        return ySlow;
      case 'counter':
        return yCounter;
    }
  };

  // Build 6 spatial gallery tiles using all real screens of the opened project
  // (detail-focused crops fill outer accent slots when a project has 2-4 screens)
  const galleryTiles = useMemo<GalleryTile[]>(() => {
    const screens = activeProject.gallery;
    const base: GalleryTile[] = screens.map((screen, idx) => ({
      id: `${activeProject.id}-screen-${idx}`,
      project: activeProject,
      screenIndex: idx,
      screen,
      objectPositionClass: 'object-top',
    }));

    const detailCrops = ['object-left-bottom', 'object-right-top', 'object-center', 'object-bottom'];
    let extraIdx = 0;
    while (base.length < GALLERY_SPATIAL_SLOTS.length && screens.length > 0) {
      const sourceIdx = extraIdx % screens.length;
      base.push({
        id: `${activeProject.id}-detail-${extraIdx}`,
        project: activeProject,
        screenIndex: sourceIdx,
        screen: screens[sourceIdx],
        objectPositionClass: detailCrops[extraIdx % detailCrops.length],
      });
      extraIdx += 1;
    }

    return base.slice(0, GALLERY_SPATIAL_SLOTS.length);
  }, [activeProject]);

  return (
    <motion.div
      id="opened-project-gallery"
      ref={galleryRef}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 px-5 sm:px-8 lg:px-10 pt-10 sm:pt-14 pb-16 sm:pb-20"
    >
      {/* DESKTOP PARALLAX GALLERY STAGE matching video 00:03–00:06 & 00:14–00:15 */}
      <div className="hidden lg:block relative h-[680px] xl:h-[740px] w-full overflow-hidden">
        {/* Centered Pure Unboxed "Gallery" Title (bidirectional scroll scale & opacity) */}
        <motion.div
          style={{
            opacity: galleryHeadingOpacity,
            scale: galleryHeadingScale,
            y: galleryHeadingY,
          }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center z-30"
        >
          <h3 className="text-4xl xl:text-5xl font-medium tracking-tight text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)]">
            Gallery
          </h3>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.id}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative w-full h-full"
          >
            {galleryTiles.map((tile, idx) => {
              const slot = GALLERY_SPATIAL_SLOTS[idx];
              const parallaxY = getDepthY(slot.depth);

              return (
                <motion.button
                  key={tile.id}
                  type="button"
                  onClick={() => onOpenLightbox(tile.project, tile.screenIndex)}
                  style={{ y: parallaxY }}
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.05 }}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.03, zIndex: 40 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  aria-label={`Inspect ${tile.project.title} — ${tile.screen.label}`}
                  className={`group absolute ${slot.positionClass} ${slot.aspectClass} rounded-none overflow-hidden bg-[#09090B] shadow-[0_24px_60px_rgba(0,0,0,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500`}
                >
                  {!failedImages[tile.screen.src] ? (
                    <img
                      src={tile.screen.src}
                      alt={`${tile.project.title} — ${tile.screen.label}`}
                      referrerPolicy="no-referrer"
                      onError={() => onImageError(tile.screen.src)}
                      className={`w-full h-full object-cover ${
                        tile.objectPositionClass || 'object-top'
                      } transition-transform duration-500 group-hover:scale-105`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-xs text-zinc-400">
                      {tile.screen.label}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* MOBILE & TABLET RESPONSIVE GALLERY GRID (< lg) */}
      <div className="lg:hidden space-y-6">
        <div className="text-center py-2">
          <h3 className="text-3xl font-medium tracking-tight text-white">Gallery</h3>
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mt-1">
            {activeProject.title}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeProject.gallery.map((scr, idx) => (
            <motion.button
              key={`${activeProject.id}-mobile-${scr.src}`}
              type="button"
              onClick={() => onOpenLightbox(activeProject, idx)}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.05 }}
              transition={{
                duration: 0.35,
                delay: Math.min(idx * 0.05, 0.2),
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative aspect-[16/10] rounded-none overflow-hidden bg-[#09090B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <img
                src={scr.src}
                alt={`${activeProject.title} — ${scr.label}`}
                referrerPolicy="no-referrer"
                onError={() => onImageError(scr.src)}
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Subtle bottom return trigger */}
      <div className="pt-8 flex justify-center">
        <button
          type="button"
          onClick={onBackToStrips}
          className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#E50914]" />
          <span>Back to All Projects</span>
        </button>
      </div>
    </motion.div>
  );
}
