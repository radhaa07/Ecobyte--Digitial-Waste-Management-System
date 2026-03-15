"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useScan } from "@/lib/scan-context"
import {
  Lightbulb,
  Trash2,
  Image,
  Video,
  Download,
  Cloud,
  Zap,
  CheckCircle2,
  Clock,
  HardDrive,
} from "lucide-react"
import { useState } from "react"

interface Recommendation {
  id: string
  title: string
  description: string
  savings: string
  priority: "high" | "medium" | "low"
  icon: React.ReactNode
  action: string
}

export function SmartRecommendations() {
  const { files, duplicates, recommendations } = useScan()
  const [completedActions, setCompletedActions] = useState<string[]>([])

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const totalWaste = duplicates.reduce((sum, g) => sum + g.wastedSpace, 0)

  const allRecommendations: Recommendation[] = [
    {
      id: "duplicates",
      title: "Delete Duplicate Files",
      description: `Remove ${duplicates.length} duplicate file groups to instantly free up space`,
      savings: files.length > 0 ? formatSize(totalWaste) : "450 MB",
      priority: "high",
      icon: <Trash2 className="h-5 w-5" />,
      action: "Remove Duplicates",
    },
    {
      id: "screenshots",
      title: "Clean Old Screenshots",
      description: "Remove screenshots older than 30 days that are no longer needed",
      savings: "320 MB",
      priority: "high",
      icon: <Image className="h-5 w-5" />,
      action: "Review Screenshots",
    },
    {
      id: "videos",
      title: "Compress Large Videos",
      description: "Reduce video file sizes by up to 50% without visible quality loss",
      savings: "1.2 GB",
      priority: "medium",
      icon: <Video className="h-5 w-5" />,
      action: "Compress Videos",
    },
    {
      id: "downloads",
      title: "Clear Temporary Downloads",
      description: "Remove temporary and cached download files that are no longer needed",
      savings: "280 MB",
      priority: "medium",
      icon: <Download className="h-5 w-5" />,
      action: "Clear Downloads",
    },
    {
      id: "cloud",
      title: "Enable Cloud Backup",
      description: "Back up photos to cloud and remove local copies to save device storage",
      savings: "2.5 GB",
      priority: "low",
      icon: <Cloud className="h-5 w-5" />,
      action: "Setup Backup",
    },
    {
      id: "auto-cleanup",
      title: "Enable Auto-Cleanup",
      description: "Automatically clean temporary files and caches weekly",
      savings: "150 MB/week",
      priority: "low",
      icon: <Zap className="h-5 w-5" />,
      action: "Enable",
    },
  ]

  const handleAction = (id: string) => {
    setCompletedActions((prev) => [...prev, id])
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30"
      case "medium":
        return "bg-chart-3/10 text-chart-3 border-chart-3/30"
      case "low":
        return "bg-primary/10 text-primary border-primary/30"
      default:
        return "bg-secondary text-muted-foreground border-border"
    }
  }

  const activeRecommendations = allRecommendations.filter(
    (r) => !completedActions.includes(r.id)
  )
  const completedRecommendations = allRecommendations.filter((r) =>
    completedActions.includes(r.id)
  )

  const totalSavings = "4.9 GB"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Smart Recommendations</h2>
        <p className="text-muted-foreground">
          AI-powered suggestions to optimize your storage and reduce digital waste
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeRecommendations.length}</p>
              <p className="text-sm text-muted-foreground">Active Suggestions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
              <HardDrive className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalSavings}</p>
              <p className="text-sm text-muted-foreground">Potential Savings</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
              <CheckCircle2 className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {completedRecommendations.length}
              </p>
              <p className="text-sm text-muted-foreground">Actions Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {activeRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
            <CardDescription>
              Follow these suggestions to optimize your storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getPriorityColor(
                        rec.priority
                      )}`}
                    >
                      {rec.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{rec.title}</h3>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityColor(
                            rec.priority
                          )}`}
                        >
                          {rec.priority}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                      <p className="mt-2 text-sm font-medium text-primary">
                        Potential savings: {rec.savings}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAction(rec.id)}
                    className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {rec.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {completedRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Completed Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Saved approximately {rec.savings}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Just now
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <h4 className="font-medium text-foreground">Regular Maintenance</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Run EcoByte AI scan weekly to catch new duplicates and digital waste before they
                accumulate.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <h4 className="font-medium text-foreground">Smart Photo Management</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the Best Photo Selector to keep only the best shots from burst photography
                sessions.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <h4 className="font-medium text-foreground">Download Hygiene</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Review your Downloads folder monthly and remove files you no longer need.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <h4 className="font-medium text-foreground">Cloud Integration</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Enable automatic cloud backup for photos to safely remove local copies when needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
