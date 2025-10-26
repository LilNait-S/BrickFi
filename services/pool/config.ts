// 0x0748cA7E2Cb2Ba6f02AbBc24f903b61268CF095C

import { sonicTestnet } from "@/wagmi-config"
import { Address } from "viem"
import { POOL_ABI } from "./abi"

export const PoolConfig = {
  address: "0x0748cA7E2Cb2Ba6f02AbBc24f903b61268CF095C" as Address,
  abi: POOL_ABI,
  chainId: sonicTestnet.id,
} as const
