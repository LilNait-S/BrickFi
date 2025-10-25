"use client"

import "@rainbow-me/rainbowkit/styles.css"
import { config, sonicTestnet } from "@/wagmi-config"
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1 * 1000 * 60, // stale in 1 minute
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "oklch(0.6216 0.1348 161.9518)",
            accentColorForeground: "oklch(0.985 0 0)",
            borderRadius: "medium",
          })}
          modalSize="wide"
          initialChain={sonicTestnet.id}
        >
          {children}
          <Toaster richColors theme="light" closeButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
