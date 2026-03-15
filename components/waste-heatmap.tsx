"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useScan } from "@/lib/scan-context"
import { Flame, Folder, AlertTriangle, CheckCircle } from "lucide-react"

export function WasteHeatmap() {
  const { folderWaste, files } = useScan()

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getWasteColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-destructive/20 border-destructive text-destructive"
      case "medium":
        return "bg-chart-3/20 border-chart-3 text-chart-3"
      case "low":
        return "bg-primary/20 border-primary text-primary"
      default:
        return "bg-secondary border-border text-muted-foreground"
    }
  }

  const getWasteIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-5 w-5" />
      case "medium":
        return <Flame className="h-5 w-5" />
      case "low":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Folder className="h-5 w-5" />
    }
  }

  const totalWaste = folderWaste.reduce((sum, f) => sum + f.wasteSize, 0)
  const highWasteFolders = folderWaste.filter((f) => f.wasteLevel === "high").length

  // Demo data for when no files are scanned
  const demoData = [
    { folder: "WhatsApp Media", wasteLevel: "high" as const, wasteSize: 1024 * 1024 * 500, totalSize: 1024 * 1024 * 800, percentage: 62 },
    { folder: "Screenshots", wasteLevel: "medium" as const, wasteSize: 1024 * 1024 * 150, totalSize: 1024 * 1024 * 400, percentage: 37 },
    { folder: "Downloads", wasteLevel: "low" as const, wasteSize: 1024 * 1024 * 50, totalSize: 1024 * 1024 * 600, percentage: 8 },
    { folder: "Camera", wasteLevel: "medium" as const, wasteSize: 1024 * 1024 * 200, totalSize: 1024 * 1024 * 900, percentage: 22 },
    { folder: "Documents", wasteLevel: "low" as const, wasteSize: 1024 * 1024 * 30, totalSize: 1024 * 1024 * 300, percentage: 10 },
  ]

  const displayData = files.length > 0 ? folderWaste : demoData

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Digital Waste Heatmap</h2>
        <p className="text-muted-foreground">
          Visual overview of which folders generate the most digital waste
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Flame className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {files.length > 0 ? formatSize(totalWaste) : "900 MB"}
              </p>
              <p className="text-sm text-muted-foreground">Total Digital Waste</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <AlertTriangle className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {files.length > 0 ? highWasteFolders : 1}
              </p>
              <p className="text-sm text-muted-foreground">High Waste Folders</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Folder className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{displayData.length}</p>
              <p className="text-sm text-muted-foreground">Folders Analyzed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Folder Waste Analysis</CardTitle>
          <CardDescription>
            {files.length === 0 && "Demo data shown. Upload files to see your actual folder analysis."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayData.map((folder, index) => (
              <div
                key={folder.folder}
                className={`relative overflow-hidden rounded-lg border p-4 ${getWasteColor(
                  folder.wasteLevel
                )}`}
              >
                <div
                  className="absolute inset-y-0 left-0 opacity-20"
                  style={{
                    width: `${folder.percentage}%`,
                    background:
                      folder.wasteLevel === "high"
                        ? "var(--destructive)"
                        : folder.wasteLevel === "medium"
                        ? "var(--chart-3)"
                        : "var(--primary)",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getWasteIcon(folder.wasteLevel)}
                    <div>
                      <p className="font-medium text-foreground">{folder.folder}</p>
                      <p className="text-sm opacity-80">
                        {formatSize(folder.wasteSize)} waste of {formatSize(folder.totalSize)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{Math.round(folder.percentage)}%</p>
                    <p className="text-xs uppercase tracking-wider opacity-80">
                      {folder.wasteLevel} waste
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Heatmap Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-destructive bg-destructive/10 p-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">High Waste</p>
                <p className="text-xs text-muted-foreground">{">"} 30% waste ratio</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-chart-3 bg-chart-3/10 p-3">
              <Flame className="h-5 w-5 text-chart-3" />
              <div>
                <p className="font-medium text-foreground">Medium Waste</p>
                <p className="text-xs text-muted-foreground">15-30% waste ratio</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/10 p-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Low Waste</p>
                <p className="text-xs text-muted-foreground">{"<"} 15% waste ratio</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
