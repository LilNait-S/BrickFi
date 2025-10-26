import { sonicTestnet } from "@/wagmi-config"
import { Address } from "viem"
import { TOKENIZER_ABI } from "./abi"

export const TokenizerConfig = {
  address: "0x56C4F99Eead221C6C281058718a7004bF0726A34" as Address,
  abi: TOKENIZER_ABI,
  chainId: sonicTestnet.id,
} as const
