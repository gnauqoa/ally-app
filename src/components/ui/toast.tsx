"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastVariant = "default" | "success" | "destructive"

export type ToastOptions = {
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type ToastInternal = ToastOptions & { id: number }

type ToastContextValue = {
  toasts: ToastInternal[]
  show: (opts: ToastOptions) => void
  dismiss: (id: number) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

let idCounter = 1

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastInternal[]>([])

  const show = React.useCallback((opts: ToastOptions) => {
    const id = idCounter++
    const toast: ToastInternal = {
      id,
      variant: "default",
      duration: 4000,
      ...opts,
    }
    setToasts((current) => [...current, toast])

    if (toast.duration && toast.duration > 0) {
      window.setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id))
      }, toast.duration)
    }
  }, [])

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const value = React.useMemo(
    () => ({ toasts, show, dismiss }),
    [toasts, show, dismiss]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>")
  }

  const toast = React.useCallback(
    (opts: ToastOptions) => ctx.show(opts),
    [ctx]
  )

  const success = React.useCallback(
    (opts: ToastOptions) =>
      ctx.show({
        ...opts,
        variant: "success",
      }),
    [ctx]
  )

  const error = React.useCallback(
    (opts: ToastOptions) =>
      ctx.show({
        ...opts,
        variant: "destructive",
      }),
    [ctx]
  )

  return { toast, success, error, dismiss: ctx.dismiss }
}

export function Toaster() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 pb-6 px-4 sm:items-end sm:right-4 sm:left-auto">
      {ctx.toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "w-full sm:w-80 rounded-lg border bg-card text-card-foreground shadow-lg p-4 flex items-start gap-3",
            toast.variant === "success" && "border-green-500/60",
            toast.variant === "destructive" && "border-red-500/60"
          )}
        >
          <div className="flex-1">
            {toast.title && (
              <p className="font-medium text-sm mb-1">{toast.title}</p>
            )}
            {toast.description && (
              <p className="text-xs text-muted-foreground whitespace-pre-line">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => ctx.dismiss(toast.id)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}


