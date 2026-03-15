"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useScan } from "@/lib/scan-context"
import { Star, Trophy, Zap, Image as ImageIcon } from "lucide-react"

export function BestPhotoSelector() {
  const { similarGroups, files } = useScan()

  const bestPhotos = similarGroups.map((group) => {
    const bestPhoto = group.files.find((f) => f.id === group.bestPhotoId)
    return {
      group,
      bestPhoto,
      otherPhotos: group.files.filter((f) => f.id !== group.bestPhotoId),
    }
  })

  if (files.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Best Photo Selector</h2>
          <p className="text-muted-foreground">
            AI automatically selects the best photo from similar groups based on quality metrics
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Star className="h-8 w-8 text-muted-foreground" />
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
        <h2 className="text-2xl font-bold text-foreground">Best Photo Selector</h2>
        <p className="text-muted-foreground">
          AI automatically selects the best photo from similar groups based on quality metrics
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{bestPhotos.length}</p>
              <p className="text-sm text-muted-foreground">Best Photos Selected</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
              <ImageIcon className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {bestPhotos.reduce((sum, bp) => sum + bp.otherPhotos.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Suggested for Removal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
              <Zap className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {bestPhotos.length > 0
                  ? Math.round(
                      bestPhotos.reduce(
                        (sum, bp) => sum + (bp.bestPhoto?.quality || 0),
                        0
                      ) / bestPhotos.length
                    )
                  : 0}
                %
              </p>
              <p className="text-sm text-muted-foreground">Avg. Quality Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {bestPhotos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-4 text-center font-medium text-foreground">
              No similar photo groups found
            </p>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Upload more photos to enable best photo selection.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bestPhotos.map(({ group, bestPhoto, otherPhotos }, index) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Trophy className="h-4 w-4 text-primary" />
                      Photo Group #{index + 1}
                    </CardTitle>
                    <CardDescription>
                      AI selected the best photo based on sharpness and quality analysis
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Best Photo */}
                  {bestPhoto && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Best Photo</span>
                      </div>
                      <div className="overflow-hidden rounded-lg border-2 border-primary">
                        <div className="aspect-video bg-secondary/50">
                          {bestPhoto.url ? (
                            <img
                              src={bestPhoto.url}
                              alt={bestPhoto.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="bg-card p-4">
                          <p className="truncate font-medium text-foreground">{bestPhoto.name}</p>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Quality Score</span>
                              <span className="font-medium text-primary">
                                {Math.round(bestPhoto.quality || 0)}%
                              </span>
                            </div>
                            <Progress value={bestPhoto.quality || 0} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other Photos */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Other Photos ({otherPhotos.length})
                      </span>
                    </div>
                    <div className="grid gap-2">
                      {otherPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                            {photo.url ? (
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {photo.name}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Quality:</span>
                              <Progress
                                value={photo.quality || 0}
                                className="h-1.5 w-20"
                              />
                              <span className="text-xs text-muted-foreground">
                                {Math.round(photo.quality || 0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
