import { sonicTestnet } from "@/wagmi-config"
import { USDC_ABI } from "./abi"
import { Address } from "viem"

export const USDCConfig = {
  address: "0x9585c43d19B3D94701729815684E986D5a4346e7" as Address,
  abi: USDC_ABI,
  chainId: sonicTestnet.id,
} as const
