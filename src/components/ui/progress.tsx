import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(className)}
      {...props}
    />
  )
}

function ProgressTrack({
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Track>) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className={cn("relative h-2 w-full overflow-hidden rounded-full", className)}
      style={{ background: "var(--muted)" }}
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Indicator>) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "absolute rounded-full transition-all duration-300 ease-out motion-reduce:transition-none",
        className
      )}
      style={{
        background: "linear-gradient(90deg, oklch(0.52 0.22 290), oklch(0.68 0.25 320))",
      }}
      {...props}
    />
  )
}

export { Progress, ProgressTrack, ProgressIndicator }
