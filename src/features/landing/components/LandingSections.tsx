import type { PropsWithChildren } from 'react';

function Section({ id, className, children }: PropsWithChildren<{ id: string; className: string }>) {
  return <section id={id} className={`snap-section ${className}`}>{children}</section>;
}

export function HeroSection({ children }: PropsWithChildren) {
  return <Section id="s-hero" className="hero is-visible">{children}</Section>;
}
export function PainSection({ children }: PropsWithChildren) {
  return <Section id="s-pain" className="pain">{children}</Section>;
}
export function SolutionSection({ children }: PropsWithChildren) {
  return <Section id="s-solution" className="solution">{children}</Section>;
}
export function ShowcaseSection({ children }: PropsWithChildren) {
  return <Section id="s-showcase" className="showcase">{children}</Section>;
}
export function StartSection({ children }: PropsWithChildren) {
  return <Section id="s-start" className="start">{children}</Section>;
}
