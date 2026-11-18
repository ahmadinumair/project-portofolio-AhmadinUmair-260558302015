/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MarqueeDivider from './components/MarqueeDivider';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import ProjectTransitionOverlay, {
  ProjectTransitionStage,
} from './components/ProjectTransitionOverlay';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [navTheme, setNavTheme] = useState<'light' | 'dark'>('light');
  const [projectTransitionStage, setProjectTransitionStage] =
    useState<ProjectTransitionStage>('idle');
  const [projectsReplayKey, setProjectsReplayKey] = useState<number>(0);
  const transitionTimersRef = useRef<number[]>([]);

  const clearTransitionTimers = useCallback(() => {
    transitionTimersRef.current.forEach((id) => window.clearTimeout(id));
    transitionTimersRef.current = [];
  }, []);

  useEffect(() => clearTransitionTimers, [clearTransitionTimers]);

  const scrollToProjectsDirect = useCallback((instant: boolean) => {
    const projectsEl = document.getElementById('projects');
    if (!projectsEl) return;
    const targetTop = Math.max(
      window.scrollY + projectsEl.getBoundingClientRect().top - 52,
      0
    );
    window.scrollTo({
      top: targetTop,
      behavior: instant ? ('instant' as ScrollBehavior) : 'smooth',
    });
  }, []);

  const handleNavigateToProjects = useCallback(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      scrollToProjectsDirect(false);
      return;
    }

    if (projectTransitionStage !== 'idle') return;
    clearTransitionTimers();

    setProjectTransitionStage('entering');

    const swapTimer = window.setTimeout(() => {
      scrollToProjectsDirect(true);
      setProjectsReplayKey((prev) => prev + 1);
      setProjectTransitionStage('exiting');
    }, 360);

    const endTimer = window.setTimeout(() => {
      setProjectTransitionStage('idle');
    }, 820);

    transitionTimersRef.current = [swapTimer, endTimer];
  }, [clearTransitionTimers, projectTransitionStage, scrollToProjectsDirect]);

  useEffect(() => {
    const updateActiveAndTheme = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const homeEl = document.getElementById('home');
      const skillsEl = document.getElementById('skills');
      const projectsEl = document.getElementById('projects');
      const contactEl = document.getElementById('contact');

      const headerOffset = 64;

      if (contactEl && contactEl.getBoundingClientRect().top <= headerOffset + 40) {
        setActiveSection('contact');
        setNavTheme('dark');
        return;
      }

      if (projectsEl && projectsEl.getBoundingClientRect().top <= headerOffset + 40) {
        setActiveSection('projects');
        const cinemaStage = document.getElementById('projects-cinema-stage');
        if (cinemaStage) {
          const stageRect = cinemaStage.getBoundingClientRect();
          if (stageRect.top <= headerOffset + 24 && stageRect.bottom >= headerOffset + 24) {
            setNavTheme('dark');
            return;
          }
        }
        setNavTheme('light');
        return;
      }

      if (skillsEl && skillsEl.getBoundingClientRect().top <= headerOffset + 40) {
        setActiveSection('skills');
        setNavTheme('dark');
        return;
      }

      setActiveSection('home');
      // Switch navbar from light to dark smoothly right as Hero Beat 1 morphs into Beat 2
      if (homeEl) {
        const heroProgress = scrollY / Math.max(homeEl.offsetHeight - vh, 1);
        setNavTheme(heroProgress >= 0.36 ? 'dark' : 'light');
      } else {
        setNavTheme('light');
      }
    };

    updateActiveAndTheme();
    window.addEventListener('scroll', updateActiveAndTheme, { passive: true });
    window.addEventListener('resize', updateActiveAndTheme, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateActiveAndTheme);
      window.removeEventListener('resize', updateActiveAndTheme);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#08080B] text-zinc-100 overflow-x-clip">
        <Navbar
          activeSection={activeSection}
          navTheme={navTheme}
          onNavigateProjects={handleNavigateToProjects}
        />
        <ProjectTransitionOverlay stage={projectTransitionStage} />
        <main>
          <HeroSection />
          <MarqueeDivider />
          <SkillsSection />
          <ProjectsSection replayKey={projectsReplayKey} />
          <ContactSection />
        </main>
      </div>
    </MotionConfig>
  );
}
