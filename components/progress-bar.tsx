import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  current: number
  target: number
  className?: string
}

export function ProgressBar({ current, target, className = "" }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          ${current.toLocaleString()} / ${target.toLocaleString()}
        </span>
        <span className="text-sm font-semibold text-primary">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )
}
