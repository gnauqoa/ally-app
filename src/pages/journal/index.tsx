import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchJournals,
  fetchEmotionTrend,
  fetchJournalStats,
} from "@/redux/slices/journal";
import JournalCalendar from "@/components/journal/calendar";
import TrendChart from "@/components/journal/trend-chart";
import StatsCard from "@/components/journal/stats-card";
import PageContainer from "@/components/page-container";
import { ROUTE_PATHS, GET_ROUTE_PATHS } from "@/lib/constant";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, RefreshCw } from "lucide-react";

const JournalPage: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { journals, emotionTrend, stats, loading } = useAppSelector(
    (state) => state.journal
  );

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    const startDate = dayjs(currentMonth).startOf("month").format("YYYY-MM-DD");
    const endDate = dayjs(currentMonth).endOf("month").format("YYYY-MM-DD");

    await Promise.all([
      dispatch(fetchJournals({ startDate, endDate })),
      dispatch(fetchEmotionTrend(7)),
      dispatch(fetchJournalStats()),
    ]);
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleDateClick = (date: string) => {
    const journal = journals.find((j) => j.date === date);
    if (journal) {
      history.push(GET_ROUTE_PATHS.JOURNAL_VIEW(date));
    } else {
      history.push(`${ROUTE_PATHS.JOURNAL_WRITE}?date=${date}`);
    }
  };

  const handleNewEntry = () => {
    history.push(ROUTE_PATHS.JOURNAL_WRITE);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  return (
    <PageContainer className="px-4">
      <div className="max-w-4xl space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Nhật ký cảm xúc</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ghi lại cảm xúc và suy nghĩ của bạn mỗi ngày
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
          >
            <RefreshCw
              className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {loading && !journals.length ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <StatsCard stats={stats} />

            <TrendChart trends={emotionTrend} days={7} />

            <JournalCalendar
              journals={journals}
              currentMonth={currentMonth}
              onMonthChange={handleMonthChange}
              onDateClick={handleDateClick}
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Hướng dẫn
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Nhấn vào ngày để xem hoặc viết nhật ký</li>
                <li>• Chấm màu thể hiện cảm xúc của bạn trong ngày đó</li>
                <li>• Nhật ký được phân tích bằng AI để hiểu rõ hơn</li>
                <li>• Viết nhật ký đều đặn giúp theo dõi sức khỏe tinh thần</li>
              </ul>
            </div>
          </>
        )}
      </div>

      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={handleNewEntry}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </PageContainer>
  );
};

export default JournalPage;
