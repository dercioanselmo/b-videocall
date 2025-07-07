"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group border-none bg-dark-1 text-white"
      style={
        {
          "--normal-bg": "var(--dark-1)",
          "--normal-text": "var(--white-2",
          "--normal-border": "var(--transparent)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
