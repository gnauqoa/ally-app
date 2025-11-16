import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useIonRouter } from "@ionic/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  FileText, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { getResultById, getHistoricalResults } from "@/apis/results";
import { Result, HistoricalResults } from "@/@types/result";
import { getInterpretation } from "@/lib/score";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ResultDetailPage() {
  const { resultId } = useParams<{ resultId: string }>();
  const router = useIonRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<HistoricalResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const resultRes = await getResultById(parseInt(resultId));
        setResult(resultRes.data);

        // Fetch historical data for this quiz
        if (resultRes.data.quizId) {
          try {
            const historyRes = await getHistoricalResults(resultRes.data.quizId);
            setHistory(historyRes.data);
          } catch (err) {
            console.error("Failed to fetch history:", err);
          }
        }
      } catch (err: any) {
        setError(err.message || "Không thể tải kết quả");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <Card className="w-full max-w-md p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-600">Lỗi</p>
              <p className="text-sm text-red-600 mt-1">{error || "Không tìm thấy kết quả"}</p>
            </div>
          </div>
          <Button onClick={() => router.goBack()} className="w-full">
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  const interpretation = getInterpretation(result.totalScore, result.quiz?.code || "");
  
  // Prepare chart data
  const chartData = history?.results
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((r) => ({
      date: dayjs(r.createdAt).format("DD/MM"),
      score: r.totalScore,
      fullDate: dayjs(r.createdAt).format("DD/MM/YYYY"),
    })) || [];

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.goBack()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{result.quiz?.name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4" />
              {dayjs(result.createdAt).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        </div>

        {/* Score Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">ĐIỂM CỦA BẠN</p>
              <p className={`text-6xl font-bold ${interpretation.color}`}>
                {result.totalScore}
              </p>
              <Badge 
                variant={
                  interpretation.level.includes("Minimal") || interpretation.level.includes("Nhẹ") 
                    ? "success" 
                    : interpretation.level.includes("Severe") || interpretation.level.includes("Nghiêm trọng")
                    ? "destructive"
                    : "warning"
                }
                className="mt-4"
              >
                {interpretation.level}
              </Badge>
              <p className="text-sm text-muted-foreground mt-4">
                {interpretation.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for details */}
        <Tabs defaultValue="interpretation" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="interpretation">
              <Lightbulb className="h-4 w-4 mr-2" />
              Phân tích
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <FileText className="h-4 w-4 mr-2" />
              Khuyến nghị
            </TabsTrigger>
            <TabsTrigger value="trend">
              <TrendingUp className="h-4 w-4 mr-2" />
              Xu hướng
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interpretation" className="space-y-4">
            {result.interpretation ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Phân tích AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {result.interpretation}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    Không có phân tích AI cho kết quả này
                  </p>
                </CardContent>
              </Card>
            )}

            {result.comparisonWithPrevious && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {result.historicalTrend?.improving ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                    So sánh với lần trước
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {result.comparisonWithPrevious}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {result.recommendations && result.recommendations.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gợi ý từ AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed flex-1">{rec}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    Không có khuyến nghị cho kết quả này
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trend" className="space-y-4">
            {chartData.length > 0 ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Biểu đồ xu hướng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                                  <p className="text-xs text-muted-foreground">
                                    {payload[0].payload.fullDate}
                                  </p>
                                  <p className="text-sm font-medium">
                                    Điểm: {payload[0].value}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {history?.trend && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {history.trend.improving ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        Phân tích xu hướng
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {history.trend.analysis}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground text-center">
                    Chưa có đủ dữ liệu để hiển thị xu hướng. Hãy thực hiện bài test thêm lần nữa!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => router.push(`/quiz/${result.quizId}/take`)}
        >
          Làm lại bài test
        </Button>
      </div>
    </div>
  );
}

