"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/hooks/use-wallet"
import { Wallet, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BASE_CHAIN_ID, BASE_TESTNET_CHAIN_ID } from "@/lib/web3-config"

export function Navbar() {
  const { address, chainId, isConnected, isConnecting, connect, disconnect, switchNetwork } = useWallet()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getNetworkName = (id: number | null) => {
    if (id === BASE_CHAIN_ID) return "Base"
    if (id === BASE_TESTNET_CHAIN_ID) return "Base Sepolia"
    return "Unknown Network"
  }

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Base dApp</h1>
              <p className="text-xs text-muted-foreground">Advanced Wallet UX</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isConnected && chainId && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {getNetworkName(chainId)}
              </div>
            )}

            {isConnected && address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Wallet className="w-4 h-4" />
                    <span className="hidden sm:inline">{formatAddress(address)}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => switchNetwork(BASE_CHAIN_ID)}>
                    Switch to Base Mainnet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchNetwork(BASE_TESTNET_CHAIN_ID)}>
                    Switch to Base Sepolia
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={disconnect} className="text-destructive">
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={connect} disabled={isConnecting} className="gap-2">
                <Wallet className="w-4 h-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
