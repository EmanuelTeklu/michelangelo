import type { ResolvedTokens, ComponentTemplate, TargetComponent } from "../types.js";

// ─── Shared Helpers ────────────────────────────────────────────────

function cssVars(tokens: ResolvedTokens): string {
  return [
    `--color-bg: ${tokens.colors.background};`,
    `--color-surface: ${tokens.colors.surface};`,
    `--color-text: ${tokens.colors.text};`,
    `--color-primary: ${tokens.colors.primary};`,
    `--color-secondary: ${tokens.colors.secondary};`,
    `--color-accent: ${tokens.colors.accent};`,
    `--color-border: ${tokens.colors.border};`,
    `--color-muted: ${tokens.colors.muted};`,
    `--font-data: '${tokens.typography.fontData}', monospace;`,
    `--font-ui: '${tokens.typography.fontUi}', sans-serif;`,
    `--radius: ${tokens.spacing.borderRadius};`,
    `--transition: ${tokens.behavior.transitionDuration} ${tokens.behavior.transitionTiming};`,
  ].join("\n    ");
}

function tailwindImport(tokens: ResolvedTokens): string {
  return [
    `// Design tokens from recombination`,
    `const tokens = {`,
    `  colors: {`,
    `    bg: "${tokens.colors.background}",`,
    `    surface: "${tokens.colors.surface}",`,
    `    text: "${tokens.colors.text}",`,
    `    primary: "${tokens.colors.primary}",`,
    `    secondary: "${tokens.colors.secondary}",`,
    `    accent: "${tokens.colors.accent}",`,
    `    border: "${tokens.colors.border}",`,
    `    muted: "${tokens.colors.muted}",`,
    `  },`,
    `  fonts: { data: "${tokens.typography.fontData}", ui: "${tokens.typography.fontUi}" },`,
    `  spacing: { gap: "${tokens.spacing.gap}", padding: "${tokens.spacing.padding}" },`,
    `  radius: "${tokens.spacing.borderRadius}",`,
    `} as const;`,
  ].join("\n");
}

// ─── Sidebar Template ──────────────────────────────────────────────

const sidebarTemplate: ComponentTemplate = {
  name: "sidebar",
  description: "Vertical navigation with icon+label items",
  generate: (tokens: ResolvedTokens) => `import React from "react";

${tailwindImport(tokens)}

interface NavItem {
  readonly icon: string;
  readonly label: string;
  readonly href: string;
  readonly active?: boolean;
}

interface SidebarProps {
  readonly items: ReadonlyArray<NavItem>;
  readonly title?: string;
}

export function Sidebar({ items, title = "Navigation" }: SidebarProps) {
  return (
    <aside
      className="flex flex-col h-full w-64 border-r"
      style={{
        backgroundColor: tokens.colors.bg,
        borderColor: tokens.colors.border,
        fontFamily: tokens.fonts.ui,
      }}
    >
      <div
        className="px-4 py-3 text-sm font-bold uppercase tracking-wider"
        style={{ color: tokens.colors.muted, fontFamily: tokens.fonts.data }}
      >
        {title}
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={\`flex items-center gap-3 px-3 py-2 text-sm rounded-[\${tokens.radius}] transition-colors\`}
                style={{
                  color: item.active ? tokens.colors.primary : tokens.colors.text,
                  backgroundColor: item.active ? tokens.colors.surface : "transparent",
                  transitionDuration: tokens.spacing.gap,
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}`,
  generateHtml: (tokens: ResolvedTokens) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    :root { ${cssVars(tokens)} }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-ui); }
    .sidebar { display: flex; flex-direction: column; height: 100vh; width: 16rem; border-right: 1px solid var(--color-border); }
    .sidebar-title { padding: 0.75rem 1rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); font-family: var(--font-data); }
    .nav-list { list-style: none; padding: 0 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; border-radius: var(--radius); color: var(--color-text); text-decoration: none; transition: background var(--transition), color var(--transition); }
    .nav-item:hover { background: var(--color-surface); color: var(--color-primary); }
    .nav-item.active { background: var(--color-surface); color: var(--color-primary); }
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="sidebar-title">Navigation</div>
    <nav><ul class="nav-list">
      <li><a href="#" class="nav-item active"><span>&#9632;</span><span>Dashboard</span></a></li>
      <li><a href="#" class="nav-item"><span>&#9650;</span><span>Analytics</span></a></li>
      <li><a href="#" class="nav-item"><span>&#9670;</span><span>Settings</span></a></li>
    </ul></nav>
  </aside>
