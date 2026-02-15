"use client"

import loadingSvg from "@/assets/images/loading.svg"
import { cn } from "@/lib/utils"

const Loading = ({ className, fullPage = true }) => {
  return (
    <div className={cn(
      "z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300",
      fullPage ? "fixed inset-0 h-screen w-screen" : "absolute inset-0 h-full w-full min-h-[400px]",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-20 w-20">
          <img
            src={loadingSvg}
            alt="Loading..."
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-lg font-semibold tracking-tight">Loading</p>
          <p className="text-sm text-muted-foreground">Preparing your experience...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading;