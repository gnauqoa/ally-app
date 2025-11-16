import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BookOpen, FileText, TrendingUp } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

export default function QuickStats() {
  const { sessions, stats } = useAppSelector((state) => state.chat);
  const { journals } = useAppSelector((state) => state.journal);
  const { results } = useAppSelector((state) => state.result);

  const statItems = [
    {
      title: "Cuộc trò chuyện",
      value: stats?.totalSessions || sessions.length || 0,
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Nhật ký",
      value: journals.length || 0,
      icon: FileText,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Đánh giá",
      value: results.length || 0,
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Xu hướng",
      value: "Tích cực",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{item.title}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

