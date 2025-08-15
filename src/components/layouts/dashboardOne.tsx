"use client"

import { Children, useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  TrendingUp,
  ArrowUpDown,
  MoreHorizontal,
  Settings,
  Moon,
  Sun,
  Bell,
  PanelLeftClose,
  DollarSign,
  ShoppingCart,
  PieChart,
  TreePine,
  Leaf,
  MapPin,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatRectangle } from "@/components/@shared-components/stat-rectangle"
import Header from "@/components/@shared-components/header2"
import Sidebar from "@/components/@shared-components/sidebar"
import { StatCard } from "@/components/@shared-components/stat-card-2"

export default function DefaulDashboard({children, title, description}: {children: React.ReactNode, title: string, description: string}) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex min-h-screen w-full">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        <main className={`flex-1 ${sidebarCollapsed ? "ml-16" : "ml-64"} w-full min-h-screen transition-all duration-300`}>
          <div className="mx-auto px-4 max-w-full">
            <Header />

            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-[var(--foreground)]">{title}</h1>
                  <p className="text-xs">{description}</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-64 bg-[var(--card)] border-0 text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
                  />
                  <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-[var(--muted-foreground)] bg-[var(--secondary)] px-1.5 py-0.5 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>

              <div className="space-y-6">
                <div className="mb-8"></div>

                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}