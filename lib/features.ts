export type FeatureStatus = "available" | "experimental" | "planned";

export type Feature = {
  title: string;
  body: string;
  status: FeatureStatus;
  href: string;
};

// Statuses are conservative readings of velyr-core crates/; the coordinator reconciles them.
export const features: Feature[] = [
  {
    title: "Deny-by-default permissions",
    body: "No filesystem, network, environment or process access unless a flag or velyr.json grants it. Deny rules win over allow rules.",
    status: "available",
    href: "/guide/permissions",
  },
  {
    title: "velyr run with ES modules",
    body: "Run .js and .mjs entries as ES modules: static and dynamic import, top-level await, bare ESM packages from node_modules.",
    status: "available",
    href: "/guide/modules",
  },
  {
    title: "Web APIs",
    body: "fetch, Streams with compression, Web Crypto, URL, TextEncoder, AbortController, MessageChannel, structuredClone and more.",
    status: "available",
    href: "/guide/web-apis",
  },
  {
    title: "Workers",
    body: "Module workers whose permissions can only narrow the parent's, with structured clone, ports, quotas and termination.",
    status: "available",
    href: "/guide/workers",
  },
  {
    title: "Resource quotas",
    body: "Limits on open files, sockets, listeners, workers, timers and body bytes, enforced per isolate.",
    status: "available",
    href: "/config",
  },
  {
    title: "Stable error codes",
    body: "Failures carry a VELYR_ code and a message that never echoes the denied path, host or variable.",
    status: "available",
    href: "/guide/errors",
  },
  {
    title: "TypeScript",
    body: "Type stripping through Oxc with source maps, no type checking. The crate exists; the CLI does not use it yet.",
    status: "experimental",
    href: "/guide/modules",
  },
  {
    title: "Native engine",
    body: "An Oxc front-end, register bytecode and an in-house VM and collector. Opt in with --engine native in feature-gated builds; V8 is the default.",
    status: "experimental",
    href: "/guide/roadmap",
  },
  {
    title: "Multicore serve",
    body: "Velyr.serve and velyr serve --workers: one process that spreads isolates across cores.",
    status: "planned",
    href: "/guide/server",
  },
  {
    title: "Node compatibility and WASM plugins",
    body: "node: modules, Buffer and process as an opt-in layer; sandboxed WebAssembly plugins.",
    status: "planned",
    href: "/guide/node-compat",
  },
];
