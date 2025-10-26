"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ProjectDetailError({
  error,
  onRetry,
}: {
  error: Error
  onRetry: () => void
}) {
  return (
    <div className="container py-12 min-h-screen mx-auto">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-3xl font-bold">Error al cargar el proyecto</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            No se pudo obtener la información del proyecto desde el blockchain.
          </p>
          <p className="text-sm text-muted-foreground">
            {error.message || "Error desconocido"}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={onRetry} variant="default">
            Reintentar
          </Button>
          <Button asChild variant="outline">
            <Link href="/proyectos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Proyectos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
