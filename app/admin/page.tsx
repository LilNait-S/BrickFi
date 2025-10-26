"use client"

import { CustomConnectButton } from "@/components/custom-connect-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  BarChart3,
  FolderPlus,
  Loader2,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"
import { CreateProject } from "./create-project"
import { OverView } from "./overview"

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
    <main className="min-h-screen py-12">
      <div className="container mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">Panel de Administrador</h1>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                ✓ Admin
              </span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Wallet:{" "}
            <code className="px-2 py-1 rounded bg-muted text-sm">
              {address}
            </code>
          </p>
        </header>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="create-project">
              <FolderPlus className="h-4 w-4 mr-2" />
              Crear Proyecto
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <OverView />
          </TabsContent>

          {/* Tab: Crear Proyecto */}
          <TabsContent value="create-project">
            {/* Solo renderizar cuando el tab esté activo para evitar errores */}
            <CreateProject />
          </TabsContent>

          {/* Tab: Usuarios */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>
                  Administra inversores y verificaciones KYC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidad de usuarios próximamente...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Configuración */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>
                  Ajustes generales y parámetros de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configuraciones próximamente...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
