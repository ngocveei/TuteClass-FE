import { useEffect, useRef, useState } from 'react';
import type { LandingFlowController, ShowcaseRole, ShowcaseTab } from '../types/landing.types';

export const landingRailItems = [
  { id: 's-hero', label: '01 · Trang đầu' },
  { id: 's-pain', label: '02 · Vấn đề' },
  { id: 's-solution', label: '03 · Giải pháp' },
  { id: 's-showcase', label: '04 · Demo' },
  { id: 's-start', label: '05 · Bắt đầu' },
] as const;

export function useLandingFlow(): LandingFlowController {
  const [activeSection, setActiveSection] = useState('s-hero');
  const [showcaseRole, setShowcaseRole] = useState<ShowcaseRole>('teacher');
  const [showcaseTab, setShowcaseTab] = useState<ShowcaseTab>('overview');
  const [startRole, setStartRole] = useState<ShowcaseRole>('teacher');
  const snapRootRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => {
    const snapRoot = snapRootRef.current;
    if (!snapRoot) return undefined;
    const sections = snapRoot.querySelectorAll('.snap-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { root: snapRoot, threshold: 0.55 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return {
    activeSection, showcaseRole, showcaseTab, startRole, snapRootRef,
    railItems: landingRailItems, scrollToSection, setShowcaseRole, setShowcaseTab, setStartRole,
  };
}
