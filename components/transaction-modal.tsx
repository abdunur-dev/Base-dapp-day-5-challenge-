"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react"
import { SuccessConfetti } from "@/components/success-confetti"
import { useState } from "react"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  status: "pending" | "success" | "error"
  txHash?: string
  error?: string
}

export function TransactionModal({ isOpen, onClose, status, txHash, error }: TransactionModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  const getStatusContent = () => {
    switch (status) {
      case "pending":
        return {
          icon: <Loader2 className="w-16 h-16 animate-spin text-primary" />,
          title: "Transaction Pending",
          description: "Please wait while your transaction is being processed...",
        }
      case "success":
        if (!showConfetti) setShowConfetti(true)
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-green-500 animate-success-bounce" />,
          title: "Transaction Successful!",
          description: "Your transaction has been confirmed on the blockchain.",
        }
      case "error":
        return {
          icon: <XCircle className="w-16 h-16 text-destructive" />,
          title: "Transaction Failed",
          description: error || "An error occurred while processing your transaction.",
        }
    }
  }

  const content = getStatusContent()

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              {content.icon}
              <DialogTitle className="text-center text-2xl">{content.title}</DialogTitle>
              <DialogDescription className="text-center">{content.description}</DialogDescription>
            </div>
          </DialogHeader>

          {txHash && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <p className="text-sm font-mono text-foreground break-all">{txHash}</p>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2 bg-transparent transition-smooth hover:scale-105"
                asChild
              >
                <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                  View on BaseScan
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          )}

          <Button onClick={onClose} className="w-full transition-smooth hover:scale-105">
            {status === "pending" ? "Close" : "Done"}
          </Button>
        </DialogContent>
      </Dialog>

      <SuccessConfetti show={showConfetti && status === "success"} onComplete={() => setShowConfetti(false)} />
    </>
  )
}
