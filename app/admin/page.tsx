"use client"

import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"
import { CustomConnectButton } from "@/components/custom-connect-button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Shield, Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const { address, isConnected } = useAccount()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </main>
    )
  }

  if (!isConnected || !session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Acceso Admin</h3>
              <p className="text-muted-foreground">
                Conecta tu wallet para acceder al panel de administrador
              </p>
            </div>
            <CustomConnectButton />
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!session.isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold">Acceso Denegado</h3>
              <p className="text-muted-foreground">
                Tu wallet no tiene permisos de administrador
              </p>
              <code className="block px-3 py-2 rounded-lg bg-muted text-sm font-mono mt-4">
                {address}
              </code>
            </div>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Solo las wallets autorizadas pueden acceder a esta sección.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      <section className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Panel de Administrador
            </h1>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
              ✓ Admin
            </span>
          </div>
          <p className="text-sm text-neutral-400">Wallet: {address}</p>
        </header>

        <Alert className="bg-green-500/10 border-green-500/20 text-green-500">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Tienes acceso completo al panel de administrador
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-neutral-900 p-4 shadow-xl border border-neutral-800">
            <h2 className="text-lg font-medium">Métricas</h2>
            <p className="text-xs text-neutral-500">Tus KPIs irían aquí.</p>
            <div className="text-3xl font-bold mt-4">123</div>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-4 shadow-xl border border-neutral-800">
            <h2 className="text-lg font-medium">Usuarios activos</h2>
            <div className="text-3xl font-bold mt-4">42</div>
          </div>
        </div>
      </section>
    </main>
  )
}
