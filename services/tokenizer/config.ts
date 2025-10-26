import { sonicTestnet } from "@/wagmi-config"
import { Address } from "viem"
import { TOKENIZER_ABI } from "./abi"

export const TokenizerConfig = {
  address: "0x6BE3e2E19caA30b80a95cd2b615e9DDa87ABEdce" as Address,
  abi: TOKENIZER_ABI,
  chainId: sonicTestnet.id,
} as const
