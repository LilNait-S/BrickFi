"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { mockProjects } from "@/data/mockProjects"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/progress-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  MapPin,
  Calendar,
  TrendingUp,
  FileText,
  ArrowLeft,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

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

function calculateDaysLeft(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24)))
}

export default function ProjectDetail() {
  const params = useParams()
  const id = params?.id as string
  const [investAmount, setInvestAmount] = useState("")
  const [isInvesting, setIsInvesting] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const project = mockProjects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="container py-12 min-h-screen">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Proyecto no encontrado</h1>
          <p className="text-muted-foreground">
            El proyecto que buscas no existe o ha sido eliminado
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

  const handleInvest = async () => {
    const amount = parseFloat(investAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Ingresa un monto válido")
      return
    }

    if (amount < project.minInvestment) {
      toast.error(`La inversión mínima es $${project.minInvestment} USDT`)
      return
    }

    setIsInvesting(true)

    // Simulate investment transaction
    setTimeout(() => {
      toast.success(`¡Inversión de $${amount.toLocaleString()} USDT exitosa!`)
      setInvestAmount("")
      setIsInvesting(false)
    }, 2000)
  }

  const daysRemaining = calculateDaysLeft(project.deadline)
  const availableToInvest = project.softCap - project.totalRaised

  return (
    <div className="min-h-screen py-12">
      <div className="container space-y-8 mx-auto">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/proyectos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Proyectos
          </Link>
        </Button>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div >
            {/* Main Image */}
            <div className="relative h-96 overflow-hidden rounded-2xl">
              <img
                src={project.images[selectedImage]}
                alt={project.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thumbnails Gallery with Scroll */}
            <ScrollArea className="w-full">
              <div className="flex gap-4 py-4 px-1">
                {project.images.map((img, idx) => (
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
                      alt={`${project.name} - imagen ${idx + 1}`}
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
                <h1 className="text-4xl font-bold">{project.name}</h1>
                <Badge>{typeLabels[project.type]}</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{project.location}</span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <Card className="gradient-card border-primary/20">
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">
                    ROI Estimado
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {project.roi}x
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-primary/20">
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">
                    Tiempo Restante
                  </p>
                  <p className="text-3xl font-bold">
                    {daysRemaining > 0 ? `${daysRemaining}d` : "Cerrado"}
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card border-primary/20">
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">Estado</p>
                  <Badge variant="default">
                    {statusLabels[project.status]}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card className="gradient-card border-primary/20">
              <CardContent className="space-y-4">
                <ProgressBar
                  current={project.totalRaised}
                  target={project.softCap}
                />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Retorno Total</p>
                    <p className="font-bold text-lg">
                      ${project.targetReturn.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ganancia</p>
                    <p className="font-bold text-lg text-primary">
                      $
                      {(
                        project.targetReturn - project.softCap
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invest" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="invest">Invertir</TabsTrigger>
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
                {project.status !== "active" ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Este proyecto ya no está aceptando inversiones. Estado
                      actual: {statusLabels[project.status]}
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
                        Monto a invertir (USDT)
                      </label>
                      <Input
                        type="number"
                        placeholder={`Mínimo: ${project.minInvestment}`}
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        min={project.minInvestment}
                        step="100"
                      />
                      <p className="text-xs text-muted-foreground">
                        Disponible para invertir: $
                        {availableToInvest.toLocaleString()} USDT • Inversión
                        mínima: ${project.minInvestment.toLocaleString()} USDT
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleInvest}
                      disabled={isInvesting || !investAmount}
                    >
                      {isInvesting ? "Procesando..." : "Invertir Ahora"}
                    </Button>

                    <div className="text-xs text-muted-foreground space-y-1 pt-2">
                      <p>
                        • Recibirás tokens ERC-20 proporcionales a tu inversión
                      </p>
                      <p>
                        • Los tokens te permitirán reclamar tu ROI al finalizar
                      </p>
                      <p>
                        • También recibirás un NFT de participación (soulbound)
                      </p>
                    </div>
                  </>
                )}
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
                      {new Date(project.startDate).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha estimada de finalización
                    </p>
                    <p className="font-medium">
                      {new Date(project.estimatedCompletion).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Duración del proyecto
                    </p>
                    <p className="font-medium">
                      {Math.ceil(
                        (project.estimatedCompletion - project.startDate) /
                          (1000 * 60 * 60 * 24 * 30)
                      )}{" "}
                      meses
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
                    <p className="text-sm text-muted-foreground">Soft Cap</p>
                    <p className="font-bold text-xl">
                      ${project.softCap.toLocaleString()} USDT
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Recaudado actual
                    </p>
                    <p className="font-bold text-xl text-primary">
                      ${project.totalRaised.toLocaleString()} USDT
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Retorno planeado
                    </p>
                    <p className="font-bold text-xl">
                      ${project.targetReturn.toLocaleString()} USDT
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
                  {project.documents.map((doc, idx) => (
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
