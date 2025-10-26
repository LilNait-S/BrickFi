import { sonicTestnet } from "@/wagmi-config"
import { Address } from "viem"
import { TOKENIZER_ABI } from "./abi"

export const TokenizerConfig = {
  address: "0xC40A6e461fAF3948572a22DaE9a95C236DEDA8eD" as Address,
  abi: TOKENIZER_ABI,
  chainId: sonicTestnet.id,
} as const
