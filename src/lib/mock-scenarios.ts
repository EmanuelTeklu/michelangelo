import type { Scenario } from './types'

const SHARED_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', system-ui, sans-serif; background: #0a0a0a; color: #fafafa; }
  .mono { font-family: 'DM Mono', monospace; }
`

export const MOCK_SCENARIOS: readonly Scenario[] = [
  {
    id: 'sidebar-border-radius',
    name: 'Sidebar Border Radius',
    componentTarget: 'Sidebar > NavItem',
    mechanism: 'Profile Differ v1',
    reasoning:
      'Sidebar navigation items use rounded-lg (8px) corners. Taste profile value "sharp-geometry" and anti-pattern "decorative-rounded-corners" both indicate these should be squared off. Navigation elements are functional, not decorative.',
    currentHtml: `<!DOCTYPE html>
<html><head><style>
${SHARED_STYLES}
.sidebar { width: 240px; background: #0f0f0f; border-right: 1px solid #262626; padding: 16px 12px; min-height: 400px; }
.nav-section { margin-bottom: 24px; }
.nav-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #525252; padding: 0 12px; margin-bottom: 8px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; color: #a1a1aa; font-size: 14px; cursor: pointer; transition: background 0.15s; }
.nav-item:hover { background: #1a1a1a; }
.nav-item.active { background: #1a1a1a; color: #fafafa; }
.nav-item .icon { width: 18px; height: 18px; border-radius: 4px; background: #262626; }
.nav-item.active .icon { background: #eab308; }
.badge { font-size: 11px; margin-left: auto; background: #1e1e1e; color: #a1a1aa; padding: 2px 8px; border-radius: 9999px; }
.mono { font-family: 'DM Mono', monospace; }
</style></head><body>
<div class="sidebar">
  <div class="nav-section">
    <div class="nav-label mono">Operations</div>
    <div class="nav-item active"><div class="icon"></div>Dashboard<span class="badge mono">3</span></div>
    <div class="nav-item"><div class="icon"></div>Alerts<span class="badge mono">12</span></div>
    <div class="nav-item"><div class="icon"></div>Incidents</div>
    <div class="nav-item"><div class="icon"></div>Deployments</div>
  </div>
  <div class="nav-section">
    <div class="nav-label mono">Coverage</div>
    <div class="nav-item"><div class="icon"></div>Services<span class="badge mono">47</span></div>
    <div class="nav-item"><div class="icon"></div>Monitors</div>
    <div class="nav-item"><div class="icon"></div>SLOs</div>
  </div>
</div>
</body></html>`,
    proposedHtml: `<!DOCTYPE html>
<html><head><style>
${SHARED_STYLES}
.sidebar { width: 240px; background: #0f0f0f; border-right: 1px solid #262626; padding: 16px 12px; min-height: 400px; }
.nav-section { margin-bottom: 24px; }
.nav-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #525252; padding: 0 12px; margin-bottom: 8px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 0; color: #a1a1aa; font-size: 14px; cursor: pointer; transition: background 0.15s; }
.nav-item:hover { background: #1a1a1a; }
.nav-item.active { background: #1a1a1a; color: #fafafa; border-left: 2px solid #eab308; }
.nav-item .icon { width: 18px; height: 18px; border-radius: 0; background: #262626; }
.nav-item.active .icon { background: #eab308; }
.badge { font-size: 11px; margin-left: auto; background: #1e1e1e; color: #a1a1aa; padding: 2px 8px; border-radius: 0; }
.mono { font-family: 'DM Mono', monospace; }
</style></head><body>
<div class="sidebar">
  <div class="nav-section">
    <div class="nav-label mono">Operations</div>
    <div class="nav-item active"><div class="icon"></div>Dashboard<span class="badge mono">3</span></div>
    <div class="nav-item"><div class="icon"></div>Alerts<span class="badge mono">12</span></div>
    <div class="nav-item"><div class="icon"></div>Incidents</div>
    <div class="nav-item"><div class="icon"></div>Deployments</div>
  </div>
  <div class="nav-section">
    <div class="nav-label mono">Coverage</div>
    <div class="nav-item"><div class="icon"></div>Services<span class="badge mono">47</span></div>
    <div class="nav-item"><div class="icon"></div>Monitors</div>
    <div class="nav-item"><div class="icon"></div>SLOs</div>
  </div>
</div>
</body></html>`,
  },
  {
    id: 'badge-styling',
    name: 'Badge Styling',
    componentTarget: 'Badge',
    mechanism: 'Profile Differ v1',
    reasoning:
      'Badges use rounded-full (pill shape) which is flagged by anti-pattern "decorative-rounded-corners". Replacing with sharp rectangular badges with 1px border. Color usage preserved but geometry updated to match sharp-geometry value.',
    currentHtml: `<!DOCTYPE html>
<html><head><style>
${SHARED_STYLES}
.container { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
.row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.label { font-size: 13px; color: #525252; width: 80px; }
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; }
.badge-yellow { background: rgba(234,179,8,0.15); color: #eab308; }
.badge-orange { background: rgba(249,115,22,0.15); color: #f97316; }
.badge-purple { background: rgba(168,85,247,0.15); color: #a855f7; }
.badge-green { background: rgba(34,197,94,0.15); color: #22c55e; }
.badge-red { background: rgba(220,38,38,0.15); color: #dc2626; }
.badge-blue { background: rgba(59,130,246,0.15); color: #3b82f6; }
.card { background: #141414; border: 1px solid #262626; border-radius: 8px; padding: 16px; }
.card-title { font-size: 14px; font-weight: 500; margin-bottom: 12px; }
.service-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #1e1e1e; }
.service-name { font-size: 13px; }
.mono { font-family: 'DM Mono', monospace; }
</style></head><body>
<div class="container">
  <div class="row">
    <span class="label mono">Status</span>
    <span class="badge badge-green">Operational</span>
    <span class="badge badge-orange">Armed</span>
    <span class="badge badge-red">Critical</span>
    <span class="badge badge-yellow">Pending</span>
    <span class="badge badge-purple">AI Review</span>
    <span class="badge badge-blue">Info</span>
  </div>
  <div class="card">
    <div class="card-title">Service Health</div>
    <div class="service-row"><span class="service-name">auth-service</span><span class="badge badge-green">Healthy</span></div>
    <div class="service-row"><span class="service-name">payment-api</span><span class="badge badge-orange">Degraded</span></div>
    <div class="service-row"><span class="service-name">ml-pipeline</span><span class="badge badge-purple">AI Managed</span></div>
    <div class="service-row" style="border:none"><span class="service-name">cdn-edge</span><span class="badge badge-red">Down</span></div>
  </div>
</div>
</body></html>`,
    proposedHtml: `<!DOCTYPE html>
<html><head><style>
${SHARED_STYLES}
.container { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
.row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.label { font-size: 13px; color: #525252; width: 80px; }
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 0; font-size: 12px; font-weight: 500; border: 1px solid; }
.badge-yellow { background: rgba(234,179,8,0.08); color: #eab308; border-color: rgba(234,179,8,0.3); }
.badge-orange { background: rgba(249,115,22,0.08); color: #f97316; border-color: rgba(249,115,22,0.3); }
.badge-purple { background: rgba(168,85,247,0.08); color: #a855f7; border-color: rgba(168,85,247,0.3); }
.badge-green { background: rgba(34,197,94,0.08); color: #22c55e; border-color: rgba(34,197,94,0.3); }
.badge-red { background: rgba(220,38,38,0.08); color: #dc2626; border-color: rgba(220,38,38,0.3); }
.badge-blue { background: rgba(59,130,246,0.08); color: #3b82f6; border-color: rgba(59,130,246,0.3); }
.card { background: #141414; border: 1px solid #262626; border-radius: 0; padding: 16px; }
.card-title { font-size: 14px; font-weight: 500; margin-bottom: 12px; }
.service-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #1e1e1e; }
.service-name { font-size: 13px; }
.mono { font-family: 'DM Mono', monospace; }
</style></head><body>
<div class="container">
  <div class="row">
    <span class="label mono">Status</span>
    <span class="badge badge-green">Operational</span>
    <span class="badge badge-orange">Armed</span>
    <span class="badge badge-red">Critical</span>
    <span class="badge badge-yellow">Pending</span>
    <span class="badge badge-purple">AI Review</span>
    <span class="badge badge-blue">Info</span>
  </div>
  <div class="card">
    <div class="card-title">Service Health</div>
    <div class="service-row"><span class="service-name">auth-service</span><span class="badge badge-green">Healthy</span></div>
    <div class="service-row"><span class="service-name">payment-api</span><span class="badge badge-orange">Degraded</span></div>
    <div class="service-row"><span class="service-name">ml-pipeline</span><span class="badge badge-purple">AI Managed</span></div>
    <div class="service-row" style="border:none"><span class="service-name">cdn-edge</span><span class="badge badge-red">Down</span></div>
  </div>
</div>
</body></html>`,
  },
  {
    id: 'card-spacing',
    name: 'Card Grid Spacing',
    componentTarget: 'MetricCard > Grid',
    mechanism: 'Spacing Analyzer v1',
    reasoning:
      'Card grid uses 12px gap which creates visual density within sections. Taste profile rule "breathing-room-between-sections-not-within" suggests increasing inter-card gap to 24px to create clearer section boundaries while maintaining density within each card.',
    currentHtml: `<!DOCTYPE html>
<html><head><style>
${SHARED_STYLES}
.container { padding: 32px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.card { background: #141414; border: 1px solid #262626; border-radius: 4px; padding: 20px; }
.card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #525252; margin-bottom: 8px; }
.card-value { font-size: 28px; font-weight: 600; letter-spacing: -0.02em; }
.card-sub { font-size: 12px; color: #525252; margin-top: 4px; }
.mono { font-family: 'DM Mono', monospace; }
.text-yellow { color: #eab308; }
.text-green { color: #22c55e; }
.text-red { color: #dc2626; }
.text-orange { color: #f97316; }
.text-purple { color: #a855f7; }
.text-blue { color: #3b82f6; }
.sparkline { display: flex; align-items: flex-end; gap: 2px; height: 32px; margin-top: 12px; }
.spark-bar { width: 4px; background: #262626; border-radius: 0; }
.spark-bar.active { background: #eab308; }
</style></head><body>
<div class="container">
  <div class="grid">
    <div class="card">
      <div class="card-label mono">Uptime</div>
      <div class="card-value mono text-green">99.97%</div>
      <div class="card-sub mono">Last 30 days</div>
      <div class="sparkline">
        <div class="spark-bar active" style="height:80%"></div>
        <div class="spark-bar active" style="height:90%"></div>
        <div class="spark-bar active" style="height:95%"></div>
        <div class="spark-bar active" style="height:100%"></div>
        <div class="spark-bar active" style="height:92%"></div>
        <div class="spark-bar active" style="height:88%"></div>
        <div class="spark-bar active" style="height:97%"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-label mono">Active Alerts</div>
      <div class="card-value mono text-orange">12</div>
      <div class="card-sub mono">3 critical</div>
    </div>
    <div class="card">
      <div class="card-label mono">Deployments</div>
      <div class="card-value mono text-yellow">8</div>
      <div class="card-sub mono">Today</div>
    </div>
    <div class="card">
      <div class="card-label mono">MTTR</div>
      <div class="card-value mono text-blue">4.2m</div>
      <div class="card-sub mono">Avg resolution</div>
    </div>
    <div class="card">
      <div class="card-label mono">Coverage</div>
      <div class="card-value mono text-purple">84%</div>
      <div class="card-sub mono">Services monitored</div>
    </div>
    <div class="card">
      <div class="card-label mono">Error Rate</div>
      <div class="card-value mono text-red">0.03%</div>
      <div class="card-sub mono">Last hour</div>
    </div>
  </div>
</div>
</body></html>`,
    proposedHtml: `<!DOCTYPE html>
<html><head><style>
${SHARED_STYLES}
.container { padding: 32px; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.card { background: #141414; border: 1px solid #262626; border-radius: 4px; padding: 20px; }
.card-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #525252; margin-bottom: 8px; }
.card-value { font-size: 28px; font-weight: 600; letter-spacing: -0.02em; }
.card-sub { font-size: 12px; color: #525252; margin-top: 4px; }
.mono { font-family: 'DM Mono', monospace; }
.text-yellow { color: #eab308; }
.text-green { color: #22c55e; }
.text-red { color: #dc2626; }
.text-orange { color: #f97316; }
.text-purple { color: #a855f7; }
.text-blue { color: #3b82f6; }
.sparkline { display: flex; align-items: flex-end; gap: 2px; height: 32px; margin-top: 12px; }
.spark-bar { width: 4px; background: #262626; border-radius: 0; }
.spark-bar.active { background: #eab308; }
</style></head><body>
<div class="container">
  <div class="grid">
    <div class="card">
      <div class="card-label mono">Uptime</div>
      <div class="card-value mono text-green">99.97%</div>
      <div class="card-sub mono">Last 30 days</div>
      <div class="sparkline">
        <div class="spark-bar active" style="height:80%"></div>
        <div class="spark-bar active" style="height:90%"></div>
        <div class="spark-bar active" style="height:95%"></div>
        <div class="spark-bar active" style="height:100%"></div>
        <div class="spark-bar active" style="height:92%"></div>
        <div class="spark-bar active" style="height:88%"></div>
        <div class="spark-bar active" style="height:97%"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-label mono">Active Alerts</div>
      <div class="card-value mono text-orange">12</div>
      <div class="card-sub mono">3 critical</div>
    </div>
    <div class="card">
      <div class="card-label mono">Deployments</div>
      <div class="card-value mono text-yellow">8</div>
      <div class="card-sub mono">Today</div>
    </div>
    <div class="card">
      <div class="card-label mono">MTTR</div>
      <div class="card-value mono text-blue">4.2m</div>
      <div class="card-sub mono">Avg resolution</div>
    </div>
    <div class="card">
      <div class="card-label mono">Coverage</div>
      <div class="card-value mono text-purple">84%</div>
      <div class="card-sub mono">Services monitored</div>
    </div>
    <div class="card">
      <div class="card-label mono">Error Rate</div>
      <div class="card-value mono text-red">0.03%</div>
      <div class="card-sub mono">Last hour</div>
    </div>
  </div>
</div>
</body></html>`,
  },
  {
    id: 'status-colors',
    name: 'Status Color Semantics',
    componentTarget: 'StatusIndicator',
    mechanism: 'Palette Analyzer v1',
    reasoning:
      'Status indicators use generic blue/green/red color coding. palette.yaml defines semantic accent assignments: yellow for primary/action, orange for armed/urgency, purple for AI/automated. Updating to use the project-specific semantic palette instead of generic defaults.',
    currentHtml: `<!DOCTYPE html>
<html><head><style>
${SHARED_STYLES}
.container { padding: 32px; display: flex; flex-direction: column; gap: 16px; }
.status-row { display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: #141414; border: 1px solid #262626; border-radius: 4px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-blue { background: #3b82f6; }
.dot-green { background: #22c55e; }
.dot-red { background: #dc2626; }
.status-label { font-size: 14px; flex: 1; }
.status-detail { font-size: 12px; color: #525252; }
.status-action { font-size: 12px; padding: 4px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
.status-action.danger { background: #dc2626; }
.status-action.success { background: #22c55e; }
.mono { font-family: 'DM Mono', monospace; }
.header { display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 16px; font-weight: 500; }
.count { font-size: 13px; color: #525252; }
</style></head><body>
<div class="container">
  <div class="header">
    <span class="title">Active Incidents</span>
    <span class="count mono">4 incidents</span>
  </div>
  <div class="status-row">
    <div class="status-dot dot-red"></div>
    <span class="status-label">payment-api latency spike</span>
    <span class="status-detail mono">P1 &middot; 23m ago</span>
    <button class="status-action danger">Acknowledge</button>
  </div>
  <div class="status-row">
    <div class="status-dot dot-blue"></div>
    <span class="status-label">Auto-scaling triggered for ml-pipeline</span>
    <span class="status-detail mono">P3 &middot; 1h ago</span>
    <button class="status-action">Review</button>
  </div>
  <div class="status-row">
    <div class="status-dot dot-green"></div>
    <span class="status-label">cdn-edge failover completed</span>
    <span class="status-detail mono">P2 &middot; 2h ago</span>
    <button class="status-action success">Resolve</button>
  </div>
  <div class="status-row">
    <div class="status-dot dot-blue"></div>
    <span class="status-label">Canary deployment monitoring</span>
    <span class="status-detail mono">P4 &middot; 3h ago</span>
    <button class="status-action">Review</button>
  </div>
</div>
</body></html>`,
    proposedHtml: `<!DOCTYPE html>
<html><head><style>
${SHARED_STYLES}
.container { padding: 32px; display: flex; flex-direction: column; gap: 16px; }
.status-row { display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: #141414; border: 1px solid #262626; border-radius: 4px; }
.status-dot { width: 8px; height: 8px; border-radius: 0; flex-shrink: 0; }
.dot-armed { background: #f97316; }
.dot-confirmed { background: #22c55e; }
.dot-alert { background: #dc2626; }
.dot-ai { background: #a855f7; }
.status-label { font-size: 14px; flex: 1; }
.status-detail { font-size: 12px; color: #525252; }
.status-action { font-size: 12px; padding: 4px 12px; border: 1px solid; border-radius: 0; cursor: pointer; background: transparent; }
.status-action.alert { color: #dc2626; border-color: rgba(220,38,38,0.3); }
.status-action.ai { color: #a855f7; border-color: rgba(168,85,247,0.3); }
.status-action.confirmed { color: #22c55e; border-color: rgba(34,197,94,0.3); }
.status-action.primary { color: #eab308; border-color: rgba(234,179,8,0.3); }
.mono { font-family: 'DM Mono', monospace; }
.header { display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 16px; font-weight: 500; }
.count { font-size: 13px; color: #525252; }
</style></head><body>
<div class="container">
  <div class="header">
    <span class="title">Active Incidents</span>
    <span class="count mono">4 incidents</span>
  </div>
  <div class="status-row">
    <div class="status-dot dot-alert"></div>
    <span class="status-label">payment-api latency spike</span>
    <span class="status-detail mono">P1 &middot; 23m ago</span>
    <button class="status-action alert">Acknowledge</button>
  </div>
  <div class="status-row">
    <div class="status-dot dot-ai"></div>
    <span class="status-label">Auto-scaling triggered for ml-pipeline</span>
    <span class="status-detail mono">P3 &middot; 1h ago</span>
    <button class="status-action ai">Review</button>
  </div>
  <div class="status-row">
    <div class="status-dot dot-confirmed"></div>
    <span class="status-label">cdn-edge failover completed</span>
    <span class="status-detail mono">P2 &middot; 2h ago</span>
    <button class="status-action confirmed">Resolve</button>
  </div>
  <div class="status-row">
    <div class="status-dot dot-armed"></div>
    <span class="status-label">Canary deployment monitoring</span>
    <span class="status-detail mono">P4 &middot; 3h ago</span>
    <button class="status-action primary">Review</button>
  </div>
</div>
</body></html>`,
  },
] as const
