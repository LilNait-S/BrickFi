"use client"

import Link from "next/link"
import { useAccount } from "wagmi"
import { mockProjects } from "@/data/mockProjects"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Wallet,
  TrendingUp,
  Trophy,
  Gift,
  AlertCircle,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react"
import { toast } from "sonner"
import { CustomConnectButton } from "@/components/custom-connect-button"

// Mock user investments
const userInvestments = [
  {
    project: mockProjects[0],
    tokensOwned: 5000,
    invested: 5000,
    currentValue: 11500,
    canClaim: false,
    nftClaimed: false,
  },
  {
    project: mockProjects[3],
    tokensOwned: 3000,
    invested: 3000,
    currentValue: 5700,
    canClaim: true,
    nftClaimed: false,
  },
]

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const isVerified = true // Mock - cambiar con KYC store cuando esté implementado

  const totalInvested = userInvestments.reduce(
    (sum, inv) => sum + inv.invested,
    0
  )
  const totalCurrentValue = userInvestments.reduce(
    (sum, inv) => sum + inv.currentValue,
    0
  )
  const totalProfit = totalCurrentValue - totalInvested
  const totalROI = ((totalCurrentValue / totalInvested - 1) * 100).toFixed(1)

  const handleClaimPayout = () => {
    toast.success(`¡Retorno reclamado exitosamente del proyecto!`)
  }

  if (!isConnected) {
    return (
      <div className="container py-12 min-h-screen flex items-center justify-center mx-auto">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Conecta tu Wallet</h3>
              <p className="text-muted-foreground">
                Por favor conecta tu wallet para ver tu dashboard de inversiones
              </p>
            </div>
            <CustomConnectButton />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container space-y-8 mx-auto">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mi Dashboard</h1>
              <div className="flex items-center gap-3">
                <code className="px-3 py-1 rounded-lg bg-muted text-sm font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </code>
                {isVerified && (
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    ✓ Verificado
                  </Badge>
                )}
              </div>
            </div>
            <Button asChild>
              <Link href="/proyectos">
                Explorar Proyectos
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {!isVerified && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tu wallet no está verificada. Para invertir necesitas verificación
              KYC.{" "}
              <Link
                href="/admin"
                className="underline font-medium hover:text-primary"
              >
                Solicitar verificación
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="gradient-card border-primary/20">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Invertido
                </p>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold">
                ${totalInvested.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                En {userInvestments.length} proyecto
                {userInvestments.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-primary/20">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Valor Actual
                </p>
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-primary">
                ${totalCurrentValue.toLocaleString()}
              </p>
              <p className="text-xs text-green-500 font-medium">
                +{totalROI}% ROI
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-primary/20">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Ganancia Total
                </p>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-primary">
                ${totalProfit.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Estimado</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-primary/20">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  NFTs
                </p>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Gift className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold">
                {userInvestments.filter((inv) => inv.nftClaimed).length}
              </p>
              <p className="text-xs text-muted-foreground">
                {
                  userInvestments.filter(
                    (inv) => !inv.nftClaimed && inv.canClaim
                  ).length
                }{" "}
                disponible
                {userInvestments.filter(
                  (inv) => !inv.nftClaimed && inv.canClaim
                ).length !== 1
                  ? "s"
                  : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Investments */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Mis Inversiones</h2>

          {userInvestments.length === 0 ? (
            <Card>
              <CardContent className="text-center space-y-4 py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    Aún no has invertido en ningún proyecto
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Explora proyectos disponibles y comienza a invertir
                  </p>
                </div>
                <Button asChild size="lg">
                  <Link href="/proyectos">Explorar Proyectos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {userInvestments.map((investment) => (
                <Card
                  key={investment.project.id}
                  className="gradient-card border-primary/20 overflow-hidden"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          {investment.project.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          {investment.project.location}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={investment.canClaim ? "default" : "outline"}
                      >
                        {investment.project.status === "completed"
                          ? "Completado"
                          : investment.project.status === "construction"
                          ? "En Construcción"
                          : "Activo"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Tokens poseídos
                        </p>
                        <p className="font-bold text-lg">
                          {investment.tokensOwned.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Invertido
                        </p>
                        <p className="font-bold text-lg">
                          ${investment.invested.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Valor actual
                        </p>
                        <p className="font-bold text-lg text-primary">
                          ${investment.currentValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className="font-bold text-lg text-green-500">
                          {investment.project.roi.toFixed(1)}x
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        disabled={!investment.canClaim}
                        onClick={handleClaimPayout}
                      >
                        {investment.canClaim
                          ? "Reclamar Retorno"
                          : "Retorno no disponible"}
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link href={`/proyectos/${investment.project.id}`}>
                        Ver Proyecto <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
