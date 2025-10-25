"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProjectCard } from "@/components/project-card"
import { mockProjects } from "@/data/mockProjects"

const projectTypes = [
  { value: "all", label: "Todos" },
  { value: "residential", label: "Residencial" },
  { value: "commercial", label: "Comercial" },
  { value: "mixed", label: "Mixto" },
] as const

const projectStatuses = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activo" },
  { value: "funded", label: "Financiado" },
  { value: "construction", label: "En Construcción" },
  { value: "completed", label: "Completado" },
] as const

export default function ProyectosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType =
        selectedType === "all" || project.type === selectedType

      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus

      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchTerm, selectedType, selectedStatus])

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Proyectos de <span className="text-gradient">Inversión</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explora oportunidades de inversión en bienes raíces tokenizados
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <div>
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Tipo de Proyecto
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {projectTypes.map((type) => (
                <Badge
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Estado
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {projectStatuses.map((status) => (
                <Badge
                  key={status.value}
                  variant={
                    selectedStatus === status.value ? "default" : "outline"
                  }
                  className="cursor-pointer px-4 py-2 transition-all hover:scale-105"
                  onClick={() => setSelectedStatus(status.value)}
                >
                  {status.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1
              ? "proyecto encontrado"
              : "proyectos encontrados"}
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron proyectos con los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
