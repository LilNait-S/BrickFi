import { useReadContracts } from "wagmi"
import { Address } from "viem"
import { poolSummaryConfig } from "./config"
import { useGetAllCreatedInstances } from "@/services/tokenizer/query"

export interface Project {
  owner: Address // Creador del proyecto
  name: string // Nombre del proyecto
  totalFractions: bigint // Monto a llegar en ventas
  softCapAmount: bigint // Monto mínimo a recaudar
  startTime: bigint // Tiempo de inicio de la venta
  buyingPeriodEnd: bigint // Tiempo en el que acaba la habilitacion de compra
  
  maxRepaymentTime: bigint // El tiempo en el que se devolverá el dinero
  possibleReturn: number // uint16 retorna number, que representa el porcentaje de retorno
  url: string // La web del proyecto
  user: `0x${string}` // es el hash del primer nombre y dni por lo tanto es como su identificacion un public key pero de su data privada KYC
  totalSold: bigint // Total vendido hasta ahora
  totalReInvested: bigint // Monto a reinvertir en un futuro (la empresa)
  actualRepaymentTime: bigint // Tiempo, empieza a contar cuando está en la phase de espera (la empresa)
  currentPhase: number // Fase actual del proyecto (0-4)
  
}

// Función para formatear el resultado
export function formatProjectData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): Project | null {
  // Validar que todos los datos existan (ahora son 14 campos incluyendo getCurrentPhase)
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
    data[12]?.result === undefined ||
    data[13]?.result === undefined
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
    currentPhase: data[13].result as number,
  }
}

export function useGetProject(contractAddress?: Address) {
  const result = useReadContracts({
    contracts: [
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "owner",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "name",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "totalFractions",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "softCapAmount",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "startTime",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "buyingPeriodEnd",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "maxRepaymentTime",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "possibleReturn",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "url",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "user",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "totalSold",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "totalReInvested",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "actualRepaymentTime",
      },
      {
        ...poolSummaryConfig,
        address: contractAddress,
        functionName: "getCurrentPhase",
      },
    ],
    query: {
      enabled: !!contractAddress, // Solo ejecutar si hay contractAddress
    },
  })

  // Formatear datos si están disponibles
  const project = result.data ? formatProjectData(result.data) : null

  return {
    ...result,
    project, // Datos formateados como objeto
  }
}

export function useGetAllProjects() {
  // Obtener todas las direcciones de los contratos Pool creados
  const {
    instances,
    isLoading: isLoadingInstances,
    error: instancesError,
  } = useGetAllCreatedInstances()

  // Crear contratos para consultar datos de cada proyecto
  const contracts = instances.flatMap((instance) => [
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "owner" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "name" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "totalFractions" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "softCapAmount" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "startTime" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "buyingPeriodEnd" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "maxRepaymentTime" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "possibleReturn" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "url" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "user" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "totalSold" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "totalReInvested" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "actualRepaymentTime" as const,
    },
    {
      ...poolSummaryConfig,
      address: instance.address,
      functionName: "getCurrentPhase" as const,
    },
  ])

  // Ejecutar consultas solo si tenemos instancias
  const result = useReadContracts({
    contracts,
    query: {
      enabled: instances.length > 0, // Solo ejecutar si hay instancias
    },
  })

  // Procesar y formatear resultados
  const projects: Array<Project & { contractAddress: Address }> = []

  if (result.data && instances.length > 0) {
    // Cada proyecto tiene 14 consultas (incluyendo getCurrentPhase), así que agrupamos de 14 en 14
    const fieldsPerProject = 14

    for (let i = 0; i < instances.length; i++) {
      const startIndex = i * fieldsPerProject
      const projectData = result.data.slice(
        startIndex,
        startIndex + fieldsPerProject
      )

      // Formatear datos del proyecto
      const formattedProject = formatProjectData(projectData)

      if (formattedProject) {
        projects.push({
          ...formattedProject,
          contractAddress: instances[i].address, // Agregar la dirección del contrato
        })
      }
    }
  }

  // Combinar estados de carga y errores
  const isLoading = isLoadingInstances || result.isLoading
  const error = instancesError || result.error

  return {
    ...result,
    projects: projects.reverse(), // Invertir para mostrar los más recientes primero
    totalProjects: projects.length,
    isLoading,
    error,
  }
}

/**
 * Fases del proyecto (getCurrentPhase):
 * 0 = Fase de compra - Los usuarios pueden invertir
 * 1 = Softcap alcanzado - Aún se puede invertir, pero el admin ya puede retirar fondos
 * 2 = Esperando pago - El admin debe devolver el dinero + ganancia a los inversores
 * 3 = Listo para reclamar - Los inversores pueden reclamar su inversión + ganancia
 * 4 = Reembolso disponible - Si pasaron 6 meses sin alcanzar softcap, reclamar inversión
 */
export const PROJECT_PHASES = {
  BUYING: 0,
  SOFTCAP_REACHED: 1,
  WAITING_REPAYMENT: 2,
  CLAIM_READY: 3,
  REFUND_AVAILABLE: 4,
} as const

export const PHASE_LABELS = {
  [PROJECT_PHASES.BUYING]: "Fase de Compra",
  [PROJECT_PHASES.SOFTCAP_REACHED]: "Softcap Alcanzado",
  [PROJECT_PHASES.WAITING_REPAYMENT]: "Esperando Pago",
  [PROJECT_PHASES.CLAIM_READY]: "Listo para Reclamar",
  [PROJECT_PHASES.REFUND_AVAILABLE]: "Reembolso Disponible",
} as const

/**
 * Etiquetas públicas para mostrar el estado del proyecto a los usuarios
 * Versión más amigable y comprensible para el público general
 */
export const PUBLIC_PHASE_LABELS = {
  [PROJECT_PHASES.BUYING]: "Activo",
  [PROJECT_PHASES.SOFTCAP_REACHED]: "Financiado",
  [PROJECT_PHASES.WAITING_REPAYMENT]: "En Construcción",
  [PROJECT_PHASES.CLAIM_READY]: "Completado",
  [PROJECT_PHASES.REFUND_AVAILABLE]: "Reembolso",
} as const
