"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SuccessConfettiProps {
  show: boolean
  onComplete?: () => void
}

export function SuccessConfetti({ show, onComplete }: SuccessConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.3,
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn("absolute top-0 w-2 h-2 rounded-full animate-[fall_2s_ease-in_forwards]")}
          style={{
            left: `${particle.x}%`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
