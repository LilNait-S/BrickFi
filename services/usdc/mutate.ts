import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { Address, maxUint256 } from "viem"
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"

import { useGetUSDCAllowance } from "./query"

import { USDCConfig } from "./config"
import { TokenizerConfig } from "../tokenizer/config"

interface Options {
  onSuccess?: () => void
  onMintSuccess?: (hash: Address) => void
  onApproveSuccess?: (hash: Address) => void
}

export function useApproveUSDC({
  spender = TokenizerConfig.address, // TODO: TEMPORAL
  approveAmount = maxUint256,
  options,
}: {
  spender?: Address
  approveAmount?: bigint
  options?: Options
} = {}) {
  const queryClient = useQueryClient()
  const { address } = useAccount()

  // -----------------------------
  // 0) Allowance actual
  // -----------------------------
  const allowanceQuery = useGetUSDCAllowance({
    ownerAddress: address,
    spenderAddress: spender,
  })

  const currentAllowance = allowanceQuery.data

  // -----------------------------
  // 1) Simulación del approve
  // -----------------------------
  const simulateApprove = useSimulateContract({
    ...USDCConfig,
    functionName: "approve",
    args: [spender, approveAmount],
    query: { enabled: !!spender },
  })

  // -----------------------------
  // 2) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [approveHash, setApproveHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [executeError, setExecuteError] = useState<Error | undefined>()

  // -----------------------------
  // 3) Receipt
  // -----------------------------
  const approveReceipt = useWaitForTransactionReceipt({
    hash: approveHash,
    chainId: USDCConfig.chainId,
  })

  // -----------------------------
  // 4) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (approveReceipt.isSuccess && approveHash) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      options?.onApproveSuccess?.(approveHash)
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveReceipt.isSuccess, approveHash])

  // -----------------------------
  // 5) Ejecutar approve
  // -----------------------------
  const isReady = !!simulateApprove.data && !simulateApprove.isLoading

  const execute = async () => {
    if (!simulateApprove.data) return
    if (isPending) return // Prevenir múltiples clics

    setExecuteError(undefined) // Reset error
    try {
      setIsPending(true)
      const hash = await writeContractAsync(simulateApprove.data.request)
      setApproveHash(hash)
    } catch (error) {
      setExecuteError(error instanceof Error ? error : new Error(String(error)))
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading =
    isPending ||
    allowanceQuery.isLoading ||
    simulateApprove.isLoading ||
    approveReceipt.isLoading
  const isSuccess = approveReceipt.isSuccess

  const errors = useMemo(
    () => ({
      allowanceError: allowanceQuery.error,
      simulateApproveError: simulateApprove.error,
      approveReceiptError: approveReceipt.error,
      executeError,
    }),
    [
      allowanceQuery.error,
      simulateApprove.error,
      approveReceipt.error,
      executeError,
    ]
  )

  return {
    // estados
    isReady,
    isLoading,
    isPending,
    isSuccess,

    // datos
    approveHash,
    approveReceipt: approveReceipt.data,
    currentAllowance,
    approveAmount,

    // errores
    ...errors,

    // acción
    execute,
  }
}

export function useMintUSDC({
  options,
}: {
  options?: Options
} = {}) {
  const queryClient = useQueryClient()

  // -----------------------------
  // 1) Simulación del mint
  // -----------------------------
  const simulateMint = useSimulateContract({
    ...USDCConfig,
    functionName: "mint",
    args: [BigInt(1)],
  })

  // -----------------------------
  // 2) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [mintHash, setMintHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)

  // -----------------------------
  // 3) Receipt
  // -----------------------------
  const mintReceipt = useWaitForTransactionReceipt({
    hash: mintHash,
    chainId: USDCConfig.chainId,
  })

  // -----------------------------
  // 4) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (mintReceipt.isSuccess && mintHash) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      options?.onMintSuccess?.(mintHash)
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintReceipt.isSuccess, mintHash])

  // -----------------------------
  // 5) Ejecutar mint
  // -----------------------------
  const isReady = !!simulateMint.data && !simulateMint.isLoading

  const execute = async () => {
    if (!simulateMint.data) return
    if (isPending) return // Prevenir múltiples clics

    try {
      setIsPending(true)
      const hash = await writeContractAsync(simulateMint.data.request)
      setMintHash(hash)
    } catch (error) {
      console.error("Error minting USDC:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || simulateMint.isLoading || mintReceipt.isLoading
  const isSuccess = mintReceipt.isSuccess

  const errors = useMemo(
    () => ({
      simulateMintError: simulateMint.error,
      mintReceiptError: mintReceipt.error,
    }),
    [simulateMint.error, mintReceipt.error]
  )

  return {
    // estados
    isReady,
    isLoading,
    isPending,
    isSuccess,

    // datos
    mintHash,
    mintReceipt: mintReceipt.data,

    // errores
    ...errors,

    // acción
    execute,
  }
}
