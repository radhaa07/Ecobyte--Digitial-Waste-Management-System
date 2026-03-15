"use client"

import { ScanProvider } from "@/lib/scan-context"
import { Sidebar } from "@/components/sidebar"
import { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ScanProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:pl-64">
          <div className="container max-w-6xl px-4 py-8 lg:px-8">{children}</div>
        </main>
      </div>
    </ScanProvider>
  )
}
