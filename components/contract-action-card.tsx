"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useContract } from "@/lib/hooks/use-contract"
import { useWallet } from "@/lib/hooks/use-wallet"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContractActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  contractAddress: string
  abi: any[]
  functionName: string
  requiresInput?: boolean
  inputPlaceholder?: string
  buttonText: string
}

export function ContractActionCard({
  title,
  description,
  icon,
  contractAddress,
  abi,
  functionName,
  requiresInput = false,
  inputPlaceholder = "",
  buttonText,
}: ContractActionCardProps) {
  const [inputValue, setInputValue] = useState("")
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string>("")
  const { writeContract, isLoading } = useContract()
  const { isConnected, address } = useWallet()
  const { toast } = useToast()

  const handleAction = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (requiresInput && !inputValue) {
      toast({
        title: "Input required",
        description: inputPlaceholder || "Please enter a value",
        variant: "destructive",
      })
      return
    }

    try {
      setTxStatus("pending")

      console.log("[v0] Starting transaction:", { title, functionName, inputValue })

      const args = requiresInput && inputValue ? [inputValue] : address ? [address] : []

      const hash = await writeContract(contractAddress, abi, functionName, args)

      setTxHash(hash)
      setTxStatus("success")

      toast({
        title: "Transaction submitted!",
        description: (
          <div className="space-y-1">
            <p>Your transaction has been sent to the network</p>
            <p className="text-xs font-mono">{hash.slice(0, 20)}...</p>
          </div>
        ),
      })

      setInputValue("")

      setTimeout(() => {
        setTxStatus("idle")
        setTxHash("")
      }, 3000)
    } catch (error: any) {
      console.error("[v0] Transaction failed:", error)
      setTxStatus("error")

      toast({
        title: "Transaction failed",
        description: error.message || "Please try again",
        variant: "destructive",
      })

      setTimeout(() => {
        setTxStatus("idle")
      }, 3000)
    }
  }

  return (
    <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
            {icon}
          </div>
          {txStatus === "success" && <CheckCircle2 className="w-5 h-5 text-green-500 animate-in fade-in zoom-in" />}
          {txStatus === "error" && <XCircle className="w-5 h-5 text-destructive animate-in fade-in zoom-in" />}
        </div>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 relative flex-1 flex flex-col justify-end">
        {requiresInput && (
          <div className="space-y-2">
            <Input
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-secondary/50"
              disabled={txStatus === "pending"}
            />
            <p className="text-xs text-muted-foreground">
              {functionName === "vote" ? "Enter the proposal ID you want to vote on" : "Enter required value"}
            </p>
          </div>
        )}

        <Button
          onClick={handleAction}
          disabled={isLoading || !isConnected || txStatus === "pending"}
          className="w-full"
          variant={txStatus === "success" ? "default" : "default"}
        >
          {txStatus === "pending" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Confirm in wallet...
            </>
          ) : txStatus === "success" ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Success!
            </>
          ) : (
            buttonText
          )}
        </Button>

        {txStatus === "success" && txHash && (
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-center text-primary hover:underline"
          >
            View on BaseScan →
          </a>
        )}
      </CardContent>
    </Card>
  )
}
