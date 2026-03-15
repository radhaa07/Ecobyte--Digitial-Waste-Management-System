"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useScan } from "@/lib/scan-context"
import { Images, Sparkles, Star } from "lucide-react"

export function SimilarImages() {
  const { similarGroups, files } = useScan()

  if (files.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Similar Image Detection</h2>
          <p className="text-muted-foreground">
            Group visually similar images like burst photos or edited versions
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Images className="h-8 w-8 text-muted-foreground" />
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
        <h2 className="text-2xl font-bold text-foreground">Similar Image Detection</h2>
        <p className="text-muted-foreground">
          Group visually similar images like burst photos or edited versions
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Images className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{similarGroups.length}</p>
              <p className="text-sm text-muted-foreground">Similar Groups Found</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
              <Sparkles className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {similarGroups.reduce((sum, g) => sum + g.files.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Similar Images</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {similarGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Images className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-4 text-center font-medium text-foreground">
              No similar images found!
            </p>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Your photos are all unique.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {similarGroups.map((group, groupIndex) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle className="text-base">Similar Group #{groupIndex + 1}</CardTitle>
                <CardDescription>
                  {group.files.length} similar images detected - possibly burst photos or edits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.files.map((file) => {
                    const isBest = file.id === group.bestPhotoId
                    return (
                      <div
                        key={file.id}
                        className={`relative overflow-hidden rounded-lg border ${
                          isBest ? "border-primary ring-2 ring-primary/20" : "border-border"
                        }`}
                      >
                        {isBest && (
                          <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                            <Star className="h-3 w-3" />
                            Best Photo
                          </div>
                        )}
                        <div className="aspect-video bg-secondary/50">
                          {file.url ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Images className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="truncate text-sm font-medium text-foreground">
                            {file.name}
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{file.folder}</p>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">Quality:</span>
                              <span
                                className={`text-xs font-medium ${
                                  (file.quality || 0) > 70
                                    ? "text-primary"
                                    : (file.quality || 0) > 40
                                    ? "text-chart-3"
                                    : "text-chart-4"
                                }`}
                              >
                                {Math.round(file.quality || 0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
