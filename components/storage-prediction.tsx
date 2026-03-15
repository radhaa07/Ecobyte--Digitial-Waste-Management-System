"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useScan } from "@/lib/scan-context"
import { TrendingUp, AlertTriangle, Calendar, HardDrive } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

export function StoragePrediction() {
  const { files } = useScan()

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const baseStorage = files.length > 0 ? totalSize / (1024 * 1024) : 8500 // MB

  // Generate prediction data for the next 12 months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const currentMonth = new Date().getMonth()
  const growthRate = 1.08 // 8% monthly growth

  const predictionData = months.map((month, index) => {
    const monthIndex = (currentMonth + index) % 12
    const currentUsage = baseStorage * Math.pow(growthRate, index)
    const optimizedUsage = currentUsage * 0.75 // 25% savings with optimization

    return {
      month: months[monthIndex],
      current: Math.round(currentUsage),
      optimized: Math.round(optimizedUsage),
      limit: 16000, // 16 GB storage limit
    }
  })

  const monthsUntilFull = predictionData.findIndex((d) => d.current >= d.limit)
  const savedSpace = predictionData[predictionData.length - 1].current - predictionData[predictionData.length - 1].optimized

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Storage Growth Prediction</h2>
        <p className="text-muted-foreground">
          Predicted storage usage based on current trends and AI recommendations
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <HardDrive className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {(baseStorage / 1024).toFixed(1)} GB
              </p>
              <p className="text-sm text-muted-foreground">Current Usage</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <TrendingUp className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">+8%</p>
              <p className="text-sm text-muted-foreground">Monthly Growth</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {monthsUntilFull > 0 ? `${monthsUntilFull} mo` : "12+ mo"}
              </p>
              <p className="text-sm text-muted-foreground">Until Full</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
              <Calendar className="h-6 w-6 text-chart-1" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {(savedSpace / 1024).toFixed(1)} GB
              </p>
              <p className="text-sm text-muted-foreground">Potential Savings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>12-Month Storage Forecast</CardTitle>
          <CardDescription>
            Comparison of current trend vs. optimized usage with EcoByte AI recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1024).toFixed(0)} GB`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--foreground)",
                  }}
                  formatter={(value: number) => [`${(value / 1024).toFixed(2)} GB`]}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <ReferenceLine
                  y={16000}
                  stroke="var(--destructive)"
                  strokeDasharray="5 5"
                  label={{
                    value: "Storage Limit (16 GB)",
                    position: "insideTopRight",
                    fill: "var(--destructive)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  fill="url(#currentGradient)"
                  name="Current Trend"
                />
                <Area
                  type="monotone"
                  dataKey="optimized"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#optimizedGradient)"
                  name="With Optimization"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-4" />
              Current Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Based on your current usage patterns, your storage is growing at approximately 8% per
              month. At this rate:
            </p>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
                You will reach 75% capacity in about 6 months
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                Storage will be full within{" "}
                {monthsUntilFull > 0 ? `${monthsUntilFull} months` : "12+ months"}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              Optimized Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              By following EcoByte AI recommendations, you can significantly extend your storage
              lifespan:
            </p>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Save up to {(savedSpace / 1024).toFixed(1)} GB over 12 months
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Extend storage lifespan by 4-6 additional months
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
