"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Transaction {
  hash: string
  status: "pending" | "confirmed" | "failed"
  timestamp: number
  type: string
}

export function TransactionStatusTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Listen for transaction events from localStorage or context
    const handleStorageChange = () => {
      const stored = localStorage.getItem("recent_transactions")
      if (stored) {
        setTransactions(JSON.parse(stored))
      }
    }

    handleStorageChange()
    window.addEventListener("storage", handleStorageChange)

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (transactions.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {transactions.slice(0, 3).map((tx) => (
        <Card
          key={tx.hash}
          className={cn("animate-slide-in-right transition-smooth", tx.status === "pending" && "animate-pulse-glow")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {tx.status === "pending" && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              {tx.status === "confirmed" && <CheckCircle2 className="w-5 h-5 text-green-500 animate-success-bounce" />}
              {tx.status === "failed" && <XCircle className="w-5 h-5 text-destructive" />}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{tx.type}</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      tx.status === "pending" && "text-primary",
                      tx.status === "confirmed" && "text-green-500",
                      tx.status === "failed" && "text-destructive",
                    )}
                  >
                    {tx.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono truncate">{tx.hash.slice(0, 20)}...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
