import { Address } from "viem"
import { useAccount, useReadContract } from "wagmi"
import { USDCConfig } from "./config"

export function useGetUSDCBalance(address?: Address) {
  const { address: account } = useAccount()
  const targetAddress = address || account
  return useReadContract({
    ...USDCConfig,
    functionName: "balanceOf",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  })
}

export function useGetUSDCAllowance({
  ownerAddress,
  spenderAddress,
}: {
  ownerAddress?: Address
  spenderAddress?: Address
}) {
  return useReadContract({
    ...USDCConfig,
    functionName: "allowance",
    args:
      ownerAddress && spenderAddress
        ? [ownerAddress, spenderAddress]
        : undefined,
    query: {
      enabled: !!ownerAddress && !!spenderAddress,
    },
  })
}
