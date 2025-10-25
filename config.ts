import { z } from "zod"

export const appConfig = {
  // WalletConnect Project ID - Safe to expose publicly
  // This is not a secret key, it's meant to be used client-side
  PROJECT_ID: z
    .string({ message: "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required" })
    .min(1)
    .parse(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID),
}
