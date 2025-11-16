import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useIonRouter } from "@ionic/react";
import { ChatSessionStatus } from "@/@types/consultation";
import dayjs from "dayjs";

const statusLabels: Record<ChatSessionStatus, string> = {
  [ChatSessionStatus.IN_PROGRESS]: "Đang tiến hành",
  [ChatSessionStatus.COMPLETED]: "Hoàn thành",
  [ChatSessionStatus.NEEDS_FOLLOW_UP]: "Cần theo dõi",
};

const statusVariants: Record<ChatSessionStatus, "warning" | "success" | "destructive"> = {
  [ChatSessionStatus.IN_PROGRESS]: "warning",
  [ChatSessionStatus.COMPLETED]: "success",
  [ChatSessionStatus.NEEDS_FOLLOW_UP]: "destructive",
};

export default function RecentChats() {
  const router = useIonRouter();
  const { sessions } = useAppSelector((state) => state.chat);
  
  // Get latest 3 sessions
  const recentSessions = sessions.slice(0, 3);

  const handleViewAll = () => {
    router.push("/chat");
  };

  const handleChatClick = (chatId: number) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Trò chuyện gần đây
          </CardTitle>
          {sessions.length > 0 && (
            <button
              onClick={handleViewAll}
              className="text-sm text-primary hover:underline"
            >
              Xem tất cả
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {recentSessions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Chưa có cuộc trò chuyện nào
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleChatClick(session.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{session.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {session.status && (
                      <Badge
                        variant={statusVariants[session.status as ChatSessionStatus]}
                        className="text-xs"
                      >
                        {statusLabels[session.status as ChatSessionStatus]}
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {dayjs(session.latestMessageAt || session.createdAt).format(
                        "DD/MM/YYYY"
                      )}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