</body>
</html>`,
};

// ─── Card Grid Template ────────────────────────────────────────────

const cardGridTemplate: ComponentTemplate = {
  name: "card-grid",
  description: "Responsive grid of cards with header/body/footer",
  generate: (tokens: ResolvedTokens) => `import React from "react";

${tailwindImport(tokens)}

interface CardData {
  readonly title: string;
  readonly body: string;
  readonly footer?: string;
}

interface CardGridProps {
  readonly cards: ReadonlyArray<CardData>;
  readonly columns?: 2 | 3 | 4;
}

export function CardGrid({ cards, columns = 3 }: CardGridProps) {
  const gridCols = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" } as const;

  return (
    <div
      className={\`grid \${gridCols[columns]} gap-4\`}
      style={{ padding: tokens.spacing.padding }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          className="flex flex-col rounded-lg border"
          style={{
            backgroundColor: tokens.colors.surface,
            borderColor: tokens.colors.border,
            borderRadius: tokens.radius,
          }}
        >
          <div
            className="px-4 py-3 text-sm font-semibold border-b"
            style={{
              color: tokens.colors.text,
              borderColor: tokens.colors.border,
              fontFamily: tokens.fonts.ui,
            }}
          >
            {card.title}
          </div>
          <div
            className="flex-1 px-4 py-3 text-sm"
            style={{
              color: tokens.colors.muted,
              fontFamily: tokens.fonts.data,
            }}
          >
            {card.body}
          </div>
          {card.footer && (
            <div
              className="px-4 py-2 text-xs border-t"
              style={{
                color: tokens.colors.muted,
                borderColor: tokens.colors.border,
              }}
            >
              {card.footer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}`,
  generateHtml: (tokens: ResolvedTokens) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    :root { ${cssVars(tokens)} }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-ui); padding: 1rem; }
    .card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: ${tokens.spacing.gap}; }
    .card { display: flex; flex-direction: column; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); }
    .card-header { padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 600; border-bottom: 1px solid var(--color-border); }
    .card-body { flex: 1; padding: 0.75rem 1rem; font-size: 0.875rem; color: var(--color-muted); font-family: var(--font-data); }
    .card-footer { padding: 0.5rem 1rem; font-size: 0.75rem; color: var(--color-muted); border-top: 1px solid var(--color-border); }
  </style>
</head>
<body>
  <div class="card-grid">
    <div class="card"><div class="card-header">Metrics</div><div class="card-body">Active: 2,847</div><div class="card-footer">Updated 5m ago</div></div>
    <div class="card"><div class="card-header">Coverage</div><div class="card-body">87.3%</div><div class="card-footer">Last scan: 2m</div></div>
    <div class="card"><div class="card-header">Alerts</div><div class="card-body">3 active</div><div class="card-footer">1 critical</div></div>
  </div>
</body>
</html>`,
};

// ─── Data Table Template ───────────────────────────────────────────

const dataTableTemplate: ComponentTemplate = {
  name: "data-table",
  description: "Table with header, rows, optional sorting indicators",
  generate: (tokens: ResolvedTokens) => `import React from "react";

${tailwindImport(tokens)}

interface Column {
  readonly key: string;
  readonly label: string;
  readonly sortable?: boolean;
}

