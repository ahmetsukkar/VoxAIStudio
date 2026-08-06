"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import type { ConversionFunnel } from "~/lib/analytics/queries";

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function FunnelChart({ funnel }: { funnel: ConversionFunnel }) {
  const data = [
    { stage: "Signed up", users: funnel.signedUp },
    { stage: "Generated audio", users: funnel.generated },
    { stage: "Hit free limit", users: funnel.quotaExceeded },
    { stage: "Started checkout", users: funnel.checkoutStarted },
    { stage: "Purchased", users: funnel.purchased },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <CartesianGrid horizontal={false} strokeOpacity={0.3} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <ChartTooltip content={<ChartTooltipContent labelKey="stage" />} />
        <Bar
          dataKey="users"
          fill="var(--color-users)"
          radius={4}
          barSize={22}
        />
      </BarChart>
    </ChartContainer>
  );
}
