import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import PropTypes from "prop-types";
export default function TotalMissedCheckOutByEmployee({ data }) {
  const chartData = data.map((item, index) => {
    return {
      report: item?.employee?.name,
      amount: item.missedCheckOut,
      fill: `hsl(var(--chart-${index + 1}))`,
    };
  });

  const chartConfig = data.reduce((acc, item) => {
    acc[item?.employee?.name] = {
      label: item?.employee?.name,
      color: "red",
    };
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Missed Checkout</CardTitle>
        <CardDescription>
          Total missed check out amount by each employee for this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="report"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value] ? chartConfig[value].label : "Unknown"
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="amount" strokeWidth={2} radius={8} activeIndex={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing number of missed check out
        </div>
      </CardFooter>
    </Card>
  );
}

TotalMissedCheckOutByEmployee.propTypes = {
  data: PropTypes.array.isRequired,
  date: PropTypes.string,
};
