import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useCreateProject,
  useWhiteListToCreateProject,
} from "@/services/tokenizer/mutate"
import { useGetInstances } from "@/services/tokenizer/query"
import { Loader2, Shield, UserCheck } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Address, parseUnits } from "viem"

export function CreateProject() {
  const { data: address } = useGetInstances()
  console.log("address from useGetAddress:", address)
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

  const [projectImageFile, setProjectImageFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Estado para whitelist
  const [addressToWhitelist, setAddressToWhitelist] = useState("")

  // Hook de whitelist (simula KYC)
  const whitelistMutation = useWhiteListToCreateProject({
    options: {
      onSuccess: () => {
        toast.success(
          "✓ KYC verificado exitosamente - Puede crear e invertir en proyectos"
        )
        setAddressToWhitelist("")
      },
      onError: (error) => {
        toast.error(error.message)
      },
    },
  })

  // Hook de creación de proyecto
  const createProjectMutation = useCreateProject({
    options: {
      onSuccess: () => {
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
      },
      onError: (error) => {
        toast.error(error.message)
      },
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    })
  }

  const formatNumber = (value: string) => {
    if (!value) return ""
    const num = parseFloat(value.replace(/,/g, ""))
    if (isNaN(num)) return ""
    return num.toLocaleString("en-US", {
      maximumFractionDigits: 2,
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

    try {
      // Validar campos requeridos
      if (!projectForm.name || !projectForm.symbol || !projectForm.fractions) {
        toast.error("Por favor completa todos los campos requeridos")
        return
      }

      // Validar que la imagen esté subida si se seleccionó un archivo
      if (projectImageFile && !projectForm.imageCid) {
        toast.error("Por favor sube la imagen antes de crear el proyecto")
        return
      }

      // Validar valores numéricos
      if (
        parseFloat(projectForm.softcap) <= 0 ||
        parseFloat(projectForm.fractions) <= 0
      ) {
        toast.error("Los montos deben ser mayores a 0")
        return
      }

      // Ejecutar la transacción en el smart contract
      await createProjectMutation.execute({
        name: projectForm.name,
        symbol: projectForm.symbol,
        url: projectForm.url, // URL externa del proyecto (no la imagen)
        softCap: parseUnits(projectForm.softcap, 6),
        fraction: parseUnits(projectForm.fractions, 6),
        repaymentTime: parseInt(projectForm.repaymentTime),
        possibleReturn: parseFloat(projectForm.possibleReturn),
      })
    } catch (error) {
      console.error("Error creando proyecto:", error)
      toast.error(
        error instanceof Error ? error.message : "Error al crear el proyecto"
      )
    }
  }

  const handleWhitelist = async () => {
    if (!addressToWhitelist) {
      toast.error("Ingresa una dirección válida")
      return
    }

    try {
      await whitelistMutation.execute(addressToWhitelist as Address)
    } catch (error) {
      console.error("Error whitelisting:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al autorizar la dirección"
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Card de Whitelist */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Verificación KYC (Demo)</CardTitle>
              <CardDescription>
                Simula la aprobación de KYC para permitir crear e invertir en
                proyectos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whitelistAddress">Dirección de Wallet</Label>
              <div className="flex gap-2">
                <Input
                  id="whitelistAddress"
                  placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                  value={addressToWhitelist}
                  onChange={(e) => setAddressToWhitelist(e.target.value)}
                  disabled={whitelistMutation.isLoading}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleWhitelist}
                  disabled={whitelistMutation.isLoading || !addressToWhitelist}
                  size="lg"
                >
                  {whitelistMutation.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {whitelistMutation.isPending
                        ? "Confirmando..."
                        : "Procesando..."}
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Verificar KYC
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Simula la verificación KYC. Las wallets verificadas pueden crear
                proyectos e invertir.
              </p>
            </div>

            {/* Mostrar errores de whitelist */}
            {whitelistMutation.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Error:</strong> {whitelistMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Mostrar hash de whitelist */}
            {whitelistMutation.whitelistHash && (
              <Alert className="bg-green-500/10 border-green-500/20">
                <Shield className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  <p className="font-semibold mb-1">
                    ✓ Verificación KYC completada
                  </p>
                  <p className="text-xs">
                    <strong>Hash:</strong>{" "}
                    <code className="bg-green-500/10 px-1 rounded">
                      {whitelistMutation.whitelistHash}
                    </code>
                  </p>
                  <p className="text-xs mt-1 text-green-400">
                    La wallet ahora puede crear proyectos e invertir en la
                    plataforma
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Card de Crear Proyecto */}
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Proyecto</CardTitle>
          <CardDescription>
            Completa el formulario para crear un nuevo proyecto de inversión en
            la blockchain
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
                  Símbolo del Token <span className="text-destructive">*</span>
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
                {projectForm.fractions && (
                  <p className="text-sm font-semibold text-primary">
                    ${formatNumber(projectForm.fractions)} USD
                  </p>
                )}
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
                {projectForm.softcap && (
                  <p className="text-sm font-semibold text-primary">
                    ${formatNumber(projectForm.softcap)} USD
                  </p>
                )}
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
                  Imagen que se subirá a IPFS/Filecoin (almacenamiento
                  descentralizado)
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
                disabled={createProjectMutation.isLoading}
              >
                Limpiar
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={createProjectMutation.isLoading}
                className="w-fit"
              >
                {createProjectMutation.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {createProjectMutation.isPending
                      ? "Confirmando en Wallet..."
                      : "Procesando..."}
                  </>
                ) : (
                  "Crear Proyecto"
                )}
              </Button>
            </div>

            {/* Mostrar errores si existen */}
            {createProjectMutation.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  <strong>Error:</strong> {createProjectMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            {createProjectMutation.projectReceiptError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  <strong>Error en transacción:</strong>{" "}
                  {createProjectMutation.projectReceiptError.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Mostrar hash de transacción */}
            {createProjectMutation.createHash && (
              <Alert className="mt-4 bg-blue-500/10 border-blue-500/20">
                <Shield className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-500">
                  <p className="font-semibold mb-1">
                    Transacción enviada a la blockchain
                  </p>
                  <p className="text-xs">
                    <strong>Hash:</strong>{" "}
                    <code className="bg-blue-500/10 px-1 rounded">
                      {createProjectMutation.createHash}
                    </code>
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
