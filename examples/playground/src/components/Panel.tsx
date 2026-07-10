import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  description?: string;
  wide?: boolean;
  children: ReactNode;
}

export function Panel({ title, description, wide, children }: PanelProps) {
  return (
    <article className={`panel ${wide ? 'panel--wide' : ''}`}>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {children}
    </article>
  );
}

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="demo-section" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="demo-section__title">
        {title}
      </h2>
      <div className="grid">{children}</div>
    </section>
  );
}
