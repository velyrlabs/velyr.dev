import type { ThemeRegistrationRaw } from "shiki";

type Palette = {
  name: string;
  type: "dark" | "light";
  bg: string;
  fg: string;
  muted: string;
  keyword: string;
  string: string;
  number: string;
  type_: string;
  fn: string;
};

function theme(p: Palette): ThemeRegistrationRaw {
  return {
    name: p.name,
    type: p.type,
    colors: { "editor.background": p.bg, "editor.foreground": p.fg },
    settings: [
      { settings: { foreground: p.fg, background: p.bg } },
      { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: p.muted, fontStyle: "italic" } },
      {
        scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "keyword.control"],
        settings: { foreground: p.keyword },
      },
      { scope: ["string", "string.quoted", "string.template", "markup.inline.raw"], settings: { foreground: p.string } },
      {
        scope: ["constant.numeric", "constant.language", "constant.character", "support.constant", "variable.other.constant"],
        settings: { foreground: p.number },
      },
      { scope: ["entity.name.type", "support.type", "entity.name.class", "support.class"], settings: { foreground: p.type_ } },
      { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: p.fn } },
      { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: p.muted } },
      { scope: ["support.type.property-name", "meta.object-literal.key", "entity.name.tag"], settings: { foreground: p.fg } },
      { scope: ["variable.parameter", "variable.other"], settings: { foreground: p.fg } },
    ],
  };
}

// Dark: Bone on Ink Raised; Signal is reserved for keywords. Light: deepened tints keep 4.5:1 on the code ground.
export const velyrDark = theme({
  name: "velyr-dark",
  type: "dark",
  bg: "#1C1E19",
  fg: "#F2F0E9",
  muted: "#A6A99E",
  keyword: "#C6F432",
  string: "#DCE3C4",
  number: "#F2B636",
  type_: "#D8D5CA",
  fn: "#F2F0E9",
});

export const velyrLight = theme({
  name: "velyr-light",
  type: "light",
  bg: "#E8E6DE",
  fg: "#0E0F0C",
  muted: "#55584F",
  keyword: "#465C00",
  string: "#4B4A3A",
  number: "#7A4F00",
  type_: "#2F312B",
  fn: "#0E0F0C",
});
