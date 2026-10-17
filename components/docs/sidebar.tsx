"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/lib/navigation";

export function Sidebar({ title, groups }: { title: string; groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav className="sidebar" aria-label={`${title} pages`}>
      <p className="label sidebar-title">{title}</p>
      {groups.map((group, index) => (
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
    </nav>
  );
}
