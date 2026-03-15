"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useScan, ScannedFile, DuplicateGroup, SimilarGroup, FolderWaste } from "@/lib/scan-context"
import {
  Upload,
  HardDrive,
  Image,
  Video,
  FileText,
  Camera,
  Download,
  CheckCircle2,
  Loader2,
} from "lucide-react"

function generateHash(): string {
  return Math.random().toString(36).substring(2, 15)
}

function getFileType(file: File): ScannedFile["type"] {
  if (file.type.startsWith("image/")) {
    if (file.name.toLowerCase().includes("screenshot")) return "screenshot"
    return "image"
  }
  if (file.type.startsWith("video/")) return "video"
  return "document"
}

function getFolder(type: ScannedFile["type"]): string {
  switch (type) {
    case "image":
      return "Camera"
    case "screenshot":
      return "Screenshots"
    case "video":
      return "Videos"
    case "document":
      return "Documents"
    case "download":
      return "Downloads"
    default:
      return "Other"
  }
}

export function StorageScanner() {
  const {
    files,
    setFiles,
    isScanning,
    setIsScanning,
    scanProgress,
    setScanProgress,
    setDuplicates,
    setSimilarGroups,
    setFolderWaste,
    setRecommendations,
  } = useScan()

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
  })

  const simulateScan = async () => {
    if (uploadedFiles.length === 0) return

    setIsScanning(true)
    setScanProgress(0)

    const scannedFiles: ScannedFile[] = []
    const hashGroups: { [key: string]: ScannedFile[] } = {}

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i]
      const type = getFileType(file)
      const hash = i % 3 === 0 ? `dup_${Math.floor(i / 3)}` : generateHash()

      const scanned: ScannedFile = {
        id: `file_${i}`,
        name: file.name,
        type,
        size: file.size,
        hash,
        folder: getFolder(type),
        quality: Math.random() * 100,
        timestamp: new Date(),
        url: URL.createObjectURL(file),
      }

      scannedFiles.push(scanned)

      if (!hashGroups[hash]) {
        hashGroups[hash] = []
      }
      hashGroups[hash].push(scanned)

      setScanProgress(((i + 1) / uploadedFiles.length) * 100)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setFiles(scannedFiles)

    // Generate duplicates
    const duplicateGroups: DuplicateGroup[] = Object.entries(hashGroups)
      .filter(([, group]) => group.length > 1)
      .map(([hash, groupFiles]) => ({
        hash,
        files: groupFiles,
        wastedSpace: groupFiles.slice(1).reduce((sum, f) => sum + f.size, 0),
      }))
    setDuplicates(duplicateGroups)

    // Generate similar groups (simulated)
    const images = scannedFiles.filter((f) => f.type === "image")
    const similarGroupsData: SimilarGroup[] = []
    for (let i = 0; i < images.length; i += 3) {
      const groupImages = images.slice(i, i + 3)
      if (groupImages.length > 1) {
        const bestPhoto = groupImages.reduce((best, img) =>
          (img.quality || 0) > (best.quality || 0) ? img : best
        )
        similarGroupsData.push({
          id: `similar_${i}`,
          files: groupImages,
          bestPhotoId: bestPhoto.id,
        })
      }
    }
    setSimilarGroups(similarGroupsData)

    // Generate folder waste
    const folderStats: { [key: string]: { total: number; waste: number } } = {}
    scannedFiles.forEach((f) => {
      if (!folderStats[f.folder]) {
        folderStats[f.folder] = { total: 0, waste: 0 }
      }
      folderStats[f.folder].total += f.size
      if (duplicateGroups.some((g) => g.files.some((gf) => gf.id === f.id))) {
        folderStats[f.folder].waste += f.size * 0.5
      }
    })

    const wasteData: FolderWaste[] = Object.entries(folderStats).map(([folder, stats]) => {
      const percentage = (stats.waste / stats.total) * 100
      return {
        folder,
        wasteLevel: percentage > 30 ? "high" : percentage > 15 ? "medium" : "low",
        wasteSize: stats.waste,
        totalSize: stats.total,
        percentage,
      }
    })
    setFolderWaste(wasteData)

    // Generate recommendations
    const recs: string[] = []
    if (duplicateGroups.length > 0) {
      recs.push(`Delete ${duplicateGroups.length} duplicate file groups to save space`)
    }
    if (scannedFiles.filter((f) => f.type === "screenshot").length > 5) {
      recs.push("Remove old screenshots that are no longer needed")
    }
    if (scannedFiles.some((f) => f.size > 10 * 1024 * 1024)) {
      recs.push("Compress large video files to reduce storage usage")
    }
    recs.push("Enable automatic cleanup for temporary downloads")
    recs.push("Set up cloud backup for important photos")
    setRecommendations(recs)

    setIsScanning(false)
  }

  const stats = {
    total: files.length,
    images: files.filter((f) => f.type === "image").length,
    videos: files.filter((f) => f.type === "video").length,
    screenshots: files.filter((f) => f.type === "screenshot").length,
    documents: files.filter((f) => f.type === "document").length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Storage Scanner</h2>
        <p className="text-muted-foreground">
          Upload files to simulate scanning your device storage
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg p-8 transition-colors ${
              isDragActive ? "bg-primary/10" : "hover:bg-secondary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-4 text-center text-sm text-foreground">
              {isDragActive
                ? "Drop the files here..."
                : "Drag & drop files here, or click to select"}
            </p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Support for images, videos, and documents
            </p>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-base">Uploaded Files</CardTitle>
              <CardDescription>
                {uploadedFiles.length} files ready to scan
              </CardDescription>
            </div>
            <Button
              onClick={simulateScan}
              disabled={isScanning}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <HardDrive className="mr-2 h-4 w-4" />
                  Start Scan
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            {isScanning && (
              <div className="space-y-2">
                <Progress value={scanProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Scanning files... {Math.round(scanProgress)}%
                </p>
              </div>
            )}
            <div className="mt-4 max-h-40 space-y-2 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2"
                >
                  {file.type.startsWith("image/") ? (
                    <Image className="h-4 w-4 text-primary" />
                  ) : file.type.startsWith("video/") ? (
                    <Video className="h-4 w-4 text-chart-3" />
                  ) : (
                    <FileText className="h-4 w-4 text-chart-2" />
                  )}
                  <span className="flex-1 truncate text-sm text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {files.length > 0 && !isScanning && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <HardDrive className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                <Camera className="h-6 w-6 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.images}</p>
                <p className="text-sm text-muted-foreground">Photos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Video className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.videos}</p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Download className="h-6 w-6 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatSize(stats.totalSize)}</p>
                <p className="text-sm text-muted-foreground">Total Size</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {files.length > 0 && !isScanning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Scan Complete
            </CardTitle>
            <CardDescription>
              Your files have been analyzed. Navigate to other sections to see detailed results.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
