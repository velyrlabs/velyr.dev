"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "./icons";

export type ResourceLink = { title: string; href: string; external?: boolean };

export function ResourcesMenu({ links }: { links: ResourceLink[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="menu" ref={root}>
      <button type="button" className="nav-link menu-trigger" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>
        Resources <ChevronIcon />
      </button>
      {open ? (
        <ul className="menu-list">
          {links.map((link) =>
            link.external ? (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                  {link.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ) : (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.title}
                </Link>
              </li>
            ),
          )}
        </ul>
      ) : null}
    </div>
  );
}
