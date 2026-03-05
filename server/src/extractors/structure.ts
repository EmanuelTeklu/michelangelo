import type { Page } from "playwright";
import type {
  StructureData,
  ComponentNode,
  RepeatingPattern,
  GridAnalysis,
} from "../types.js";

const MAX_DEPTH = 10;
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "LINK", "META"]);

interface RawNode {
  readonly tag: string;
  readonly classes: ReadonlyArray<string>;
  readonly layout: string;
  readonly width: number;
  readonly height: number;
  readonly children: ReadonlyArray<RawNode>;
}

interface RawGridInfo {
  readonly columns: number;
  readonly gap: string;
  readonly alignment: string;
}

interface RawStructureResult {
  readonly tree: RawNode;
  readonly totalElements: number;
  readonly maxDepth: number;
  readonly grids: ReadonlyArray<RawGridInfo>;
}

function classSignature(classes: ReadonlyArray<string>): string {
  return classes.slice(0, 3).join(".");
}

function findRepeatingPatterns(node: ComponentNode): ReadonlyArray<RepeatingPattern> {
  const signatures = new Map<string, number>();

  function walk(n: ComponentNode): void {
    const sig = `${n.tag}.${classSignature(n.classes)}`;
    signatures.set(sig, (signatures.get(sig) ?? 0) + 1);
    for (const child of n.children) {
      walk(child);
    }
  }

  walk(node);

  return Array.from(signatures.entries())
    .filter(([, count]) => count >= 3)
    .map(([selector, count]) => {
      const tag = selector.split(".")[0].toLowerCase();
      const type = inferPatternType(tag);
      return { selector, count, type };
    })
    .sort((a, b) => b.count - a.count);
}

function inferPatternType(tag: string): string {
  if (tag === "nav" || tag === "header") return "navigation";
  if (tag === "li" || tag === "ul" || tag === "ol") return "list";
  if (tag === "a") return "link";
  if (tag === "img" || tag === "picture") return "media";
  if (tag === "button" || tag === "input") return "interactive";
  if (tag === "div" || tag === "section" || tag === "article") return "container";
  return "element";
}

function normalizeLayout(layout: string): ComponentNode["layout"] {
  if (layout === "flex") return "flex";
  if (layout === "grid") return "grid";
  if (layout === "inline" || layout === "inline-block" || layout === "inline-flex")
    return "inline";
  if (layout === "block") return "block";
  return "other";
}

function toComponentNode(raw: RawNode): ComponentNode {
  return {
    tag: raw.tag,
    classes: raw.classes,
    layout: normalizeLayout(raw.layout),
    dimensions: { width: raw.width, height: raw.height },
    children: raw.children.map(toComponentNode),
  };
}

export async function extractStructure(page: Page): Promise<StructureData> {
  const raw = await page.evaluate(
    ({ maxDepth, skipTags }: { maxDepth: number; skipTags: ReadonlyArray<string> }): RawStructureResult => {
      let totalElements = 0;
      let observedMaxDepth = 0;
      const grids: RawGridInfo[] = [];

      function walkDom(el: Element, depth: number): RawNode | null {
        if (depth > maxDepth) return null;
        if (skipTags.includes(el.tagName)) return null;
        // Skip SVG internals
        if (el.tagName === "SVG" || el.closest("svg")) {
          return {
            tag: el.tagName.toLowerCase(),
            classes: Array.from(el.classList),
            layout: "other",
            width: 0,
            height: 0,
            children: [],
          };
        }

        totalElements++;
        observedMaxDepth = Math.max(observedMaxDepth, depth);

        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const layout = style.display;

        // Capture grid info
        if (layout === "grid") {
          const cols = style.gridTemplateColumns.split(" ").length;
          grids.push({
            columns: cols,
            gap: style.gap || "0px",
            alignment: style.alignItems || "stretch",
          });
        }

        const children: RawNode[] = [];
        for (const child of Array.from(el.children)) {
          const childNode = walkDom(child, depth + 1);
          if (childNode) children.push(childNode);
        }

        return {
          tag: el.tagName.toLowerCase(),
          classes: Array.from(el.classList),
          layout: layout.includes("flex")
            ? "flex"
            : layout === "grid"
              ? "grid"
              : layout.includes("inline")
                ? "inline"
                : "block",
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          children,
        };
      }

      const rootNode = walkDom(document.body, 0) ?? {
        tag: "body",
        classes: [],
        layout: "block",
        width: 0,
        height: 0,
        children: [],
      };

      return {
        tree: rootNode,
        totalElements,
        maxDepth: observedMaxDepth,
        grids,
      };
    },
    { maxDepth: MAX_DEPTH, skipTags: Array.from(SKIP_TAGS) }
  );

  const tree = toComponentNode(raw.tree);

  return {
    tree,
    repeatingPatterns: findRepeatingPatterns(tree),
    gridAnalysis: raw.grids.map(
      (g): GridAnalysis => ({
        columns: g.columns,
        gap: g.gap,
        alignment: g.alignment,
      })
    ),
    totalElements: raw.totalElements,
    maxDepth: raw.maxDepth,
  };
}
