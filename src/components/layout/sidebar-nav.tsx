import { Link, useLocation } from 'react-router-dom'
import {
  Columns2,
  Palette,
  History,
  FolderOpen,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface NavItem {
  readonly path: string
  readonly label: string
  readonly icon: React.ReactNode
}

const NAV_ITEMS: readonly NavItem[] = [
  { path: '/', label: 'Eval', icon: <Columns2 size={18} /> },
  { path: '/profile', label: 'Profile', icon: <Palette size={18} /> },
  { path: '/history', label: 'History', icon: <History size={18} /> },
  { path: '/sessions', label: 'Sessions', icon: <FolderOpen size={18} /> },
]

export function SidebarNav() {
  const location = useLocation()

  return (
    <nav className="flex h-screen w-[60px] flex-col items-center border-r border-border bg-[#0f0f0f] py-4">
      <div className="mb-6 flex h-8 w-8 items-center justify-center">
        <span className="font-mono text-xs font-medium text-primary">M</span>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)

          return (
            <Tooltip key={item.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={`flex h-10 w-10 flex-col items-center justify-center gap-0.5 transition-colors ${
                    isActive
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {item.icon}
                  <span className="text-[9px] font-medium leading-none">
                    {item.label}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      <div className="mt-auto text-[9px] text-muted-foreground font-mono">
        v1
      </div>
    </nav>
  )
}
