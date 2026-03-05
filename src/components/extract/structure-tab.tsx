import type { ComponentNode } from "@/lib/types";

interface StructureTabProps {
  readonly tree: readonly ComponentNode[];
}

function TreeNode({
  node,
  depth,
}: {
  readonly node: ComponentNode;
  readonly depth: number;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-2 border-b border-border/50 py-1.5 hover:bg-secondary/30"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        <span className="font-mono text-[10px] text-primary/60">
          {node.children.length > 0 ? "\u25BC" : "\u25AA"}
        </span>
        <span className="text-sm text-foreground">{node.name}</span>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          {node.type}
        </span>
      </div>
      {node.children.map((child, index) => (
        <TreeNode
          key={`${child.name}-${index}`}
          node={child}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export function StructureTab({ tree }: StructureTabProps) {
  if (tree.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <span className="font-mono text-sm text-muted-foreground">
          No component structure detected
        </span>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card">
      {tree.map((node, index) => (
        <TreeNode key={`${node.name}-${index}`} node={node} depth={0} />
      ))}
    </div>
  );
}
