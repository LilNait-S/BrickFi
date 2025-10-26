import { sonicTestnet } from "@/wagmi-config"
import { USDC_ABI } from "./abi"
import { Address } from "viem"

export const USDCConfig = {
  address: "0x40C5983fdEf22303cE096Aca89106a1447EcdCAb" as Address,
  abi: USDC_ABI,
  chainId: sonicTestnet.id,
} as const
