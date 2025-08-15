import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  TrendingUp,
  Settings,
  Moon,
  Sun,
  PanelLeftClose,
  ShoppingCart,
  PieChart,
  TreePine,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface NavLink {
  label: string
  href: string
  icon: LucideIcon
  disabled?: boolean
}

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}

const links = [
    { label: "Overview", href: "/", icon: TrendingUp, disabled: false },
    { label: "Marketplace", href: "/marketplace", icon: ShoppingCart, disabled: false },
    { label: "My Investments", href: "/investments", icon: PieChart, disabled: false },
]

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <aside
      className={`${collapsed ? "w-16" : "w-64"} bg-[var(--background)] fixed left-0 top-0 bottom-0 py-4 z-10 flex flex-col border-0 transition-all duration-300`}
    >
      <div className="flex items-center gap-3 px-4 mb-6 mt-2">
        <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
          <TreePine className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-semibold text-[var(--foreground)]">Project Mocha</div>
            <div className="text-xs text-[var(--muted-foreground)]">Coffee Investment</div>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-2 flex-1 px-2">
        <Button
          variant="ghost"
          className={`${collapsed ? "w-10 h-10" : "w-full justify-start"} border-0 text-[var(--muted-foreground)] hover:bg-[#1E1E1E] hover:text-[var(--foreground)] mb-2`}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          {!collapsed && <span className="ml-3">Menu</span>}
        </Button>

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.disabled ? "#" : link.href}
            className={link.disabled ? "pointer-events-none" : ""}
            aria-disabled={link.disabled}
          >
            <Button
              variant="ghost"
              className={`cursor-pointer ${collapsed ? "w-10 h-10" : "w-full justify-start"} border-0 ${
                link.disabled
                  ? "text-[var(--muted-foreground)] opacity-50 cursor-not-allowed"
                  : pathname === link.href
                    ? "text-[#ffffff] bg-[#522912] bg-opacity-20"
                    : "text-[var(--muted-foreground)] hover:bg-[#1E1E1E] hover:text-[var(--foreground)]"
              }`}
              disabled={link.disabled}
            >
              <link.icon className="w-5 h-5" />
              {!collapsed && <span className="ml-3">{link.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-2 mt-auto px-2">
        <Button
          variant="ghost"
          className={`${collapsed ? "w-10 h-10" : "w-full justify-start"} border-0 text-[var(--muted-foreground)] cursor-pointer hover:bg-[#1E1E1E] hover:text-[var(--foreground)]`}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Settings</span>}
        </Button>
        <Button
          variant="ghost"
          className={`${collapsed ? "w-10 h-10" : "w-full justify-start"} border-0 text-[var(--muted-foreground)] cursor-pointer hover:bg-[#1E1E1E] hover:text-[var(--foreground)]`}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span className="ml-3">{theme === "dark" ? "Light" : "Dark"}</span>}
        </Button>
      </div>
    </aside>
  )
}