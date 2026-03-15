"use client"

import { cn } from "@/lib/utils"
import {
  HardDrive,
  Copy,
  Images,
  Star,
  Flame,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Leaf,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "Storage Scanner", icon: HardDrive },
  { href: "/duplicates", label: "Duplicate Detection", icon: Copy },
  { href: "/similar", label: "Similar Images", icon: Images },
  { href: "/best-photo", label: "Best Photo Selector", icon: Star },
  { href: "/heatmap", label: "Waste Heatmap", icon: Flame },
  { href: "/analytics", label: "Analytics Dashboard", icon: BarChart3 },
  { href: "/prediction", label: "Storage Prediction", icon: TrendingUp },
  { href: "/recommendations", label: "Smart Recommendations", icon: Lightbulb },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden text-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-border px-6 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">EcoByte AI</h1>
              <p className="text-xs text-muted-foreground">Digital Waste Manager</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border p-4">
            <div className="rounded-lg bg-primary/10 p-4">
              <p className="text-xs font-medium text-primary">AI-Powered Analysis</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Intelligent detection of digital waste and storage optimization.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
