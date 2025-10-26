import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  current: number // Total vendido hasta ahora
  softCap: number // Mínimo a recaudar
  target: number // Meta total
  className?: string
}

export function ProgressBar({
  current,
  softCap,
  target,
  className = "",
}: ProgressBarProps) {
  const softCapPercentage = Math.min((softCap / target) * 100, 100)
  const currentPercentage = Math.min((current / target) * 100, 100)

  const softCapReached = current >= softCap

  return (
    <div className={`w-full ${className}`}>
      {/* Información superior */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">
            Recaudado: ${current.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            Softcap: ${softCap.toLocaleString()} {softCapReached && "✓"}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-primary">
            {currentPercentage.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">
            Meta: ${target.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Barra de progreso con softcap */}
      <div className="relative">
        <Progress value={currentPercentage} className="h-3" />

        {/* Línea indicadora del softcap */}
        <div
          className="absolute top-0 h-3 w-0.5 bg-orange-500 z-10"
          style={{ left: `${softCapPercentage}%` }}
          title={`Softcap: $${softCap.toLocaleString()}`}
        />

        {/* Etiqueta del softcap */}
        {softCapPercentage > 10 && softCapPercentage < 90 && (
          <div
            className="absolute -top-6 transform -translate-x-1/2 text-xs text-orange-500 font-medium"
            style={{ left: `${softCapPercentage}%` }}
          >
            Softcap
          </div>
        )}
      </div>
    </div>
  )
}
