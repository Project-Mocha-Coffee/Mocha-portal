import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: React.ReactNode
}

export function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-400"
      case "negative":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <Card className="bg-[#ffffff] dark:bg-[#1C1C1C] border-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className="text-xl font-semibold text-white dark:text-white">{value}</p>
            {change && <p className={`text-sm ${getChangeColor()}`}>{change}</p>}
          </div>
          {icon && <div className="text-[#522912]">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
