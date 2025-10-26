import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Address, parseUnits } from "viem"
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { poolSummaryConfig } from "./config"
import { useGetBalance } from "./query"

interface Options {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useInvestInProject({
  contractAddress,
  options,
}: {
  contractAddress: Address
  options?: Options
}) {
  const queryClient = useQueryClient()

  // -----------------------------
  // 1) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [createHash, setCreateHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // -----------------------------
  // 2) Receipt
  // -----------------------------
  const investReceipt = useWaitForTransactionReceipt({
    hash: createHash,
    chainId: poolSummaryConfig.chainId,
  })

  // -----------------------------
  // 3) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (investReceipt.isSuccess && createHash && investReceipt.data) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investReceipt.isSuccess, createHash])

  // -----------------------------
  // 4) Efecto de error
  // -----------------------------
  useEffect(() => {
    if (error) {
      options?.onError?.(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  // -----------------------------
  // 5) Ejecutar inversion
  // -----------------------------
  const execute = async ({ amountToInvest }: { amountToInvest: bigint }) => {
    if (isPending) return

    try {
      setIsPending(true)
      setError(null)

      const hash = await writeContractAsync({
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "buyShares",
        args: [amountToInvest],
      })

      setCreateHash(hash)
      return hash
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al invertir al proyecto")
      setError(error)
      console.error("Error al invertir al proyecto:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || investReceipt.isLoading
  const isSuccess = investReceipt.isSuccess

  return {
    // estados
    isLoading,
    isPending,
    isSuccess,

    // datos
    createHash,
    projectReceipt: investReceipt.data,

    // errores
    error,
    projectReceiptError: investReceipt.error,

    // acción
    execute,
  }
}

export function useFinalizeProjectDemo({
  contractAddress,
  options,
}: {
  contractAddress: Address
  options?: Options
}) {
  const queryClient = useQueryClient()

  // -----------------------------
  // 1) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [createHash, setCreateHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // -----------------------------
  // 2) Receipt
  // -----------------------------
  const finalizeReceipt = useWaitForTransactionReceipt({
    hash: createHash,
    chainId: poolSummaryConfig.chainId,
  })

  // -----------------------------
  // 3) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (finalizeReceipt.isSuccess && createHash && finalizeReceipt.data) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizeReceipt.isSuccess, createHash])

  // -----------------------------
  // 4) Efecto de error
  // -----------------------------
  useEffect(() => {
    if (error) {
      options?.onError?.(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  // -----------------------------
  // 5) Ejecutar finalización del proyecto (demo)
  // -----------------------------
  const execute = async () => {
    if (isPending) return

    try {
      setIsPending(true)
      setError(null)

      const hash = await writeContractAsync({
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "deusExMachina_finishBuyingTime",
      })

      setCreateHash(hash)
      return hash
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al finalizar el proyecto")
      setError(error)
      console.error("Error al finalizar el proyecto:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || finalizeReceipt.isLoading
  const isSuccess = finalizeReceipt.isSuccess

  return {
    // estados
    isLoading,
    isPending,
    isSuccess,

    // datos
    createHash,
    projectReceipt: finalizeReceipt.data,

    // errores
    error,
    projectReceiptError: finalizeReceipt.error,

    // acción
    execute,
  }
}

export function useReembolso({
  contractAddress,
  options,
}: {
  contractAddress: Address
  options?: Options
}) {
  const queryClient = useQueryClient()

  // -----------------------------
  // 1) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [createHash, setCreateHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // -----------------------------
  // 2) Receipt
  // -----------------------------
  const finalizeReceipt = useWaitForTransactionReceipt({
    hash: createHash,
    chainId: poolSummaryConfig.chainId,
  })

  // -----------------------------
  // 3) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (finalizeReceipt.isSuccess && createHash && finalizeReceipt.data) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizeReceipt.isSuccess, createHash])

  // -----------------------------
  // 4) Efecto de error
  // -----------------------------
  useEffect(() => {
    if (error) {
      options?.onError?.(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  // -----------------------------
  // 5) Ejecutar finalización del proyecto (demo)
  // -----------------------------
  const execute = async () => {
    if (isPending) return

    try {
      setIsPending(true)
      setError(null)

      const hash = await writeContractAsync({
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "withdrawFailedRaise",
      })

      setCreateHash(hash)
      return hash
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al finalizar el proyecto")
      setError(error)
      console.error("Error al finalizar el proyecto:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || finalizeReceipt.isLoading
  const isSuccess = finalizeReceipt.isSuccess

  return {
    // estados
    isLoading,
    isPending,
    isSuccess,

    // datos
    createHash,
    projectReceipt: finalizeReceipt.data,

    // errores
    error,
    projectReceiptError: finalizeReceipt.error,

    // acción
    execute,
  }
}
export function useBot({
  contractAddress,
  options,
}: {
  contractAddress: Address
  options?: Options
}) {
  const queryClient = useQueryClient()

  // -----------------------------
  // 1) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [createHash, setCreateHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // -----------------------------
  // 2) Receipt
  // -----------------------------
  const finalizeReceipt = useWaitForTransactionReceipt({
    hash: createHash,
    chainId: poolSummaryConfig.chainId,
  })

  // -----------------------------
  // 3) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (finalizeReceipt.isSuccess && createHash && finalizeReceipt.data) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizeReceipt.isSuccess, createHash])

  // -----------------------------
  // 4) Efecto de error
  // -----------------------------
  useEffect(() => {
    if (error) {
      options?.onError?.(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  // -----------------------------
  // 5) Ejecutar finalización del proyecto (demo)
  // -----------------------------
  const execute = async () => {
    if (isPending) return

    try {
      setIsPending(true)
      setError(null)

      const hash = await writeContractAsync({
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "compoundL",
      })

      setCreateHash(hash)
      return hash
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al finalizar el proyecto")
      setError(error)
      console.error("Error al finalizar el proyecto:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || finalizeReceipt.isLoading
  const isSuccess = finalizeReceipt.isSuccess

  return {
    // estados
    isLoading,
    isPending,
    isSuccess,

    // datos
    createHash,
    projectReceipt: finalizeReceipt.data,

    // errores
    error,
    projectReceiptError: finalizeReceipt.error,

    // acción
    execute,
  }
}

export function useReclamarGanancias({
  contractAddress,
  options,
}: {
  contractAddress: Address
  options?: Options
}) {
  const queryClient = useQueryClient()
  const { data: balanceData } = useGetBalance({
    contractAddress,
  })

  // -----------------------------
  // 1) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [createHash, setCreateHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // -----------------------------
  // 2) Receipt
  // -----------------------------
  const finalizeReceipt = useWaitForTransactionReceipt({
    hash: createHash,
    chainId: poolSummaryConfig.chainId,
  })

  // -----------------------------
  // 3) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (finalizeReceipt.isSuccess && createHash && finalizeReceipt.data) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizeReceipt.isSuccess, createHash])

  // -----------------------------
  // 4) Efecto de error
  // -----------------------------
  useEffect(() => {
    if (error) {
      options?.onError?.(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  // -----------------------------
  // 5) Ejecutar finalización del proyecto (demo)
  // -----------------------------
  const execute = async () => {
    if (isPending) return

    try {
      setIsPending(true)
      setError(null)

      if (!balanceData) {
        throw new Error("Balance data not available")
      }

      const hash = await writeContractAsync({
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "claimReturns",
        args: [balanceData],
      })

      setCreateHash(hash)
      return hash
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al finalizar el proyecto")
      setError(error)
      console.error("Error al finalizar el proyecto:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || finalizeReceipt.isLoading
  const isSuccess = finalizeReceipt.isSuccess

  return {
    // estados
    isLoading,
    isPending,
    isSuccess,

    // datos
    createHash,
    projectReceipt: finalizeReceipt.data,

    // errores
    error,
    projectReceiptError: finalizeReceipt.error,

    // acción
    execute,
  }
}

export function useClaimAdmin({
  contractAddress,
  options,
}: {
  contractAddress: Address
  options?: Options
}) {
  const queryClient = useQueryClient()

  // -----------------------------
  // 1) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [createHash, setCreateHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // -----------------------------
  // 2) Receipt
  // -----------------------------
  const finalizeReceipt = useWaitForTransactionReceipt({
    hash: createHash,
    chainId: poolSummaryConfig.chainId,
  })

  // -----------------------------
  // 3) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (finalizeReceipt.isSuccess && createHash && finalizeReceipt.data) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizeReceipt.isSuccess, createHash])

  // -----------------------------
  // 4) Efecto de error
  // -----------------------------
  useEffect(() => {
    if (error) {
      options?.onError?.(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  // -----------------------------
  // 5) Ejecutar finalización del proyecto (demo)
  // -----------------------------
  const execute = async () => {
    if (isPending) return

    try {
      setIsPending(true)
      setError(null)

      const hash = await writeContractAsync({
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "withdrawRaisedFunds",
      })

      setCreateHash(hash)
      return hash
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al finalizar el proyecto")
      setError(error)
      console.error("Error al finalizar el proyecto:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || finalizeReceipt.isLoading
  const isSuccess = finalizeReceipt.isSuccess

  return {
    // estados
    isLoading,
    isPending,
    isSuccess,

    // datos
    createHash,
    projectReceipt: finalizeReceipt.data,

    // errores
    error,
    projectReceiptError: finalizeReceipt.error,

    // acción
    execute,
  }
}

export function useRegresarFondosAdmin({
  contractAddress,
  amountToReturn = parseUnits("300000", 18),
  options,
}: {
  contractAddress: Address
  amountToReturn?: bigint
  options?: Options
}) {
  const queryClient = useQueryClient()

  // -----------------------------
  // 1) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [createHash, setCreateHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // -----------------------------
  // 2) Receipt
  // -----------------------------
  const finalizeReceipt = useWaitForTransactionReceipt({
    hash: createHash,
    chainId: poolSummaryConfig.chainId,
  })

  // -----------------------------
  // 3) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (finalizeReceipt.isSuccess && createHash && finalizeReceipt.data) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      queryClient.invalidateQueries({ queryKey: ["readContracts"] })
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalizeReceipt.isSuccess, createHash])

  // -----------------------------
  // 4) Efecto de error
  // -----------------------------
  useEffect(() => {
    if (error) {
      options?.onError?.(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  // -----------------------------
  // 5) Ejecutar finalización del proyecto (demo)
  // -----------------------------
  const execute = async () => {
    if (isPending) return

    try {
      setIsPending(true)
      setError(null)

      const hash = await writeContractAsync({
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "returnFunds",
        args: [amountToReturn],
      })

      setCreateHash(hash)
      return hash
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error al finalizar el proyecto")
      setError(error)
      console.error("Error al finalizar el proyecto:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || finalizeReceipt.isLoading
  const isSuccess = finalizeReceipt.isSuccess

  return {
    // estados
    isLoading,
    isPending,
    isSuccess,

    // datos
    createHash,
    projectReceipt: finalizeReceipt.data,

    // errores
    error,
    projectReceiptError: finalizeReceipt.error,

    // acción
    execute,
  }
}
