import Link from "next/link";
import type { ComponentProps } from "react";

export function Anchor({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/")) return <Link href={href} {...props} />;
  if (href.startsWith("#")) return <a href={href} {...props} />;
  return <a href={href} target="_blank" rel="noreferrer" {...props} />;
}
