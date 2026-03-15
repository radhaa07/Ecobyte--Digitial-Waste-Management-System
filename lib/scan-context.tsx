"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface ScannedFile {
  id: string
  name: string
  type: "image" | "video" | "document" | "screenshot" | "download"
  size: number
  hash: string
  folder: string
  quality?: number
  timestamp: Date
  url?: string
}

export interface DuplicateGroup {
  hash: string
  files: ScannedFile[]
  wastedSpace: number
}

export interface SimilarGroup {
  id: string
  files: ScannedFile[]
  bestPhotoId: string
}

export interface FolderWaste {
  folder: string
  wasteLevel: "high" | "medium" | "low"
  wasteSize: number
  totalSize: number
  percentage: number
}

interface ScanContextType {
  files: ScannedFile[]
  setFiles: (files: ScannedFile[]) => void
  isScanning: boolean
  setIsScanning: (scanning: boolean) => void
  scanProgress: number
  setScanProgress: (progress: number) => void
  duplicates: DuplicateGroup[]
  setDuplicates: (duplicates: DuplicateGroup[]) => void
  similarGroups: SimilarGroup[]
  setSimilarGroups: (groups: SimilarGroup[]) => void
  folderWaste: FolderWaste[]
  setFolderWaste: (waste: FolderWaste[]) => void
  recommendations: string[]
  setRecommendations: (recommendations: string[]) => void
}

const ScanContext = createContext<ScanContextType | undefined>(undefined)

export function ScanProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<ScannedFile[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([])
  const [similarGroups, setSimilarGroups] = useState<SimilarGroup[]>([])
  const [folderWaste, setFolderWaste] = useState<FolderWaste[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])

  return (
    <ScanContext.Provider
      value={{
        files,
        setFiles,
        isScanning,
        setIsScanning,
        scanProgress,
        setScanProgress,
        duplicates,
        setDuplicates,
        similarGroups,
        setSimilarGroups,
        folderWaste,
        setFolderWaste,
        recommendations,
        setRecommendations,
      }}
    >
      {children}
    </ScanContext.Provider>
  )
}

export function useScan() {
  const context = useContext(ScanContext)
  if (context === undefined) {
    throw new Error("useScan must be used within a ScanProvider")
  }
  return context
}
