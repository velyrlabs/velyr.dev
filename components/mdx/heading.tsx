import type { ComponentProps } from "react";

export function H2({ id, children, ...props }: ComponentProps<"h2">) {
  return (
    <h2 id={id} {...props}>
      {children}
      {id ? <a className="heading-anchor" href={`#${id}`} aria-label="Link to this section">#</a> : null}
    </h2>
  );
}

export function H3({ id, children, ...props }: ComponentProps<"h3">) {
  return (
    <h3 id={id} {...props}>
      {children}
      {id ? <a className="heading-anchor" href={`#${id}`} aria-label="Link to this section">#</a> : null}
    </h3>
  );
}
