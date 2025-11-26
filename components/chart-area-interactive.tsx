"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", enrollments: 372 },
  { date: "2024-04-02", enrollments: 277 },
  { date: "2024-04-03", enrollments: 287 },
  { date: "2024-04-04", enrollments: 502 },
  { date: "2024-04-05", enrollments: 663 },
  { date: "2024-04-06", enrollments: 641 },
  { date: "2024-04-07", enrollments: 425 },
  { date: "2024-04-08", enrollments: 729 },
  { date: "2024-04-09", enrollments: 169 },
  { date: "2024-04-10", enrollments: 451 },
  { date: "2024-04-11", enrollments: 677 },
  { date: "2024-04-12", enrollments: 502 },
  { date: "2024-04-13", enrollments: 722 },
  { date: "2024-04-14", enrollments: 357 },
  { date: "2024-04-15", enrollments: 290 },
  { date: "2024-04-16", enrollments: 328 },
  { date: "2024-04-17", enrollments: 806 },
  { date: "2024-04-18", enrollments: 774 },
  { date: "2024-04-19", enrollments: 423 },
  { date: "2024-04-20", enrollments: 239 },
  { date: "2024-04-21", enrollments: 337 },
  { date: "2024-04-22", enrollments: 394 },
  { date: "2024-04-23", enrollments: 368 },
  { date: "2024-04-24", enrollments: 677 },
  { date: "2024-04-25", enrollments: 465 },
  { date: "2024-04-26", enrollments: 205 },
  { date: "2024-04-27", enrollments: 803 },
  { date: "2024-04-28", enrollments: 302 },
  { date: "2024-04-29", enrollments: 555 },
  { date: "2024-04-30", enrollments: 834 },
  { date: "2024-05-01", enrollments: 385 },
  { date: "2024-05-02", enrollments: 603 },
  { date: "2024-05-03", enrollments: 437 },
  { date: "2024-05-04", enrollments: 805 },
  { date: "2024-05-05", enrollments: 871 },
  { date: "2024-05-06", enrollments: 1018 },
  { date: "2024-05-07", enrollments: 688 },
  { date: "2024-05-08", enrollments: 359 },
  { date: "2024-05-09", enrollments: 407 },
  { date: "2024-05-10", enrollments: 623 },
  { date: "2024-05-11", enrollments: 605 },
  { date: "2024-05-12", enrollments: 437 },
  { date: "2024-05-13", enrollments: 357 },
  { date: "2024-05-14", enrollments: 938 },
  { date: "2024-05-15", enrollments: 853 },
  { date: "2024-05-16", enrollments: 738 },
  { date: "2024-05-17", enrollments: 919 },
  { date: "2024-05-18", enrollments: 665 },
  { date: "2024-05-19", enrollments: 415 },
  { date: "2024-05-20", enrollments: 407 },
  { date: "2024-05-21", enrollments: 222 },
  { date: "2024-05-22", enrollments: 201 },
  { date: "2024-05-23", enrollments: 542 },
  { date: "2024-05-24", enrollments: 514 },
  { date: "2024-05-25", enrollments: 451 },
  { date: "2024-05-26", enrollments: 383 },
  { date: "2024-05-27", enrollments: 880 },
  { date: "2024-05-28", enrollments: 423 },
  { date: "2024-05-29", enrollments: 208 },
  { date: "2024-05-30", enrollments: 620 },
  { date: "2024-05-31", enrollments: 408 },
  { date: "2024-06-01", enrollments: 378 },
  { date: "2024-06-02", enrollments: 880 },
  { date: "2024-06-03", enrollments: 263 },
  { date: "2024-06-04", enrollments: 819 },
  { date: "2024-06-05", enrollments: 228 },
  { date: "2024-06-06", enrollments: 544 },
  { date: "2024-06-07", enrollments: 693 },
  { date: "2024-06-08", enrollments: 705 },
  { date: "2024-06-09", enrollments: 918 },
  { date: "2024-06-10", enrollments: 355 },
  { date: "2024-06-11", enrollments: 242 },
  { date: "2024-06-12", enrollments: 912 },
  { date: "2024-06-13", enrollments: 211 },
  { date: "2024-06-14", enrollments: 806 },
  { date: "2024-06-15", enrollments: 657 },
  { date: "2024-06-16", enrollments: 681 },
  { date: "2024-06-17", enrollments: 995 },
  { date: "2024-06-18", enrollments: 277 },
  { date: "2024-06-19", enrollments: 631 },
  { date: "2024-06-20", enrollments: 858 },
  { date: "2024-06-21", enrollments: 379 },
  { date: "2024-06-22", enrollments: 587 },
  { date: "2024-06-23", enrollments: 1010 },
  { date: "2024-06-24", enrollments: 312 },
  { date: "2024-06-25", enrollments: 331 },
  { date: "2024-06-26", enrollments: 814 },
  { date: "2024-06-27", enrollments: 938 },
  { date: "2024-06-28", enrollments: 349 },
  { date: "2024-06-29", enrollments: 263 },
  { date: "2024-06-30", enrollments: 846 },
];


const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--primary)",
  }
} satisfies ChartConfig


interface ChartAreaInteractiveProps{
  data:{date:string;enrollments:number}[]
}

export function ChartAreaInteractive({data}:ChartAreaInteractiveProps) {
  console.log("datas",data);
  
  const totalenrollmenysnumber = React.useMemo(()=>data.reduce((acc,curr)=>acc+curr.enrollments,0),[data])


  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = data.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total enrollment for the last 30 days:{totalenrollmenysnumber}
          </span>
          <span className="@[540px]/card:hidden">Last 30 days:{totalenrollmenysnumber}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-enrollments)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-enrollments)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-enrollments)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-enrollments)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="enrollments"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-enrollments)"
              stackId="a"
            />
            <Area
              dataKey="enrollments"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-enrollments)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
