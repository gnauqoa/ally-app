import { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteChatSession,
  fetchChatSessions,
  getChatStats,
} from "@/redux/slices/chat";
import { ChatSessionStatus, PriorityLevel } from "@/@types/consultation";
import { GET_ROUTE_PATHS } from "@/lib/constant";
import dayjs from "dayjs";
import { ConfirmModal } from "@/components/confirm-model";

const statusLabels: Record<ChatSessionStatus, string> = {
  [ChatSessionStatus.IN_PROGRESS]: "Đang tiến hành",
  [ChatSessionStatus.COMPLETED]: "Đã hoàn thành",
  [ChatSessionStatus.NEEDS_FOLLOW_UP]: "Cần theo dõi",
};

const statusVariants: Record<
  ChatSessionStatus,
  "warning" | "success" | "destructive"
> = {
  [ChatSessionStatus.IN_PROGRESS]: "warning",
  [ChatSessionStatus.COMPLETED]: "success",
  [ChatSessionStatus.NEEDS_FOLLOW_UP]: "destructive",
};

const priorityVariants: Record<
  PriorityLevel,
  "default" | "warning" | "destructive"
> = {
  [PriorityLevel.LOW]: "default",
  [PriorityLevel.MEDIUM]: "default",
  [PriorityLevel.HIGH]: "warning",
  [PriorityLevel.CRITICAL]: "destructive",
};

export default function ChatPage() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { sessions, stats, isLoading } = useAppSelector((state) => state.chat);
  const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    ChatSessionStatus | "all"
  >("all");

  useEffect(() => {
    dispatch(getChatStats());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStatus === "all") {
      dispatch(fetchChatSessions({}));
    } else {
      dispatch(fetchChatSessions({ status: selectedStatus }));
    }
  }, [selectedStatus, dispatch]);

  const handleChatClick = (chatId: number | string) => {
    router.push(GET_ROUTE_PATHS.CHAT_DETAIL(chatId));
  };

  const handleDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    sessionId: number
  ) => {
    e.stopPropagation();
    setDeleteSessionId(sessionId);
  };

  const handleConfirmDelete = async () => {
    if (deleteSessionId) {
      try {
        await dispatch(deleteChatSession(deleteSessionId)).unwrap();
        setDeleteSessionId(null);
      } catch (error) {
        console.error("Failed to delete chat session:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteSessionId(null);
  };

  return (
    <>
      <div className="flex h-full flex-col bg-background">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="w-full space-y-6">
            {/* Stats Section */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Tổng cuộc trò chuyện
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalSessions}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Vấn đề phổ biến nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold">
                      {Object.entries(stats.commonProblems)[0]?.[0] ||
                        "Chưa có dữ liệu"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Cần theo dõi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">
                      {stats.byStatus[ChatSessionStatus.NEEDS_FOLLOW_UP] || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <Tabs
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as ChatSessionStatus | "all")
              }
              className="w-full"
            >
              {/* <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value={ChatSessionStatus.IN_PROGRESS}>
                  Đang tiến hành
                </TabsTrigger>
                <TabsTrigger value={ChatSessionStatus.COMPLETED}>
                  Hoàn thành
                </TabsTrigger>
                <TabsTrigger value={ChatSessionStatus.NEEDS_FOLLOW_UP}>
                  Cần theo dõi
                </TabsTrigger>
              </TabsList> */}

              <TabsContent value={selectedStatus} className="mt-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground py-8">
                    Đang tải...
                  </div>
                ) : sessions.length === 0 ? (
                  <Card
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleChatClick("new")}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground text-center">
                        {selectedStatus === "all"
                          ? "Bạn chưa có cuộc trò chuyện nào. Bắt đầu cuộc trò chuyện ngay!"
                          : "Không có cuộc trò chuyện nào trong trạng thái này."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <Card
                        key={session.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleChatClick(session.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-lg truncate">
                                  {session.title}
                                </p>
                                {session.status && (
                                  <Badge
                                    variant={
                                      statusVariants[
                                        session.status as ChatSessionStatus
                                      ]
                                    }
                                  >
                                    {
                                      statusLabels[
                                        session.status as ChatSessionStatus
                                      ]
                                    }
                                  </Badge>
                                )}
                                {session.metadata?.priorityLevel && (
                                  <Badge
                                    variant={
                                      priorityVariants[
                                        session.metadata.priorityLevel
                                      ]
                                    }
                                  >
                                    {session.metadata.priorityLevel}
                                  </Badge>
                                )}
                              </div>

                              {session.metadata?.problemCategory && (
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {session.metadata.problemCategory}
                                  </Badge>
                                </div>
                              )}

                              {session.latestMessageAt && (
                                <p className="text-sm text-muted-foreground">
                                  {session.totalMessages} tin nhắn •{" "}
                                  {dayjs(session.latestMessageAt).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </p>
                              )}

                              {session.metadata?.aiSummary && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {session.metadata.aiSummary}
                                </p>
                              )}
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={(e) => handleDeleteClick(e, session.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {sessions.length > 0 && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleChatClick("new")}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Bắt đầu cuộc trò chuyện mới
              </Button>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteSessionId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteSessionId(null);
        }}
        title="Xóa cuộc trò chuyện"
        description="Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isLoading}
      />
    </>
  );
}
