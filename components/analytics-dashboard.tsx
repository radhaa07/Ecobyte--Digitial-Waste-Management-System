"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useScan } from "@/lib/scan-context"
import {
  BarChart3,
  PieChart,
  HardDrive,
  Trash2,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export function AnalyticsDashboard() {
  const { files, duplicates, folderWaste } = useScan()

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Storage by file type
  const storageByType = [
    {
      name: "Photos",
      value: files.filter((f) => f.type === "image").reduce((sum, f) => sum + f.size, 0),
      fill: "var(--chart-1)",
    },
    {
      name: "Videos",
      value: files.filter((f) => f.type === "video").reduce((sum, f) => sum + f.size, 0),
      fill: "var(--chart-2)",
    },
    {
      name: "Screenshots",
      value: files.filter((f) => f.type === "screenshot").reduce((sum, f) => sum + f.size, 0),
      fill: "var(--chart-3)",
    },
    {
      name: "Documents",
      value: files.filter((f) => f.type === "document").reduce((sum, f) => sum + f.size, 0),
      fill: "var(--chart-4)",
    },
  ].filter((item) => item.value > 0)

  // Demo data for empty state
  const demoStorageByType = [
    { name: "Photos", value: 2500, fill: "var(--chart-1)" },
    { name: "Videos", value: 4200, fill: "var(--chart-2)" },
    { name: "Screenshots", value: 800, fill: "var(--chart-3)" },
    { name: "Documents", value: 500, fill: "var(--chart-4)" },
  ]

  const totalWaste = duplicates.reduce((sum, g) => sum + g.wastedSpace, 0)
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const wastePercentage = totalSize > 0 ? (totalWaste / totalSize) * 100 : 0

  // Demo waste data
  const demoWasteData = [
    { name: "Usable", value: 75, fill: "var(--chart-1)" },
    { name: "Waste", value: 25, fill: "var(--destructive)" },
  ]

  const wasteData =
    files.length > 0
      ? [
          { name: "Usable", value: 100 - wastePercentage, fill: "var(--chart-1)" },
          { name: "Waste", value: wastePercentage, fill: "var(--destructive)" },
        ]
      : demoWasteData

  // File distribution by folder
  const folderDistribution = Object.entries(
    files.reduce((acc, file) => {
      acc[file.folder] = (acc[file.folder] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  ).map(([folder, count]) => ({
    folder,
    count,
  }))

  const demoFolderDistribution = [
    { folder: "Camera", count: 245 },
    { folder: "Screenshots", count: 120 },
    { folder: "WhatsApp", count: 350 },
    { folder: "Downloads", count: 85 },
    { folder: "Documents", count: 45 },
  ]

  const displayFolderData =
    folderDistribution.length > 0 ? folderDistribution : demoFolderDistribution

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Storage Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive overview of your storage usage and digital waste
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <HardDrive className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {files.length > 0 ? formatSize(totalSize) : "8.5 GB"}
              </p>
              <p className="text-sm text-muted-foreground">Total Storage</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {files.length > 0 ? formatSize(totalWaste) : "2.1 GB"}
              </p>
              <p className="text-sm text-muted-foreground">Digital Waste</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
              <PieChart className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {files.length > 0 ? `${Math.round(wastePercentage)}%` : "25%"}
              </p>
              <p className="text-sm text-muted-foreground">Waste Percentage</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
              <BarChart3 className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {files.length > 0 ? files.length : 845}
              </p>
              <p className="text-sm text-muted-foreground">Total Files</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Storage by File Type</CardTitle>
            <CardDescription>
              {files.length === 0 && "Demo data shown. Upload files for actual analysis."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={storageByType.length > 0 ? storageByType : demoStorageByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {(storageByType.length > 0 ? storageByType : demoStorageByType).map(
                      (entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                    formatter={(value: number) =>
                      files.length > 0 ? formatSize(value) : `${value} MB`
                    }
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Digital Waste Analysis</CardTitle>
            <CardDescription>Usable storage vs. digital waste ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={wasteData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {wasteData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                    formatter={(value: number) => `${Math.round(value)}%`}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File Distribution by Folder</CardTitle>
          <CardDescription>Number of files in each folder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayFolderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="folder"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
