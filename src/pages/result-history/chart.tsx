import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "@/redux/hooks";
import { stringToColor } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import dayjs from "dayjs";

const ResultHistoryChart = () => {
  const { theme } = useTheme();
  const { quizzes } = useAppSelector((state) => state.quiz);
  const { results } = useAppSelector((state) => state.result);

  const [visibility, setVisibility] = useState<Record<string, boolean>>(
    quizzes.reduce((acc, quiz) => {
      acc[quiz.code as string] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const data = useMemo(() => {
    const defaultData: Record<string, number> = quizzes.reduce((acc, quiz) => {
      acc[quiz.code] = 0;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(
      results.reduce((acc, result) => {
        const date = dayjs(result.createdAt).format("YYYY-MM-DD");
        if (!acc[date]) acc[date] = { ...defaultData };
        if (result.quiz?.code && !acc[date][result.quiz.code])
          acc[date][result.quiz.code] = result.totalScore;
        return acc;
      }, {} as Record<string, Record<string, number>>)
    )
      .map(([date, scores]) => ({
        date,
        ...scores,
      }))
      .reverse();
  }, [results, quizzes]);

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    setVisibility((prev) => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const titleColor = "#000";
  const tickColor = theme === "dark" ? "#94a3b8" : "#64748b";

  return (
    <ResponsiveContainer
      width="100%"
      height="40%"
      style={{ marginLeft: "-25px" }}
    >
      <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: tickColor, fontSize: 12 }}
          tickMargin={4}
        />
        <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
            borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
          }}
          labelStyle={{ color: titleColor }}
          labelFormatter={(value) => dayjs(value).format("DD/MM/YYYY HH:mm")}
        />
        <Legend
          onClick={handleLegendClick}
          wrapperStyle={{
            cursor: "pointer",
            color: titleColor,
            paddingTop: 4,
          }}
        />
        {quizzes.map((quiz) => (
          <Line
            key={quiz.code}
            connectNulls
            type="monotone"
            dataKey={quiz.code}
            name={quiz.name}
            stroke={stringToColor(quiz.name)}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            hide={!visibility[quiz.code]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ResultHistoryChart;
