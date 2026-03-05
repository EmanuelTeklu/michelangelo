import { Outlet } from 'react-router-dom'
import { SidebarNav } from './sidebar-nav'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
