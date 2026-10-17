import type { ComponentProps } from "react";
import { CopyButton } from "@/components/copy-button";

type PreProps = ComponentProps<"pre"> & {
  "data-title"?: string;
  "data-language"?: string;
  /** Set by CodeGroup: the tab already shows the title. */
  inGroup?: boolean;
};

export function Pre({ inGroup, ...props }: PreProps) {
  const title = props["data-title"];
  const language = props["data-language"];
  const label = inGroup ? "" : (title ?? (language && language !== "text" ? language : ""));
  return (
    <figure className="code-block" data-copy-root="">
      {label ? (
        <figcaption className="code-bar">
          <span className="code-title">{label}</span>
          <CopyButton />
        </figcaption>
      ) : (
        <div className="code-bar code-bar-floating">
          <CopyButton />
        </div>
      )}
      <pre {...props} tabIndex={0} />
    </figure>
  );
}
