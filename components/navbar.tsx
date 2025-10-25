"use client"

import { desktopMenuItems } from "@/constants/menu-list"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex grow basis-0">
          <Link href="/" className="gap-2 font-bold text-xl items-center">
            <span className="text-gradient">
              BrickFi
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {desktopMenuItems.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex grow basis-0 gap-4 justify-end">
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}
