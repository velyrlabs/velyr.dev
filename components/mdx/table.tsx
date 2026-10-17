import type { ComponentProps } from "react";

/** Wide tables scroll inside their own box so the page never scrolls sideways; focusable so keyboard users can scroll it. */
export function Table(props: ComponentProps<"table">) {
  return (
    <div className="table-wrap" tabIndex={0}>
      <table {...props} />
    </div>
  );
}
