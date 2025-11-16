import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
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

  const handleRefresh = async (event: CustomEvent) => {
    await loadData();
    event.detail.complete();
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
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nhật ký cảm xúc
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ghi lại cảm xúc và suy nghĩ của bạn mỗi ngày
            </p>
          </div>

          {/* Stats */}
          <StatsCard stats={stats} />

          {/* 7-day Trend */}
          <TrendChart trends={emotionTrend} days={7} />

          {/* Calendar */}
          <JournalCalendar
            journals={journals}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            onDateClick={handleDateClick}
          />

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
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
        </div>

        <IonLoading isOpen={loading} message="Đang tải..." />
      </IonContent>

      {/* FAB Button */}
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton onClick={handleNewEntry}>
          <IonIcon icon={addOutline} />
        </IonFabButton>
      </IonFab>
    </PageContainer>
  );
};

export default JournalPage;
