import { useReadContracts } from "wagmi"
import { Address } from "viem"
import { PoolConfig } from "./config"

// Tipo para el proyecto formateado
export interface Project {
  owner: Address
  name: string
  totalFractions: bigint // Monto a llegar en ventas
  softCapAmount: bigint
  startTime: bigint
  buyingPeriodEnd: bigint // El fin ex: 6 meses
  maxRepaymentTime: bigint // El tiempo en el que se devolverá el dinero
  possibleReturn: number // uint16 retorna number, que representa el porcentaje de retorno
  url: string
  user: Address
  totalSold: bigint // Total vendido hasta ahora
  totalReInvested: bigint // Monto a reinvertir en un futuro (la empresa) 
  actualRepaymentTime: bigint
}

// Función para formatear el resultado
export function formatProjectData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Project | null {
  // Validar que todos los datos existan
  if (
    !data[0]?.result ||
    !data[1]?.result ||
    data[2]?.result === undefined ||
    data[3]?.result === undefined ||
    data[4]?.result === undefined ||
    data[5]?.result === undefined ||
    data[6]?.result === undefined ||
    data[7]?.result === undefined ||
    !data[8]?.result ||
    !data[9]?.result ||
    data[10]?.result === undefined ||
    data[11]?.result === undefined ||
    data[12]?.result === undefined
  ) {
    return null
  }

  return {
    owner: data[0].result as Address,
    name: data[1].result as string,
    totalFractions: data[2].result as bigint,
    softCapAmount: data[3].result as bigint,
    startTime: data[4].result as bigint,
    buyingPeriodEnd: data[5].result as bigint,
    maxRepaymentTime: data[6].result as bigint,
    possibleReturn: data[7].result as number,
    url: data[8].result as string,
    user: data[9].result as Address,
    totalSold: data[10].result as bigint,
    totalReInvested: data[11].result as bigint,
    actualRepaymentTime: data[12].result as bigint,
  }
}

export function useGetProject() {
  const result = useReadContracts({
    contracts: [
      {
        ...PoolConfig,
        functionName: "owner",
      },
      {
        ...PoolConfig,
        functionName: "name",
      },
      {
        ...PoolConfig,
        functionName: "totalFractions",
      },
      {
        ...PoolConfig,
        functionName: "softCapAmount",
      },
      {
        ...PoolConfig,
        functionName: "startTime",
      },
      {
        ...PoolConfig,
        functionName: "buyingPeriodEnd",
      },
      {
        ...PoolConfig,
        functionName: "maxRepaymentTime",
      },
      {
        ...PoolConfig,
        functionName: "possibleReturn",
      },
      {
        ...PoolConfig,
        functionName: "url",
      },
      {
        ...PoolConfig,
        functionName: "user",
      },
      {
        ...PoolConfig,
        functionName: "totalSold",
      },
      {
        ...PoolConfig,
        functionName: "totalReInvested",
      },
      {
        ...PoolConfig,
        functionName: "actualRepaymentTime",
      },
    ],
  })

  // Formatear datos si están disponibles
  const project = result.data ? formatProjectData(result.data) : null

  return {
    ...result,
    project, // Datos formateados como objeto
  }
}


// getCurrentPhase
// 0 = Fase de compra
// 1 = Se llegó al softcap pero aun se está vendiendo pero el admin ya puede retirar fondos
// 2 = Esperar a que el admin devuelva el dinero a los inversores + la ganancia
// 3 = Reclamar tu inversión + ganancia
// 4 = Si pasan los 6 meses y no sé llegó al softcap, reclamar inversión (reembolso)