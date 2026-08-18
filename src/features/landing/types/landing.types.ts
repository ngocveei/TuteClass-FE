import type { RefObject } from 'react';

export type ShowcaseRole = 'teacher' | 'student';
export type ShowcaseTab = 'overview' | 'schedule' | 'assignment' | 'documents' | 'discussion';

export interface LandingRailItem {
  readonly id: string;
  readonly label: string;
}

export interface LandingFlowController {
  activeSection: string;
  showcaseRole: ShowcaseRole;
  showcaseTab: ShowcaseTab;
  startRole: ShowcaseRole;
  snapRootRef: RefObject<HTMLElement | null>;
  railItems: readonly LandingRailItem[];
  scrollToSection: (id: string) => void;
  setShowcaseRole: (role: ShowcaseRole) => void;
  setShowcaseTab: (tab: ShowcaseTab) => void;
  setStartRole: (role: ShowcaseRole) => void;
}
