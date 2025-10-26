"use client"

import { ProjectCard } from "@/components/project-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetAllProjects } from "@/services/pool/query"
import { dataMock } from "@/data/images"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import { Address } from "viem"

// Función para mapear un address del contrato a un ID consistente del mock de imágenes
function getImageMockFromAddress(address: Address): (typeof dataMock)[0] {
  // Convertir el hex del address a un número y usar módulo para seleccionar del array
  const hex = address.toLowerCase().replace("0x", "")
  const numericValue = parseInt(hex.slice(-8), 16) // Usar los últimos 8 caracteres del hex
  const mockIndex = numericValue % dataMock.length
  return dataMock[mockIndex]
}

const projectStatuses = [
  { value: "all", label: "Todos" },
  { value: 0, label: "Activo" }, // Fase de compra
  { value: 1, label: "Financiado" }, // Softcap alcanzado
  { value: 2, label: "En Construcción" }, // Esperando pago
  { value: 3, label: "Completado" }, // Listo para reclamar
  { value: 4, label: "Reembolso" }, // Reembolso disponible
] as const

export default function ProyectosPage() {
  const { projects, isLoading, error } = useGetAllProjects()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | number>("all")

  const filteredProjects = useMemo(() => {
    if (!projects) return []

    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.url.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        selectedStatus === "all" || project.currentPhase === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [projects, searchTerm, selectedStatus])

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
              placeholder="Buscar por nombre o URL del proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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

        {/* Results Count - Solo mostrar si no está cargando */}
        {!isLoading && (
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1
                ? "proyecto encontrado"
                : "proyectos encontrados"}
            </p>
          </div>
        )}

        {/* Projects Grid */}
        {isLoading ? (
          <ProjectsGridSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">
              Error al cargar los proyectos
            </p>
            <p className="text-sm text-muted-foreground">
              Intenta recargar la página
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const imageMock = getImageMockFromAddress(project.contractAddress)
              return (
                <ProjectCard
                  key={project.contractAddress}
                  project={project}
                  imageUrl={imageMock.images[0]} // Usar la primera imagen del mock
                />
              )
            })}
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

// Componente Skeleton para el grid de proyectos
function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Componente Skeleton para una tarjeta de proyecto
function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Imagen skeleton */}
      <Skeleton className="h-48 w-full" />

      <div className="p-6 space-y-4">
        {/* Título y badge */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
