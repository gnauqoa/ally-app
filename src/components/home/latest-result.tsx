import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useIonRouter } from "@ionic/react";
import { getInterpretation } from "@/lib/score";
import dayjs from "dayjs";

export default function LatestResult() {
  const router = useIonRouter();
  const { results } = useAppSelector((state) => state.result);

  // Get latest result
  const latestResult = results.length > 0 
    ? [...results].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : null;

  const handleViewDetails = () => {
    if (latestResult) {
      router.push(`/result-history/${latestResult.id}`);
    }
  };

  const handleViewHistory = () => {
    router.push("/result-history");
  };

  if (!latestResult) {
    return null;
  }

  const interpretation = getInterpretation(
    latestResult.totalScore,
    latestResult.quiz?.code || ""
  );

  const hasImprovement = latestResult.historicalTrend?.improving;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Kết quả mới nhất
          </CardTitle>
          <button
            onClick={handleViewHistory}
            className="text-sm text-primary hover:underline"
          >
            Lịch sử
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">{latestResult.quiz?.name}</p>
              <Badge
                variant={
                  interpretation?.level.includes("Minimal") || interpretation?.level.includes("Nhẹ")
                    ? "success"
                    : interpretation?.level.includes("Severe") || interpretation?.level.includes("Nghiêm trọng")
                    ? "destructive"
                    : "warning"
                }
              >
                {interpretation?.level}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-3xl font-bold">{latestResult.totalScore}</p>
                <p className="text-xs text-muted-foreground">
                  {dayjs(latestResult.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>
              {hasImprovement !== undefined && (
                <div
                  className={`flex items-center gap-1 text-sm ${
                    hasImprovement ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {hasImprovement ? (
                    <>
                      <TrendingUp className="h-4 w-4" />
                      <span>Cải thiện</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4" />
                      <span>Giảm</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {latestResult.interpretation && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground line-clamp-3">
                {latestResult.interpretation}
              </p>
            </div>
          )}

          <Button size="sm" onClick={handleViewDetails} className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

