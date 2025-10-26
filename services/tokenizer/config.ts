import { sonicTestnet } from "@/wagmi-config"
import { Address } from "viem"
import { TOKENIZER_ABI } from "./abi"

export const TokenizerConfig = {
  address: "0x74B60244ACC8c4160AA55DA0E8B504743f70f4e4" as Address,
  abi: TOKENIZER_ABI,
  chainId: sonicTestnet.id,
} as const
