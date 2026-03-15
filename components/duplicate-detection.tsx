"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useScan } from "@/lib/scan-context"
import { Copy, Trash2, Image, Video, FileText, AlertTriangle } from "lucide-react"
import { useState } from "react"

export function DuplicateDetection() {
  const { duplicates, files } = useScan()
  const [deletedGroups, setDeletedGroups] = useState<string[]>([])

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const totalWastedSpace = duplicates
    .filter((g) => !deletedGroups.includes(g.hash))
    .reduce((sum, g) => sum + g.wastedSpace, 0)

  const imageCount = duplicates.filter(
    (g) => !deletedGroups.includes(g.hash) && g.files[0]?.type === "image"
  ).length

  const videoCount = duplicates.filter(
    (g) => !deletedGroups.includes(g.hash) && g.files[0]?.type === "video"
  ).length

  const handleDelete = (hash: string) => {
    setDeletedGroups((prev) => [...prev, hash])
  }

  const activeDuplicates = duplicates.filter((g) => !deletedGroups.includes(g.hash))

  if (files.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Duplicate Detection</h2>
          <p className="text-muted-foreground">
            Find and remove duplicate files to free up storage
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Copy className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mt-4 text-center text-muted-foreground">
              No files scanned yet. Go to Storage Scanner to upload and scan files.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Duplicate Detection</h2>
        <p className="text-muted-foreground">
          Find and remove duplicate files to free up storage
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Copy className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeDuplicates.length}</p>
              <p className="text-sm text-muted-foreground">Duplicate Groups</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <AlertTriangle className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{formatSize(totalWastedSpace)}</p>
              <p className="text-sm text-muted-foreground">Wasted Space</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Image className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {imageCount} / {videoCount}
              </p>
              <p className="text-sm text-muted-foreground">Images / Videos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {activeDuplicates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Copy className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-4 text-center font-medium text-foreground">No duplicates found!</p>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Your storage is free of duplicate files.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeDuplicates.map((group) => (
            <Card key={group.hash}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-base">Duplicate Group</CardTitle>
                  <CardDescription>
                    {group.files.length} identical files - {formatSize(group.wastedSpace)} wasted
                  </CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(group.hash)}
                  className="shrink-0"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Duplicates
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.files.map((file, index) => (
                    <div
                      key={file.id}
                      className={`relative flex items-center gap-3 rounded-lg border p-3 ${
                        index === 0
                          ? "border-primary bg-primary/5"
                          : "border-border bg-secondary/30"
                      }`}
                    >
                      {index === 0 && (
                        <span className="absolute -top-2 right-2 rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                          Keep
                        </span>
                      )}
                      {file.type === "image" ? (
                        <Image className="h-8 w-8 shrink-0 text-primary" />
                      ) : file.type === "video" ? (
                        <Video className="h-8 w-8 shrink-0 text-chart-2" />
                      ) : (
                        <FileText className="h-8 w-8 shrink-0 text-chart-3" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatSize(file.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
