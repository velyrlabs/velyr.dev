"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { NavGroup } from "@/lib/navigation";
import { CloseIcon, MenuIcon } from "./icons";

type Section = { key: string; title: string; groups: NavGroup[] };

/** Drawer for narrow screens: top-level links plus every section's sidebar. */
export function MobileNav({ sections, extra }: { sections: Section[]; extra: { title: string; href: string; external?: boolean }[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  return (
    <>
      <button type="button" className="icon-button mobile-only" aria-label="Open navigation" onClick={() => dialog.current?.showModal()}>
        <MenuIcon />
      </button>
      <dialog
        ref={dialog}
        className="drawer"
        aria-label="Site navigation"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="drawer-panel">
          <div className="drawer-head">
            <span className="label">Navigation</span>
            <button type="button" className="icon-button" aria-label="Close navigation" onClick={() => dialog.current?.close()}>
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Mobile">
            {sections.map((section) => (
              <div key={section.key} className="drawer-section">
                <p className="label drawer-section-title">{section.title}</p>
                {section.groups.map((group, index) => (
                  <ul key={group.title ?? index} className="sidebar-list">
                    {group.title ? <li className="sidebar-group-title">{group.title}</li> : null}
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="sidebar-link" aria-current={pathname === item.href ? "page" : undefined}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            ))}
            <div className="drawer-section">
              <p className="label drawer-section-title">Resources</p>
              <ul className="sidebar-list">
                {extra.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a className="sidebar-link" href={link.href} target="_blank" rel="noreferrer">
                        {link.title}
                      </a>
                    ) : (
                      <Link className="sidebar-link" href={link.href}>
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}
