"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Fuel } from "lucide-react"

interface GasEstimatorProps {
  contractAddress: string
  functionName: string
  args?: any[]
}

export function GasEstimator({ contractAddress, functionName, args = [] }: GasEstimatorProps) {
  const [gasEstimate, setGasEstimate] = useState<string | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)

  useEffect(() => {
    estimateGas()
  }, [contractAddress, functionName, args])

  const estimateGas = async () => {
    if (!window.ethereum) return

    try {
      setIsEstimating(true)
      // In a real app, you would estimate gas here
      // For demo purposes, we'll use a mock value
      await new Promise((resolve) => setTimeout(resolve, 500))
      const mockGas = (Math.random() * 0.001 + 0.0005).toFixed(6)
      setGasEstimate(mockGas)
    } catch (error) {
      console.error("Error estimating gas:", error)
    } finally {
      setIsEstimating(false)
    }
  }

  if (isEstimating) {
    return (
      <Badge variant="outline" className="gap-2 text-muted-foreground">
        <Fuel className="w-3 h-3" />
        Estimating...
      </Badge>
    )
  }

  if (!gasEstimate) return null

  return (
    <Badge variant="outline" className="gap-2 text-muted-foreground">
      <Fuel className="w-3 h-3" />~{gasEstimate} ETH
    </Badge>
  )
}
