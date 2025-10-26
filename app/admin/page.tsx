"use client"

import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"
import { CustomConnectButton } from "@/components/custom-connect-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Shield,
  Loader2,
  BarChart3,
  Users,
  FolderPlus,
  Settings,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function AdminDashboard() {
  const { address, isConnected } = useAccount()
  const { data: session, status } = useSession()

  // Estado del formulario de crear proyecto
  const [projectForm, setProjectForm] = useState({
    name: "",
    symbol: "",
    fractions: "",
    softcap: "",
    repaymentTime: "",
    possibleReturn: "",
    url: "",
    imageCid: "", // CID de la imagen en IPFS
  })

  const [isCreating, setIsCreating] = useState(false)
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar que sea imagen
      if (!file.type.startsWith("image/")) {
        toast.error("El archivo debe ser una imagen")
        return
      }
      setProjectImageFile(file)
      // Resetear CID si cambia la imagen
      setProjectForm({ ...projectForm, imageCid: "" })
    }
  }

  const handleUploadImage = async () => {
    if (!projectImageFile) {
      toast.error("Selecciona una imagen primero")
      return
    }

    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("file", projectImageFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al subir imagen")
      }

      // Guardar el CID en el formulario
      setProjectForm({ ...projectForm, imageCid: data.cid })
      toast.success("Imagen subida exitosamente a IPFS")
    } catch (error) {
      console.error("Error subiendo imagen:", error)
      toast.error(
        error instanceof Error ? error.message : "Error al subir la imagen"
      )
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // Validar campos requeridos
      if (!projectForm.name || !projectForm.symbol || !projectForm.fractions) {
        toast.error("Por favor completa todos los campos requeridos")
        return
      }

      // Validar que la imagen esté subida si se seleccionó un archivo
      if (projectImageFile && !projectForm.imageCid) {
        toast.error("Por favor sube la imagen antes de crear el proyecto")
        setIsCreating(false)
        return
      }

      // TODO: Aquí iría la lógica para crear el proyecto en el smart contract
      // El imageCid se puede guardar en cualquier blockchain EVM (Ethereum, Scroll, BNB Chain, etc.)
      console.log("Creando proyecto:", projectForm)

      // Simulación de creación
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success(`Proyecto "${projectForm.name}" creado exitosamente`)

      // Limpiar formulario
      setProjectForm({
        name: "",
        symbol: "",
        fractions: "",
        softcap: "",
        repaymentTime: "",
        possibleReturn: "",
        url: "",
        imageCid: "",
      })
      setProjectImageFile(null)
    } catch (error) {
      console.error("Error creando proyecto:", error)
      toast.error("Error al crear el proyecto")
    } finally {
      setIsCreating(false)
    }
  }

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
            <Alert className="bg-green-500/10 border-green-500/20 text-green-500">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Tienes acceso completo al panel de administrador
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Recaudado
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,450,000</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Proyectos Activos
                  </CardTitle>
                  <FolderPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">
                    2 en construcción
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Inversores
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">234</div>
                  <p className="text-xs text-muted-foreground">+42 este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    ROI Promedio
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.85x</div>
                  <p className="text-xs text-muted-foreground">
                    En proyectos completados
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Crear Proyecto */}
          <TabsContent value="create-project">
            <Card>
              <CardHeader>
                <CardTitle>Crear Nuevo Proyecto</CardTitle>
                <CardDescription>
                  Completa el formulario para crear un nuevo proyecto de
                  inversión en la blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProject} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Nombre del Proyecto */}
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nombre del Proyecto{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Edificio Torres del Sol"
                        value={projectForm.name}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Nombre descriptivo del proyecto inmobiliario
                      </p>
                    </div>

                    {/* Símbolo del Token */}
                    <div className="space-y-2">
                      <Label htmlFor="symbol">
                        Símbolo del Token{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="symbol"
                        name="symbol"
                        placeholder="TDS"
                        value={projectForm.symbol}
                        onChange={handleInputChange}
                        required
                        maxLength={10}
                      />
                      <p className="text-xs text-muted-foreground">
                        Máximo 10 caracteres (ej: TDS, BRK, SOL)
                      </p>
                    </div>

                    {/* Monto total a recaudar */}
                    <div className="space-y-2">
                      <Label htmlFor="fractions">
                        Monto Total a Recaudar{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fractions"
                        name="fractions"
                        type="number"
                        placeholder="5000000"
                        value={projectForm.fractions}
                        onChange={handleInputChange}
                        required
                        min="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Monto en USD (ej: 5,000,000 = $5M USD)
                      </p>
                    </div>

                    {/* Softcap */}
                    <div className="space-y-2">
                      <Label htmlFor="softcap">
                        Softcap <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="softcap"
                        name="softcap"
                        type="number"
                        placeholder="2500000"
                        value={projectForm.softcap}
                        onChange={handleInputChange}
                        required
                        min="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Mínimo a recaudar para iniciar (ej: 2,500,000)
                      </p>
                    </div>

                    {/* Tiempo de Repago */}
                    <div className="space-y-2">
                      <Label htmlFor="repaymentTime">
                        Tiempo de Repago (días){" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="repaymentTime"
                        name="repaymentTime"
                        type="number"
                        placeholder="365"
                        value={projectForm.repaymentTime}
                        onChange={handleInputChange}
                        required
                        min="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Días hasta el retorno de inversión (ej: 30, 180, 365)
                      </p>
                    </div>

                    {/* Retorno Posible */}
                    <div className="space-y-2">
                      <Label htmlFor="possibleReturn">
                        Retorno Esperado (%){" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="possibleReturn"
                        name="possibleReturn"
                        type="number"
                        placeholder="7"
                        value={projectForm.possibleReturn}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-muted-foreground">
                        Porcentaje de retorno estimado (ej: 7%, 15%)
                      </p>
                    </div>

                    {/* Imagen del Proyecto */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="projectImage">
                        Imagen del Proyecto{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="projectImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Imagen que se subirá a IPFS/Filecoin (almacenamiento descentralizado)
                      </p>

                      {/* Botón para subir imagen */}
                      {projectImageFile && !projectForm.imageCid && (
                        <Button
                          type="button"
                          onClick={handleUploadImage}
                          disabled={isUploadingImage}
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                        >
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Subiendo a IPFS...
                            </>
                          ) : (
                            "Subir imagen a IPFS/Filecoin"
                          )}
                        </Button>
                      )}

                      {/* Mostrar CID si existe */}
                      {projectForm.imageCid && (
                        <Alert className="mt-2 bg-green-500/10 border-green-500/20">
                          <Shield className="h-4 w-4 text-green-500" />
                          <AlertDescription className="text-green-500">
                            <p className="font-semibold mb-1">
                              ✓ Imagen subida exitosamente a IPFS
                            </p>
                            <p className="text-xs">
                              <strong>CID:</strong>{" "}
                              <code className="bg-green-500/10 px-1 rounded">
                                {projectForm.imageCid}
                              </code>
                            </p>
                            <p className="text-xs mt-1">
                              Ver en:{" "}
                              <a
                                href={`https://ipfs.io/ipfs/${projectForm.imageCid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-green-400"
                              >
                                https://ipfs.io/ipfs/{projectForm.imageCid}
                              </a>
                            </p>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    {/* URL */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="url">URL del Proyecto</Label>
                      <Input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://brickfi.com/proyectos/torres-del-sol"
                        value={projectForm.url}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Link a la página de detalles del proyecto (opcional)
                      </p>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-4 pt-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setProjectForm({
                          name: "",
                          symbol: "",
                          fractions: "",
                          softcap: "",
                          repaymentTime: "",
                          possibleReturn: "",
                          url: "",
                          imageCid: "",
                        })
                        setProjectImageFile(null)
                      }}
                    >
                      Limpiar
                    </Button>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isCreating}
                      className="w-fit"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando Proyecto...
                        </>
                      ) : (
                        "Crear Proyecto"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
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
