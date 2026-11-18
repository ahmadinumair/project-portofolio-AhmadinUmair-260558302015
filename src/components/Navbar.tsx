import { useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  navTheme: 'light' | 'dark';
  onNavigateProjects?: () => void;
}

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export default function Navbar({ activeSection, navTheme, onNavigateProjects }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const isLight = navTheme === 'light';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 backdrop-blur-md border-b ${
        isLight
          ? 'bg-[#F6F6F7]/85 border-zinc-900/10 text-zinc-900'
          : 'bg-[#08080B]/85 border-white/10 text-zinc-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Monogram + Single-line Wordmark aligned flush top & bottom */}
        <a
          href="#home"
          className="inline-flex items-center gap-2.5 font-display font-bold uppercase tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-sm"
        >
          <span className="relative w-[45px] h-[18px] sm:w-[55px] sm:h-[22px] overflow-hidden shrink-0">
            <img
              src="/assets/profile/au-monogram.png"
              alt="AU logo"
              referrerPolicy="no-referrer"
              style={{
                width: '205%',
                height: '339%',
                left: '-52.5%',
                top: '-113%',
              }}
              className={`absolute max-w-none transition-all duration-300 ${
                isLight ? 'brightness-0' : 'brightness-100'
              }`}
            />
          </span>
          <span className="text-[24px] sm:text-[28px] leading-none tracking-tight">
            Ahmadin<span className="text-red-600">.</span>Umair
          </span>
        </a>

        {/* Zone 2: Clean single-line nav links with animated active indicator */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-3 lg:gap-4">
          {NAV_LINKS.map((link, index) => {
            const isActive = activeSection === link.id;
            return (
              <div key={link.id} className="flex items-center gap-3 lg:gap-4">
                <a
                  href={link.href}
                  onClick={(e) => {
                    if (link.id === 'projects' && onNavigateProjects) {
                      e.preventDefault();
                      onNavigateProjects();
                    }
                  }}
                  className={`relative py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-sm ${
                    isActive
                      ? isLight
                        ? 'text-zinc-950'
                        : 'text-white'
                      : isLight
                      ? 'text-zinc-500 hover:text-zinc-950'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      aria-hidden="true"
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-red-600 rounded-full"
                    />
                  )}
                </a>
                {index < NAV_LINKS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`text-xs ${isLight ? 'text-zinc-300' : 'text-zinc-700'}`}
                  >
                    ·
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className={`hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
              isLight
                ? 'bg-zinc-950 text-white hover:bg-red-600'
                : 'bg-white text-zinc-950 hover:bg-red-600 hover:text-white'
            }`}
          >
            Get in Touch
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
              isLight
                ? 'border-zinc-900/15 text-zinc-900 hover:bg-zinc-900/5'
                : 'border-white/15 text-zinc-100 hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Continuous Scroll Progress Hairline */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
        className="h-[2px] w-full bg-red-600"
      />

      {/* Smooth Animated Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Mobile Navigation"
            className={`md:hidden border-b px-5 py-4 ${
              isLight
                ? 'bg-[#F6F6F7]/95 border-zinc-900/10 text-zinc-900'
                : 'bg-[#08080B]/95 border-white/10 text-zinc-100'
            }`}
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (link.id === 'projects' && onNavigateProjects) {
                        e.preventDefault();
                        onNavigateProjects();
                      }
                    }}
                    className={`px-3 py-2.5 text-sm font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                      isActive
                        ? 'text-red-500 bg-red-600/10'
                        : isLight
                        ? 'text-zinc-700 hover:bg-zinc-900/5'
                        : 'text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded-full transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
