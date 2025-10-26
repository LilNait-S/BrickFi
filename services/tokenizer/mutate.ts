import { useEffect, useState } from "react"
import { Address, keccak256, toHex } from "viem"
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { useQueryClient } from "@tanstack/react-query"
import { TokenizerConfig } from "./config"

interface Options {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Genera un hash mock de KYC exitoso
 * En producción, este hash vendría del sistema de verificación KYC
 */
const generateMockKycHash = (userAddress: Address): Address => {
  // Crear un hash único basado en la dirección del usuario + timestamp
  const data = `KYC_VERIFIED_${userAddress}_${Date.now()}`
  const hash = keccak256(toHex(data))
  return hash as Address
}

export function useCreateProject({ options }: { options?: Options } = {}) {
  const queryClient = useQueryClient()
  const { address } = useAccount()

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
  const projectReceipt = useWaitForTransactionReceipt({
    hash: createHash,
    chainId: TokenizerConfig.chainId,
  })

  // -----------------------------
  // 3) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (projectReceipt.isSuccess && createHash && projectReceipt.data) {
      // El address del proyecto creado está en los logs del receipt
      console.log("✅ Proyecto creado exitosamente")
      console.log("Transaction Receipt:", projectReceipt.data)
      console.log("Logs:", projectReceipt.data.logs)
      
      // El valor de retorno (instance address) está en los logs
      // Necesitarías decodificar los logs o usar readContract para obtenerlo
      
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectReceipt.isSuccess, createHash])

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
  // 5) Ejecutar creación de proyecto
  // -----------------------------
  const execute = async (project: {
    name: string
    symbol: string
    url: string
    softCap: bigint
    fraction: bigint
    repaymentTime: number
    possibleReturn: number
  }) => {
    if (!address) {
      const noWalletError = new Error("Conecta tu wallet primero")
      setError(noWalletError)
      throw noWalletError
    }
    if (isPending) return // Prevenir múltiples clics

    try {
      setIsPending(true)
      setError(null)

      // Generar hash de KYC mock para el usuario actual
      const kycHash = generateMockKycHash(address)

      const hash = await writeContractAsync({
        ...TokenizerConfig,
        functionName: "createFraction",
        args: [
          {
            fraction: project.fraction,
            owner: address,
            name: project.name,
            symbol: project.symbol,
            url: project.url,
            user: kycHash, // Hash de KYC mock (en producción vendría del sistema de verificación)
            possibleReturn: project.possibleReturn,
            repaymentTime: project.repaymentTime,
            softCap: project.softCap,
          },
        ],
      })
      
      console.log("📝 Transaction Hash:", hash)
      console.log("⏳ Esperando confirmación para obtener el address del proyecto...")
      
      setCreateHash(hash)
      return hash
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error creating project")
      setError(error)
      console.error("Error creating project:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || projectReceipt.isLoading
  const isSuccess = projectReceipt.isSuccess

  return {
    // estados
    isLoading,
    isPending,
    isSuccess,

    // datos
    createHash,
    projectReceipt: projectReceipt.data,

    // errores
    error,
    projectReceiptError: projectReceipt.error,

    // acción
    execute,
  }
}

// Esta funcion es solo para un demo
export function useWhiteListToCreateProject({
  options,
}: { options?: Options } = {}) {
  const queryClient = useQueryClient()

  // -----------------------------
  // 1) Write contract
  // -----------------------------
  const { writeContractAsync } = useWriteContract()

  const [whitelistHash, setWhitelistHash] = useState<Address | undefined>()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // -----------------------------
  // 2) Receipt
  // -----------------------------
  const whitelistReceipt = useWaitForTransactionReceipt({
    hash: whitelistHash,
    chainId: TokenizerConfig.chainId,
  })

  // -----------------------------
  // 3) Efecto de éxito
  // -----------------------------
  useEffect(() => {
    if (whitelistReceipt.isSuccess && whitelistHash) {
      queryClient.invalidateQueries({ queryKey: ["readContract"] })
      options?.onSuccess?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whitelistReceipt.isSuccess, whitelistHash])

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
  // 5) Ejecutar whitelist
  // -----------------------------
  const execute = async (addressToWhitelist: Address) => {
    console.log("addressToWhitelist:", addressToWhitelist)
    if (!addressToWhitelist) {
      const noAddressError = new Error(
        "Debes proporcionar una dirección para whitelist"
      )
      setError(noAddressError)
      throw noAddressError
    }
    if (isPending) return // Prevenir múltiples clics

    try {
      setIsPending(true)
      setError(null)

      // Usar whiteListUser que probablemente esté disponible para todos
      const hash = await writeContractAsync({
        ...TokenizerConfig,
        functionName: "whiteListLima",
        args: [addressToWhitelist],
        value: BigInt(0), // Agregar value por si requiere pago
      })
      setWhitelistHash(hash)
      return hash
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Error whitelisting address")
      setError(error)
      console.error("Error whitelisting address:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  // Estados combinados
  const isLoading = isPending || whitelistReceipt.isLoading
  const isSuccess = whitelistReceipt.isSuccess

  return {
    // estados
    isLoading,
    isPending,
    isSuccess,

    // datos
    whitelistHash,
    whitelistReceipt: whitelistReceipt.data,

    // errores
    error,
    whitelistReceiptError: whitelistReceipt.error,

    // acción
    execute,
  }
}
