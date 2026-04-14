import * as React from "react"
import { cn } from "@/lib/utils"

const Toast = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "fixed bottom-4 right-4 z-50 p-4 bg-card border border-border rounded-lg shadow-lg",
        className
      )}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

export { Toast }