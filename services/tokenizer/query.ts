import { useReadContract, useReadContracts } from "wagmi"
import { Address } from "viem"
import { TokenizerConfig } from "./config"

export function useGetInstances() {
  return useReadContract({
    ...TokenizerConfig,
    functionName: "createdInstances",
    args: [BigInt(2)],
  })
}

export function useGetAllCreatedInstances() {
  // Límite máximo de instancias a consultar (ajustable según necesidad)
  const maxInstances = 50

  // Crear array de contratos para consultar índices 1 a 50
  // El contrato Tokenizer usa índices 1-based, no 0-based
  const contracts = Array.from({ length: maxInstances }, (_, arrayIndex) => ({
    ...TokenizerConfig,
    functionName: "createdInstances" as const,
    args: [BigInt(arrayIndex + 1)], // Convertir índice de array (0-based) a contrato (1-based)
  }))

  // Ejecutar todas las consultas en paralelo
  const result = useReadContracts({
    contracts,
  })

  // Procesar resultados y filtrar instancias válidas
  const validInstances: Array<{
    index: number
    address: Address
    status: string
  }> = []

  if (result.data) {
    // Iterar a través de los resultados hasta encontrar una dirección vacía
    for (let arrayIndex = 0; arrayIndex < result.data.length; arrayIndex++) {
      const item = result.data[arrayIndex]
      const address = item.result as Address
      const contractIndex = arrayIndex + 1 // Convertir a índice 1-based del contrato

      // Verificar si es una dirección vacía (indica fin de la lista)
      const isEmptyAddress =
        !address || address === "0x0000000000000000000000000000000000000000"

      if (isEmptyAddress) {
        // Encontramos el final de la lista, no hay más instancias
        break
      }

      // Agregar instancia válida si la consulta fue exitosa
      if (item.status === "success") {
        validInstances.push({
          index: contractIndex,
          address: address,
          status: item.status,
        })
      }
    }
  }

  return {
    ...result,
    instances: validInstances,
    totalInstances: validInstances.length,
  }
}
