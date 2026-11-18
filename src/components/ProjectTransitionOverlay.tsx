import { AnimatePresence, motion } from 'motion/react';

export type ProjectTransitionStage = 'idle' | 'entering' | 'exiting';

interface ProjectTransitionOverlayProps {
  stage: ProjectTransitionStage;
}

const SHUTTER_COLUMNS = [0, 1, 2, 3, 4];

export default function ProjectTransitionOverlay({ stage }: ProjectTransitionOverlayProps) {
  const isVisible = stage !== 'idle';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="project-motion-curtain"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[70] pointer-events-none overflow-hidden"
        >
          {/* 5 Staggered Architectural Shutter Blades matching the 5 Project Strips */}
          <div className="absolute inset-0 grid grid-cols-5">
            {SHUTTER_COLUMNS.map((col) => {
              const enterDelay = col * 0.035;
              const exitDelay = (SHUTTER_COLUMNS.length - 1 - col) * 0.032;

              return (
                <div key={col} className="relative h-full overflow-hidden">
                  {/* Leading Crimson Motion-Graphic Wipe Accent */}
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={
                      stage === 'entering'
                        ? { y: '0%' }
                        : { y: '-105%' }
                    }
                    transition={{
                      duration: stage === 'entering' ? 0.22 : 0.32,
                      delay: stage === 'entering' ? enterDelay * 0.68 : exitDelay,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                    className="absolute inset-0 bg-[#E50914]"
                  />

                  {/* Main Matte Obsidian Blade following slightly behind crimson edge */}
                  <motion.div
                    initial={{ y: '105%' }}
                    animate={
                      stage === 'entering'
                        ? { y: '0%' }
                        : { y: '-105%' }
                    }
                    transition={{
                      duration: stage === 'entering' ? 0.24 : 0.3,
                      delay: stage === 'entering' ? enterDelay * 0.68 + 0.02 : exitDelay - 0.012,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                    className="absolute inset-0 bg-[#0D0D10] border-r border-white/[0.06]"
                  />
                </div>
              );
            })}
          </div>

          {/* Center Motion-Graphic Typographic Lockup */}
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={
                stage === 'entering'
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: -20, scale: 1.03 }
              }
              transition={{
                duration: 0.24,
                delay: stage === 'entering' ? 0.1 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col items-center text-center gap-3"
            >
              <span className="relative w-[44px] h-[18px] overflow-hidden shrink-0">
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

              <span className="font-display text-4xl sm:text-6xl font-bold uppercase tracking-[0.2em] text-white leading-none">
                PROJECTS<span className="text-[#E50914]">.</span>
              </span>

              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: stage === 'entering' ? 1 : 0 }}
                transition={{
                  duration: 0.26,
                  delay: stage === 'entering' ? 0.12 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ transformOrigin: 'center' }}
                className="w-36 sm:w-48 h-[2px] bg-[#E50914] block"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
