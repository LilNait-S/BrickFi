"use client"

import { useState } from "react"
import { ProgressBar } from "@/components/progress-bar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dataMock } from "@/data/images"
import { useInvestInProject } from "@/services/pool/mutate"
import { PUBLIC_PHASE_LABELS, useGetProject } from "@/services/pool/query"
import { useApproveUSDC, useMintUSDC } from "@/services/usdc/mutate"
import { useGetUSDCAllowance, useGetUSDCBalance } from "@/services/usdc/query"
import { formatDate, formatTime } from "@/utils/get-time"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  FileText,
  MapPin,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { Address, formatUnits, parseUnits } from "viem"
import { useAccount } from "wagmi"
import { ProjectDetailSkeleton } from "./skeleton"
import { ProjectDetailError } from "./error-proyecto"

// Función para mapear un address del contrato a un ID consistente del mock de imágenes
function getImageMockFromAddress(address: Address): (typeof dataMock)[0] {
  // Convertir el hex del address a un número y usar módulo para seleccionar del array
  const hex = address.toLowerCase().replace("0x", "")
  const numericValue = parseInt(hex.slice(-8), 16) // Usar los últimos 8 caracteres del hex
  const mockIndex = numericValue % dataMock.length
  return dataMock[mockIndex]
}

export default function ProjectDetail() {
  const params = useParams<{ id: Address }>()
  const { address: userAddress } = useAccount()
  const {
    project: projectData,
    isLoading: isLoadingProject,
    error: projectError,
  } = useGetProject(params.id)

  console.log("projectData:", projectData)

  const { execute: invest, isLoading: isInvesting } = useInvestInProject({
    contractAddress: params.id,
    options: {
      onSuccess: () => {
        toast.success("¡Inversión exitosa!")
        setInvestAmount("")
      },
      onError: (error) => {
        toast.error(error.message || "Error al invertir")
      },
    },
  })

  const { execute: approve, isLoading: isApproving } = useApproveUSDC({
    spender: params.id, // Usar el address del contrato del proyecto
    options: {
      onSuccess: () => {
        toast.success("Aprobación exitosa")
      },
    },
  })

  // Hook para obtener el allowance actual en tiempo real
  const { data: currentAllowance } = useGetUSDCAllowance({
    ownerAddress: userAddress,
    spenderAddress: params.id,
  })

  const [investAmount, setInvestAmount] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)

  const { execute: mint } = useMintUSDC()
  const { data: usdcBalance } = useGetUSDCBalance()

  // Mostrar skeleton mientras carga
  if (isLoadingProject) {
    return <ProjectDetailSkeleton />
  }

  // // Mostrar error si hay un error
  // if (projectError) {
  //   return (
  //     <ProjectDetailError
  //       error={projectError}
  //       onRetry={() => window.location.reload()}
  //     />
  //   )
  // }

  // Si no hay datos del proyecto después de cargar
  if (!projectData) {
    return (
      <div className="container py-12 min-h-screen mx-auto">
        <div className="text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto" />
          <h1 className="text-3xl font-bold">Proyecto no encontrado</h1>
          <p className="text-muted-foreground">
            No se encontró información para este proyecto
          </p>
          <Button asChild>
            <Link href="/proyectos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Proyectos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Obtener las imágenes mock basadas en el address del contrato
  const imageMock = getImageMockFromAddress(params.id)
  const projectImages = imageMock.images

  // Calcular tiempo restante usando buyingPeriodEnd del blockchain
  const timeRemaining = formatTime(Number(projectData.buyingPeriodEnd))

  // Calcular cuánto falta para alcanzar el softcap
  const totalSoldUSDC = Number(formatUnits(projectData.totalSold, 18))
  const softCapUSDC = Number(formatUnits(projectData.softCapAmount, 18))
  const totalFractionsUSDC = Number(formatUnits(projectData.totalFractions, 18))
  const availableToInvest = Math.max(0, softCapUSDC - totalSoldUSDC)

  // Cálculos de ROI más detallados
  const calculateROI = () => {
    const possibleReturnRate = projectData.possibleReturn / 100 // Convertir % a decimal
    const expectedReturn = totalFractionsUSDC * (1 + possibleReturnRate)
    const netProfit = expectedReturn - totalFractionsUSDC
    const roiPercentage = (netProfit / totalFractionsUSDC) * 100

    return {
      investmentAmount: totalFractionsUSDC,
      expectedReturn: expectedReturn,
      netProfit: netProfit,
      roiPercentage: roiPercentage,
      timeToMaturity:
        Number(projectData.maxRepaymentTime) - Number(projectData.startTime),
    }
  }

  const roiData = calculateROI()

  // Función helper para verificar si necesita aprobación
  const needsApproval = (amount: string): boolean => {
    if (!amount || !currentAllowance) return true
    try {
      const amountBigInt = parseUnits(amount, 18)
      return currentAllowance < amountBigInt
    } catch {
      return true
    }
  }

  // Función helper para verificar si puede invertir
  const canInvest = (amount: string): boolean => {
    if (!amount || !currentAllowance || !userAddress) return false
    try {
      const amountBigInt = parseUnits(amount, 18)
      return currentAllowance >= amountBigInt
    } catch {
      return false
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container space-y-8 mx-auto">
        {/* Back Button */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/proyectos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Proyectos
            </Link>
          </Button>
          <div className="flex items-center gap-6">
            <Button onClick={mint}>Mintear USDC</Button>
            <span>{formatUnits(usdcBalance ?? BigInt(0), 18)}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative h-96 overflow-hidden rounded-2xl">
              <img
                src={projectImages[selectedImage]}
                alt={projectData.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thumbnails Gallery with Scroll */}
            <ScrollArea className="w-full">
              <div className="flex gap-4 py-4 px-1">
                {projectImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-24 w-32 shrink-0 overflow-hidden rounded-lg transition-all cursor-pointer ${
                      selectedImage === idx
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${projectData.name} - imagen ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-bold">{projectData.name}</h1>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Lima, Perú</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <FileText className="h-4 w-4" />
                <a
                  href={projectData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Ver detalles del proyecto
                </a>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Proyecto de tokenización inmobiliaria. Invierte y obtén
              rendimientos cuando el proyecto se complete.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <Card className="gradient-card border-primary/20">
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">
                    ROI Estimado
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {roiData.roiPercentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${roiData.netProfit.toLocaleString()} ganancia
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-primary/20">
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">
                    Tiempo Restante
                  </p>
                  <p className="text-3xl font-bold">{timeRemaining}</p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-primary/20">
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">Estado</p>
                  <Badge variant="default">
                    {
                      PUBLIC_PHASE_LABELS[
                        projectData.currentPhase as keyof typeof PUBLIC_PHASE_LABELS
                      ]
                    }
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="gradient-card border-primary/20">
              <CardContent className="space-y-4">
                <ProgressBar
                  current={totalSoldUSDC}
                  softCap={softCapUSDC}
                  target={Number(formatUnits(projectData.totalFractions, 18))}
                />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Meta Total</p>
                    <p className="font-bold text-lg">
                      $
                      {Number(
                        formatUnits(projectData.totalFractions, 18)
                      ).toLocaleString()}{" "}
                      USDC
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Soft Cap</p>
                    <p className="font-bold text-lg text-primary">
                      ${softCapUSDC.toLocaleString()} USDC
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invest" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="invest">Invertir</TabsTrigger>
            <TabsTrigger value="roi">ROI Análisis</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="invest" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Realizar Inversión</CardTitle>
                <CardDescription>
                  Invierte en este proyecto y recibe tokens que representan tu
                  participación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectData.currentPhase !== 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Este proyecto ya no está aceptando inversiones. Estado
                      actual:{" "}
                      {
                        PUBLIC_PHASE_LABELS[
                          projectData.currentPhase as keyof typeof PUBLIC_PHASE_LABELS
                        ]
                      }
                    </AlertDescription>
                  </Alert>
                ) : availableToInvest <= 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Este proyecto ha alcanzado su objetivo de financiamiento
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Conecta tu wallet y completa el proceso KYC para
                        invertir en este proyecto
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Monto a invertir (USDC)
                      </label>
                      <Input
                        type="number"
                        placeholder="Mínimo: 100"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        min={100}
                        step="100"
                      />
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Disponible para invertir: $
                          {availableToInvest.toLocaleString()} USDC • Inversión
                          mínima: $100 USDC
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Botón de Aprobación - Solo aparece si necesita aprobación */}
                      {needsApproval(investAmount) && investAmount && (
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={async () => {
                            if (!investAmount) {
                              toast.error("Ingresa un monto válido primero")
                              return
                            }
                            await approve()
                          }}
                          disabled={
                            isApproving || !investAmount || !userAddress
                          }
                          variant="outline"
                        >
                          {isApproving
                            ? "Aprobando USDC..."
                            : "1. Aprobar USDC"}
                        </Button>
                      )}

                      {/* Botón de Inversión */}
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={async () => {
                          const amount = parseFloat(investAmount)
                          if (isNaN(amount) || amount <= 0) {
                            toast.error("Ingresa un monto válido")
                            return
                          }

                          if (amount < 100) {
                            toast.error("La inversión mínima es $100 USDC")
                            return
                          }

                          // Verificar conexión de wallet
                          if (!userAddress) {
                            toast.error("Conecta tu wallet primero")
                            return
                          }

                          const amountToInvest = parseUnits(investAmount, 18)

                          // Verificar aprobación antes de invertir
                          if (needsApproval(investAmount)) {
                            toast.error(
                              "Primero debes aprobar el monto de USDC"
                            )
                            return
                          }

                          try {
                            await invest({ amountToInvest })
                          } catch (error) {
                            console.error("Error al invertir:", error)
                          }
                        }}
                        disabled={
                          isInvesting ||
                          !investAmount ||
                          !userAddress ||
                          needsApproval(investAmount)
                        }
                      >
                        {isInvesting
                          ? "Procesando inversión..."
                          : canInvest(investAmount)
                          ? "2. Invertir Ahora"
                          : !userAddress
                          ? "Conectar Wallet"
                          : "Invertir (Aprobar primero)"}
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1 pt-2">
                      <p>
                        • Recibirás tokens ERC-20 proporcionales a tu inversión
                      </p>
                      <p>
                        • Los tokens te permitirán reclamar tu ROI al finalizar
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roi" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Análisis Detallado de ROI
                </CardTitle>
                <CardDescription>
                  Proyección de retornos y análisis de rentabilidad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">
                      Resumen Financiero
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">
                          Inversión Total Requerida:
                        </span>
                        <span className="font-bold">
                          ${roiData.investmentAmount.toLocaleString()} USDC
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">
                          Retorno Total Esperado:
                        </span>
                        <span className="font-bold text-primary">
                          ${roiData.expectedReturn.toLocaleString()} USDC
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 border border-green-200">
                        <span className="text-green-700">Ganancia Neta:</span>
                        <span className="font-bold text-green-700">
                          +${roiData.netProfit.toLocaleString()} USDC
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="text-primary">ROI Porcentual:</span>
                        <span className="font-bold text-primary text-xl">
                          {roiData.roiPercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">
                      Cronograma de Venta
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">
                          Inicio de Venta:
                        </span>
                        <span className="font-bold">
                          {formatDate(Number(projectData.startTime))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">
                          Fin Período de Compra:
                        </span>
                        <span className="font-bold">
                          {formatDate(Number(projectData.buyingPeriodEnd))}
                        </span>
                      </div>
                      {/* <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 border border-orange-200">
                        <span className="text-orange-700">
                          Plazo Máximo Devolución:
                        </span>
                        <span className="font-bold text-orange-700">
                          {Math.ceil(Number(projectData.maxRepaymentTime) / (60 * 60 * 24))} días máx.
                        </span>
                      </div> */}
                      <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-muted-foreground">
                          Duración del Proyecto:
                        </span>
                        <span className="font-bold text-primary">
                          {(() => {
                            const totalDays = Math.ceil(
                              (Number(projectData.maxRepaymentTime) -
                                Number(projectData.buyingPeriodEnd)) /
                                (60 * 60 * 24)
                            )
                            const months = Math.floor(totalDays / 30)
                            const remainingDays = totalDays % 30

                            if (months > 0 && remainingDays > 0) {
                              return `${months} ${
                                months === 1 ? "mes" : "meses"
                              } y ${remainingDays} ${
                                remainingDays === 1 ? "día" : "días"
                              }`
                            } else if (months > 0) {
                              return `${months} ${
                                months === 1 ? "mes" : "meses"
                              }`
                            } else {
                              return `${totalDays} ${
                                totalDays === 1 ? "día" : "días"
                              }`
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Nota importante:</strong> Las proyecciones de ROI
                    están basadas en el {projectData.possibleReturn}% de retorno
                    configurado en el smart contract. Los rendimientos reales
                    pueden variar según el desempeño del proyecto inmobiliario y
                    las condiciones del mercado.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cronograma
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha de inicio
                    </p>
                    <p className="font-medium">
                      {formatDate(Number(projectData.startTime))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fin período de compra
                    </p>
                    <p className="font-medium">
                      {formatDate(Number(projectData.buyingPeriodEnd))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Retorno máximo en
                    </p>
                    <p className="font-medium">
                      {formatDate(Number(projectData.maxRepaymentTime))}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Financiamiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Inversión Total
                    </p>
                    <p className="font-bold text-xl">
                      ${roiData.investmentAmount.toLocaleString()} USDC
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Retorno Esperado
                    </p>
                    <p className="font-bold text-xl text-primary">
                      ${roiData.expectedReturn.toLocaleString()} USDC
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ganancia Neta
                    </p>
                    <p className="font-bold text-xl text-green-600">
                      +${roiData.netProfit.toLocaleString()} USDC
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentación del Proyecto
                </CardTitle>
                <CardDescription>
                  Todos los documentos legales y técnicos verificados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: "Planos del Proyecto", url: projectData.url },
                    { name: "Análisis de Mercado", url: projectData.url },
                    { name: "Documentación Legal", url: projectData.url },
                    { name: "Evaluación Técnica", url: projectData.url },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver Documento
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
