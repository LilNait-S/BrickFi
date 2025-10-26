/**
 * Convierte un timestamp (en segundos) a formato legible de días, horas y minutos
 * @param timestamp - Timestamp en segundos (no milisegundos)
 * @returns String formateado como "5d 12h 30m" o "2h 45m" o "15m"
 */
export function formatTime(timestamp: number): string {
  // Convertir timestamp de segundos a milisegundos para JavaScript Date
  const date = new Date(timestamp * 1000)
  const now = new Date()

  // Calcular diferencia en milisegundos
  const diffMs = date.getTime() - now.getTime()

  // Si es tiempo pasado, mostrar "Expirado"
  if (diffMs <= 0) {
    return "Expirado"
  }

  // Convertir a minutos, horas y días
  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)

  // Calcular componentes restantes
  const days = totalDays
  const hours = totalHours % 24
  const minutes = totalMinutes % 60

  // Construir string de resultado
  const parts: string[] = []

  if (days > 0) {
    parts.push(`${days}d`)
  }

  if (hours > 0) {
    parts.push(`${hours}h`)
  }

  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes}m`)
  }

  return parts.join(" ")
}

/**
 * Convierte un timestamp a fecha legible en español
 * @param timestamp - Timestamp en segundos
 * @returns Fecha formateada como "25 Oct 2025"
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/**
 * Convierte un timestamp a fecha y hora completa en español
 * @param timestamp - Timestamp en segundos
 * @returns Fecha y hora formateada como "25 Oct 2025, 14:30"
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
