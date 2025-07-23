import * as React from "react"
import { cn } from "@/lib/utils"

const ArgonCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "gradient" | "glass"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-card text-card-foreground shadow-card",
    gradient: "bg-gradient-to-br from-card via-white to-accent/5 text-card-foreground shadow-argon",
    glass: "bg-white/40 backdrop-blur-md text-card-foreground shadow-card border border-white/20"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300 hover:shadow-argon hover:-translate-y-1",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
ArgonCard.displayName = "ArgonCard"

const ArgonCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
ArgonCardHeader.displayName = "ArgonCardHeader"

const ArgonCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
ArgonCardTitle.displayName = "ArgonCardTitle"

const ArgonCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ArgonCardDescription.displayName = "ArgonCardDescription"

const ArgonCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
ArgonCardContent.displayName = "ArgonCardContent"

const ArgonCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
ArgonCardFooter.displayName = "ArgonCardFooter"

export { ArgonCard, ArgonCardHeader, ArgonCardFooter, ArgonCardTitle, ArgonCardDescription, ArgonCardContent }