interface DataTableProps {
  readonly columns: ReadonlyArray<Column>;
  readonly rows: ReadonlyArray<Record<string, string>>;
  readonly sortKey?: string;
  readonly sortDir?: "asc" | "desc";
}

export function DataTable({ columns, rows, sortKey, sortDir }: DataTableProps) {
  return (
    <div
      className="overflow-x-auto rounded-lg border"
      style={{
        borderColor: tokens.colors.border,
        borderRadius: tokens.radius,
      }}
    >
      <table className="w-full text-sm" style={{ fontFamily: tokens.fonts.data }}>
        <thead>
          <tr style={{ backgroundColor: tokens.colors.surface }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b"
                style={{
                  color: tokens.colors.muted,
                  borderColor: tokens.colors.border,
                  fontFamily: tokens.fonts.ui,
                }}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span className="ml-1">{sortDir === "asc" ? "\\u25B2" : "\\u25BC"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b transition-colors"
              style={{
                borderColor: tokens.colors.border,
                backgroundColor: i % 2 === 0 ? tokens.colors.bg : tokens.colors.surface,
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-2"
                  style={{ color: tokens.colors.text }}
                >
                  {row[col.key] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
  generateHtml: (tokens: ResolvedTokens) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    :root { ${cssVars(tokens)} }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-data); padding: 1rem; }
    .table-wrapper { overflow-x: auto; border: 1px solid var(--color-border); border-radius: var(--radius); }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    th { padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); background: var(--color-surface); border-bottom: 1px solid var(--color-border); font-family: var(--font-ui); }
    td { padding: 0.5rem 1rem; border-bottom: 1px solid var(--color-border); }
    tr:nth-child(even) { background: var(--color-surface); }
  </style>
</head>
<body>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Name</th><th>Status</th><th>Value</th></tr></thead>
      <tbody>
        <tr><td>Alpha</td><td>Active</td><td>94.2%</td></tr>
        <tr><td>Bravo</td><td>Pending</td><td>67.8%</td></tr>
        <tr><td>Charlie</td><td>Active</td><td>88.1%</td></tr>
      </tbody>
    </table>
  </div>
</body>
</html>`,
};

// ─── Stat Bar Template ─────────────────────────────────────────────

const statBarTemplate: ComponentTemplate = {
  name: "stat-bar",
  description: "Row of stat cards with label+value",
  generate: (tokens: ResolvedTokens) => `import React from "react";

${tailwindImport(tokens)}

interface Stat {
  readonly label: string;
  readonly value: string;
  readonly change?: string;
  readonly trend?: "up" | "down" | "flat";
}

interface StatBarProps {
  readonly stats: ReadonlyArray<Stat>;
}

export function StatBar({ stats }: StatBarProps) {
  const trendColor = (trend?: "up" | "down" | "flat") => {
    if (trend === "up") return "#22c55e";
    if (trend === "down") return "#ef4444";
    return tokens.colors.muted;
  };

  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: \`repeat(\${stats.length}, 1fr)\`,
        padding: tokens.spacing.padding,
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-col gap-1 rounded-lg border px-4 py-3"
          style={{
            backgroundColor: tokens.colors.surface,
            borderColor: tokens.colors.border,
            borderRadius: tokens.radius,
          }}
        >
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: tokens.colors.muted, fontFamily: tokens.fonts.ui }}
          >
            {stat.label}
          </span>
          <span
            className="text-2xl font-bold"
            style={{ color: tokens.colors.text, fontFamily: tokens.fonts.data }}
          >
            {stat.value}
          </span>
          {stat.change && (
            <span className="text-xs" style={{ color: trendColor(stat.trend) }}>
              {stat.change}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}`,
  generateHtml: (tokens: ResolvedTokens) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    :root { ${cssVars(tokens)} }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-ui); padding: 1rem; }
    .stat-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: ${tokens.spacing.gap}; }
    .stat-card { display: flex; flex-direction: column; gap: 0.25rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: 0.75rem 1rem; }
    .stat-label { font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted); }
    .stat-value { font-size: 1.5rem; font-weight: 700; font-family: var(--font-data); }
    .stat-change { font-size: 0.75rem; }
    .up { color: #22c55e; }
    .down { color: #ef4444; }
  </style>
</head>
<body>
  <div class="stat-bar">
    <div class="stat-card"><span class="stat-label">Total Users</span><span class="stat-value">12,847</span><span class="stat-change up">+12.3%</span></div>
    <div class="stat-card"><span class="stat-label">Revenue</span><span class="stat-value">$94.2K</span><span class="stat-change up">+8.1%</span></div>
    <div class="stat-card"><span class="stat-label">Uptime</span><span class="stat-value">99.97%</span><span class="stat-change up">+0.02%</span></div>
    <div class="stat-card"><span class="stat-label">Errors</span><span class="stat-value">23</span><span class="stat-change down">-5.4%</span></div>
  </div>
</body>
</html>`,
};

// ─── Hero Section Template ─────────────────────────────────────────

const heroSectionTemplate: ComponentTemplate = {
  name: "hero-section",
  description: "Large banner with heading, subtext, CTA",
  generate: (tokens: ResolvedTokens) => `import React from "react";

${tailwindImport(tokens)}

interface HeroSectionProps {
  readonly heading: string;
  readonly subtext: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly secondaryLabel?: string;
  readonly secondaryHref?: string;
}

export function HeroSection({
  heading,
  subtext,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: HeroSectionProps) {
  return (
    <section
      className="flex flex-col items-center justify-center text-center px-6 py-20"
      style={{ backgroundColor: tokens.colors.bg }}
    >
      <h1
        className="text-4xl font-bold tracking-tight mb-4"
        style={{ color: tokens.colors.text, fontFamily: tokens.fonts.ui }}
      >
        {heading}
      </h1>
      <p
        className="max-w-2xl text-lg mb-8"
        style={{ color: tokens.colors.muted, fontFamily: tokens.fonts.ui }}
      >
        {subtext}
      </p>
      <div className="flex items-center gap-4">
        <a
          href={ctaHref}
          className="px-6 py-3 text-sm font-semibold rounded-lg transition-opacity"
          style={{
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.bg,
            borderRadius: tokens.radius,
          }}
        >
          {ctaLabel}
        </a>
        {secondaryLabel && secondaryHref && (
          <a
            href={secondaryHref}
            className="px-6 py-3 text-sm font-semibold rounded-lg border transition-colors"
            style={{
              borderColor: tokens.colors.border,
              color: tokens.colors.text,
              borderRadius: tokens.radius,
            }}
          >
            {secondaryLabel}
          </a>
        )}
      </div>
    </section>
  );
}`,
  generateHtml: (tokens: ResolvedTokens) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    :root { ${cssVars(tokens)} }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-ui); }
    .hero { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 5rem 1.5rem; }
    .hero h1 { font-size: 2.25rem; font-weight: 700; letter-spacing: -0.025em; margin-bottom: 1rem; }
    .hero p { max-width: 42rem; font-size: 1.125rem; color: var(--color-muted); margin-bottom: 2rem; }
    .hero-actions { display: flex; align-items: center; gap: 1rem; }
    .btn-primary { padding: 0.75rem 1.5rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--radius); background: var(--color-primary); color: var(--color-bg); text-decoration: none; border: none; cursor: pointer; }
    .btn-secondary { padding: 0.75rem 1.5rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--radius); background: transparent; color: var(--color-text); text-decoration: none; border: 1px solid var(--color-border); cursor: pointer; }
  </style>
</head>
<body>
  <section class="hero">
    <h1>Mission Control</h1>
    <p>Real-time operational awareness for teams that move fast. Built for density, clarity, and precision.</p>
    <div class="hero-actions">
      <a href="#" class="btn-primary">Get Started</a>
      <a href="#" class="btn-secondary">Learn More</a>
    </div>
  </section>
</body>
</html>`,
};

// ─── Nav Bar Template ──────────────────────────────────────────────

const navBarTemplate: ComponentTemplate = {
  name: "nav-bar",
  description: "Horizontal top navigation with logo, links, actions",
  generate: (tokens: ResolvedTokens) => `import React from "react";

${tailwindImport(tokens)}

interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly active?: boolean;
}

interface NavBarProps {
  readonly logo: string;
  readonly links: ReadonlyArray<NavLink>;
  readonly actionLabel?: string;
  readonly actionHref?: string;
}

export function NavBar({ logo, links, actionLabel, actionHref }: NavBarProps) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{
        backgroundColor: tokens.colors.bg,
        borderColor: tokens.colors.border,
        fontFamily: tokens.fonts.ui,
      }}
    >
      <div className="flex items-center gap-8">
        <span
          className="text-lg font-bold"
          style={{ color: tokens.colors.primary, fontFamily: tokens.fonts.data }}
        >
          {logo}
        </span>
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm rounded-md transition-colors"
              style={{
                color: link.active ? tokens.colors.primary : tokens.colors.text,
                backgroundColor: link.active ? tokens.colors.surface : "transparent",
                borderRadius: tokens.radius,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="px-4 py-2 text-sm font-semibold rounded-md"
          style={{
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.bg,
            borderRadius: tokens.radius,
          }}
        >
          {actionLabel}
        </a>
      )}
    </header>
  );
}`,
  generateHtml: (tokens: ResolvedTokens) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    :root { ${cssVars(tokens)} }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-ui); }
    .navbar { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--color-border); }
    .navbar-left { display: flex; align-items: center; gap: 2rem; }
    .navbar-logo { font-size: 1.125rem; font-weight: 700; color: var(--color-primary); font-family: var(--font-data); }
    .navbar-links { display: flex; align-items: center; gap: 0.25rem; }
    .navbar-link { padding: 0.5rem 0.75rem; font-size: 0.875rem; color: var(--color-text); text-decoration: none; border-radius: var(--radius); transition: background var(--transition), color var(--transition); }
    .navbar-link:hover { background: var(--color-surface); }
    .navbar-link.active { background: var(--color-surface); color: var(--color-primary); }
    .btn-action { padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--radius); background: var(--color-primary); color: var(--color-bg); text-decoration: none; border: none; }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="navbar-left">
      <span class="navbar-logo">IRONWATCH</span>
      <nav class="navbar-links">
        <a href="#" class="navbar-link active">Dashboard</a>
        <a href="#" class="navbar-link">Monitors</a>
        <a href="#" class="navbar-link">Reports</a>
        <a href="#" class="navbar-link">Settings</a>
      </nav>
    </div>
    <a href="#" class="btn-action">Deploy</a>
  </header>
</body>
</html>`,
};

// ─── Template Registry ─────────────────────────────────────────────

const TEMPLATE_REGISTRY: ReadonlyMap<TargetComponent, ComponentTemplate> = new Map([
  ["sidebar", sidebarTemplate],
  ["card-grid", cardGridTemplate],
  ["data-table", dataTableTemplate],
  ["stat-bar", statBarTemplate],
  ["hero-section", heroSectionTemplate],
  ["nav-bar", navBarTemplate],
]);

export function getTemplate(target: TargetComponent): ComponentTemplate {
  const template = TEMPLATE_REGISTRY.get(target);
  if (!template) {
    throw new Error(`Unknown component template: '${target}'. Available: ${[...TEMPLATE_REGISTRY.keys()].join(", ")}`);
  }
  return template;
}

export function listTemplates(): ReadonlyArray<{ readonly name: string; readonly description: string }> {
  return [...TEMPLATE_REGISTRY.values()].map((t) => ({
    name: t.name,
    description: t.description,
  }));
}
