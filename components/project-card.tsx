"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ProgressBar } from "./progress-bar"
import { Project } from "@/services/pool/query"
import { formatTime } from "@/utils/get-time"
import { formatUnits } from "viem"
import { Address } from "viem"

interface ProjectCardProps {
  project: Project & { contractAddress: Address }
  imageUrl?: string
}

const statusColors: Record<number, string> = {
  0: "bg-green-500/10 text-green-500 border-green-500/20", // Activo
  1: "bg-blue-500/10 text-blue-500 border-blue-500/20", // Financiado
  2: "bg-orange-500/10 text-orange-500 border-orange-500/20", // En Construcción
  3: "bg-purple-500/10 text-purple-500 border-purple-500/20", // Completado
  4: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", // Reembolso
}

// Helper function para obtener el label de fase de forma segura
function getPhaseLabel(phase: number): string {
  const labels: Record<number, string> = {
    0: "Activo",
    1: "Financiado",
    2: "En Construcción",
    3: "Completado",
    4: "Reembolso",
  }
  return labels[phase] || "Activo"
}

export function ProjectCard({ project, imageUrl }: ProjectCardProps) {
  // Calcular tiempo restante hasta el final del período de compra
  const timeLeft = formatTime(Number(project.buyingPeriodEnd))

  // Formatear montos para mostrar (USDC tiene 18 decimales)
  const softCapUSD = formatUnits(project.softCapAmount, 18)
  const totalSoldUSD = formatUnits(project.totalSold, 18)
  const goalUSD = formatUnits(project.totalFractions, 18)

  return (
    <Link href={`/proyectos/${project.contractAddress}`}>
      <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300 p-0 gap-0">
        {/* Imagen del proyecto */}
        <div className="relative h-48 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="bg-linear-to-br from-primary/20 to-primary/5 h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Proyecto Inmobiliario</p>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-2 line-clamp-2">
              {project.name}
            </h3>
            <div className="flex justify-between items-center">
              <Badge
                variant="outline"
                className={`${
                  statusColors[project.currentPhase] || statusColors[0]
                } backdrop-blur-sm border`}
              >
                {getPhaseLabel(project.currentPhase)}
              </Badge>
            </div>
          </div>

          {/* Progress bar usando datos reales */}
          <ProgressBar
            current={Number(totalSoldUSD)}
            softCap={Number(softCapUSD)}
            target={Number(goalUSD)}
          />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Retorno</p>
                <p className="text-sm font-semibold text-primary">
                  {project.possibleReturn}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tiempo</p>
                <p className="text-sm font-semibold">{timeLeft}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
