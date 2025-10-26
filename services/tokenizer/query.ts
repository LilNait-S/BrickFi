import { useReadContract } from "wagmi"
import { TokenizerConfig } from "./config"

export function useGetInstances() {
  return useReadContract({
    ...TokenizerConfig,
    functionName: "createdInstances",
    args: [BigInt(2)],
  })
}
