import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useIonRouter } from "@ionic/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { getResultById, getHistoricalResults } from "@/apis/results";
import { Result, HistoricalResults } from "@/@types/result";

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
            const historyRes = await getHistoricalResults(
              resultRes.data.quizId
            );
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
              <p className="text-sm text-red-600 mt-1">
                {error || "Không tìm thấy kết quả"}
              </p>
            </div>
          </div>
          <Button onClick={() => router.goBack()} className="w-full">
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }
}
