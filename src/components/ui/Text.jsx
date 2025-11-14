import React from "react"
import { cn } from "../../lib/utils"

export function H1({ children, className }) {
  return (
    <h1 className={cn("text-3xl font-bold tracking-tight", className)}>
      {children}
    </h1>
  )
}

export function H2({ children, className }) {
  return (
    <h2 className={cn("text-2xl font-semibold tracking-tight", className)}>
      {children}
    </h2>
  )
}

export function H3({ children, className }) {
  return (
    <h3 className={cn("text-xl font-semibold", className)}>
      {children}
    </h3>
  )
}

export function Text({ children, className }) {
  return (
    <p className={cn("text-base leading-relaxed text-slate-700", className)}>
      {children}
    </p>
  )
}

export function Muted({ children, className }) {
  return (
    <p className={cn("text-sm text-slate-500", className)}>
      {children}
    </p>
  )
}

export function Small({ children, className }) {
  return (
    <p className={cn("text-xs text-slate-500", className)}>
      {children}
    </p>
  )
}
