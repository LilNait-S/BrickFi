"use client"

import { ProgressBar } from "@/components/ProgressBar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Project } from "@/data/mockProjects"
import { Clock, MapPin, TrendingUp } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
}

const statusLabels = {
  active: "Activo",
  funded: "Financiado",
  construction: "En Construcción",
  completed: "Completado",
  payout: "Pagando",
}

const typeLabels = {
  residential: "Residencial",
  commercial: "Comercial",
  mixed: "Mixto",
}

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  funded: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  construction: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  completed: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  payout: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

function calculateDaysLeft(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24)))
}

export function ProjectCard({ project }: ProjectCardProps) {
  const daysLeft = calculateDaysLeft(project.deadline)

  return (
    <Link href={`/proyectos/${project.id}`}>
      <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300 p-0 gap-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.images[0]}
            alt={project.name}
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-4">{project.name}</h3>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                {project.location}
              </div>
              <div className="flex gap-4">
                <Badge
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  {typeLabels[project.type]}
                </Badge>
                <Badge
                  variant="outline"
                  className={`${
                    statusColors[project.status]
                  } backdrop-blur-sm border`}
                >
                  {statusLabels[project.status]}
                </Badge>
              </div>
            </div>
          </div>

          <ProgressBar current={project.totalRaised} target={project.softCap} />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ROI Anual</p>
                <p className="text-sm font-semibold text-primary">
                  {project.roi}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tiempo</p>
                <p className="text-sm font-semibold">
                  {daysLeft > 0 ? `${daysLeft} días` : "Cerrado"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
