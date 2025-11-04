import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchMyResults, clearError } from "@/redux/slices/result";
import { AlertCircle, ListIcon, LineChart } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchQuizzes } from "@/redux/slices/quiz";
import { stringToColor } from "@/lib/utils";
import ResultHistoryList from "./list";
import ResultHistoryChart from "./chart";
import PageContainer from "@/components/page-container";

export default function ResultHistoryPage() {
  const dispatch = useAppDispatch();
  const [view, setView] = useState("list");
  const { results, isLoading, error } = useAppSelector((state) => state.result);
  const { quizzes } = useAppSelector((state) => state.quiz);
  const [code, setCode] = useState("all");

  useEffect(() => {
    dispatch(
      fetchMyResults({ page: 1, limit: 50, code: code === "all" ? "" : code })
    );
    if (!quizzes.length) {
      dispatch(fetchQuizzes({ page: 1, limit: 50 }));
    }
    return () => {
      dispatch(clearError());
    };
  }, [code]);

  return (
    <PageContainer className="flex h-full flex-col bg-background">
      <div className="flex-1 py-6 sm:px-6">
        <div className="flex flex-row mb-4 ">
          <div
            className="inline-flex rounded-md shadow-sm mr-auto"
            role="group"
          >
            <button
              type="button"
              onClick={() => setView("list")}
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                view === "list"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              <ListIcon size={16} />
            </button>
            <button
              type="button"
              onClick={() => setView("chart")}
              className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
                view === "chart"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border"
              }`}
            >
              <LineChart size={16} />
            </button>
          </div>
          {view === "list" && (
            <Select
              defaultValue="all"
              onValueChange={(value) => setCode(value)}
              value={code}
            >
              <SelectTrigger
                style={{
                  color:
                    code !== "all"
                      ? stringToColor(
                          quizzes.find((quiz) => quiz.code === code)?.name ||
                            "all"
                        )
                      : "",
                }}
              >
                <SelectValue placeholder="Select a quiz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {quizzes.map((quiz) => (
                  <SelectItem
                    key={quiz.id}
                    value={quiz.code}
                    style={{ color: stringToColor(quiz.name) }}
                  >
                    {quiz.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Lỗi khi tải kết quả
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Đang tải kết quả...
          </div>
        ) : results.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Bạn chưa thực hiện bài test nào
          </div>
        ) : view === "list" ? (
          <ResultHistoryList />
        ) : (
          <ResultHistoryChart />
        )}
      </div>
    </PageContainer>
  );
}
