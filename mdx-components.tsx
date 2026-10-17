import type { MDXComponents } from "mdx/types";
import { Anchor } from "@/components/mdx/anchor";
import { Callout } from "@/components/mdx/callout";
import { CodeGroup } from "@/components/mdx/code-group";
import { H2, H3 } from "@/components/mdx/heading";
import { Pre } from "@/components/mdx/pre";
import { Status } from "@/components/mdx/status";
import { Steps } from "@/components/mdx/steps";
import { Table } from "@/components/mdx/table";

const components: MDXComponents = {
  a: Anchor,
  h2: H2,
  h3: H3,
  pre: Pre,
  table: Table,
  // An empty GFM corner header (`| | A | B |`) labels nothing; a plain cell keeps screen readers quiet.
  th: ({ children, ...props }) => (children ? <th {...props}>{children}</th> : <td {...props} />),
  Status,
  Callout,
  Steps,
  CodeGroup,
};

/** Global MDX components: content files use these without imports. */
export function useMDXComponents(): MDXComponents {
  return components;
}
