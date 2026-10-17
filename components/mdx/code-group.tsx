import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { CodeTabs } from "./code-tabs";

type PreElement = ReactElement<{ "data-title"?: string; "data-language"?: string; inGroup?: boolean }>;

/** Server side: reads each fenced block's `title` meta to label the tabs. */
export function CodeGroup({ children }: { children: ReactNode }) {
  const blocks = Children.toArray(children).filter(isValidElement) as PreElement[];
  const labels = blocks.map((block, index) => block.props["data-title"] ?? block.props["data-language"] ?? `Example ${index + 1}`);
  const panels = blocks.map((block) => cloneElement(block, { inGroup: true }));
  return <CodeTabs labels={labels} panels={panels} />;
}
