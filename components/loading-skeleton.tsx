import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: "card" | "text" | "circle" | "button"
}

export function LoadingSkeleton({ className, variant = "card" }: LoadingSkeletonProps) {
  const baseClasses = "animate-shimmer bg-muted rounded-lg"

  const variantClasses = {
    card: "h-32 w-full",
    text: "h-4 w-full",
    circle: "h-12 w-12 rounded-full",
    button: "h-10 w-24",
  }

  return <div className={cn(baseClasses, variantClasses[variant], className)} />
}

export function ContractCardSkeleton() {
  return (
    <div className="space-y-4 p-6 border border-border rounded-xl bg-card">
      <div className="flex items-start justify-between">
        <LoadingSkeleton variant="circle" />
        <LoadingSkeleton className="h-6 w-20" />
      </div>
      <LoadingSkeleton variant="text" className="w-3/4" />
      <LoadingSkeleton variant="text" className="w-full" />
      <LoadingSkeleton variant="button" className="w-full" />
    </div>
  )
}
