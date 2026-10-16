'use client';

import React, { useState, useEffect } from 'react';

export interface TOCSection {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: TOCSection[];
  activeId?: string;
  className?: string;
}

export default function TableOfContents({
  sections,
  activeId: controlledActiveId,
  className = '',
}: TableOfContentsProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    controlledActiveId || (sections[0]?.id ?? '')
  );

  // Update when controlled prop changes
  useEffect(() => {
    if (controlledActiveId) {
      setActiveSectionId(controlledActiveId);
    }
  }, [controlledActiveId]);

  // IntersectionObserver to dynamically detect active section while reading
  useEffect(() => {
    if (controlledActiveId) return; // Handled externally

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the first intersecting entry or top-most visible
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        // Pick the top one
        const topEntry = visibleEntries.reduce((prev, curr) =>
          prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
        );
        setActiveSectionId(topEntry.target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 1],
    });

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections, controlledActiveId]);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // offset for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
      // Update hash without jumping
      if (window.history.pushState) {
        window.history.pushState(null, '', `#${id}`);
      }
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <nav
      aria-label="فهرس محتويات المقال"
      className={`bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-xl space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-sm">📑</span>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
            فهرس محتويات المقال
          </h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full">
          {sections.length} محاور
        </span>
      </div>

      <ul className="space-y-1.5 text-xs font-medium">
        {sections.map((section, index) => {
          const isActive = activeSectionId === section.id;
          const sectionNumber = String(index + 1).padStart(2, '0');

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => scrollToSection(section.id, e)}
                className={`group flex items-start gap-3 py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold shadow-sm shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span
                  className={`shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                >
                  {sectionNumber}
                </span>
                <span className="leading-snug line-clamp-2">
                  {section.title}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
