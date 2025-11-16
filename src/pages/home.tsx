import { useEffect } from "react";
import { useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, BookOpen, FileText, Plus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { ROUTE_PATHS } from "@/lib/constant";
import QuickStats from "@/components/home/quick-stats";
import TodayJournal from "@/components/home/today-journal";
import RecentChats from "@/components/home/recent-chats";
import RecommendedAssessments from "@/components/home/recommended-assessments";
import LatestResult from "@/components/home/latest-result";
import { fetchChatSessions, getChatStats } from "@/redux/slices/chat";
import { fetchJournals } from "@/redux/slices/journal";
import { fetchMyResults } from "@/redux/slices/result";
import { fetchQuizzes } from "@/redux/slices/quiz";

export default function HomePage() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Fetch all data needed for the dashboard
    dispatch(fetchChatSessions());
    dispatch(getChatStats());
    dispatch(fetchJournals({ page: 1, limit: 50 }));
    dispatch(fetchMyResults({ page: 1, limit: 50 }));
    dispatch(fetchQuizzes({ page: 1, limit: 50 }));
  }, [dispatch]);

  return (
    <div className="p-4 space-y-6 pb-8">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold mb-2">
          Xin chào{user?.name ? `, ${user.name}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground">
          Chăm sóc sức khỏe tâm lý của bạn mỗi ngày
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Today's Journal */}
      <TodayJournal />

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => router.push(ROUTE_PATHS.CHAT)}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Trò chuyện</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => router.push(ROUTE_PATHS.QUIZ)}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs">Đánh giá</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col gap-2"
          onClick={() => router.push(ROUTE_PATHS.JOURNAL_WRITE)}
        >
          <Plus className="h-5 w-5" />
          <span className="text-xs">Viết nhật ký</span>
        </Button>
      </div>

      {/* Recent Chats */}
      <RecentChats />

      {/* Latest Result */}
      <LatestResult />

      {/* Recommended Assessments */}
      <RecommendedAssessments />
    </div>
  );
}
