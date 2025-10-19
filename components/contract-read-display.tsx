"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useContract } from "@/lib/hooks/use-contract"
import { useWallet } from "@/lib/hooks/use-wallet"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ContractReadDisplayProps {
  title: string
  description: string
  contractAddress: string
  abi: any[]
  functionName: string
  icon: React.ReactNode
  format?: "eth" | "number" | "string"
}

export function ContractReadDisplay({
  title,
  description,
  contractAddress,
  abi,
  functionName,
  icon,
  format = "number",
}: ContractReadDisplayProps) {
  const [value, setValue] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { readContract, isLoading } = useContract()
  const { isConnected, address } = useWallet()

  const fetchValue = async () => {
    if (!isConnected) return

    try {
      setIsRefreshing(true)
      const args = functionName === "pendingRewards" && address ? [address] : []
      const result = await readContract(contractAddress, abi, functionName, args)
      setValue(result)
    } catch (error) {
      console.error("[v0] Error reading contract:", error)
      setValue(null)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatValue = (v: any): string => {
    if (v === null || v === undefined) return "0"

    switch (format) {
      case "eth":
        return `${(Number(v) / 1e18).toFixed(4)} ETH`
      case "number":
        return v.toString()
      case "string":
      default:
        return v.toString()
    }
  }

  useEffect(() => {
    if (isConnected) {
      fetchValue()
    }
  }, [isConnected, contractAddress, address])

  return (
    <Card className="relative overflow-hidden hover:border-primary/30 transition-all duration-300 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 shrink-0">
            {icon}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchValue}
            disabled={isRefreshing || !isConnected}
            className="h-8 w-8"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {isLoading || isRefreshing ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !isConnected ? (
          <div className="text-center py-8">
            <Badge variant="outline" className="text-muted-foreground">
              Connect wallet to view
            </Badge>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              {formatValue(value)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
