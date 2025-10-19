"use client"

import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"

const DAppContent = dynamic(() => import("@/components/dapp-content").then((mod) => ({ default: mod.DAppContent })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading dApp...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DAppContent />
    </div>
  )
}
