import { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { deleteChatSession, fetchChatSessions } from "@/redux/slices/chat";
import { GET_ROUTE_PATHS } from "@/lib/constant";
import dayjs from "dayjs";
import { ConfirmModal } from "@/components/confirm-model";

export default function ChatPage() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { sessions, isLoading } = useAppSelector((state) => state.chat);
  const [deleteSessionId, setDeleteSessionId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchChatSessions());
  }, []);

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
          <div className="w-full">
            {isLoading ? (
              <div className="text-center text-muted-foreground">
                Loading...
              </div>
            ) : sessions.length === 0 ? (
              <div
                className="w-full rounded-lg border border-border bg-card p-8 text-center"
                onClick={() => handleChatClick("new")}
              >
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  Bạn chưa có cuộc trò chuyện nào. Bắt đầu cuộc trò chuyện ngay!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted cursor-pointer"
                    onClick={() => handleChatClick(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate text-2xl">
                        {session.title}
                      </p>
                      {session.latestMessageAt && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {session.totalMessages} messages •{" "}
                          {dayjs(session.latestMessageAt).format("DD-MM-YYYY")}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={(e) => handleDeleteClick(e, session.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        open={deleteSessionId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteSessionId(null);
        }}
        title="Delete Chat Session"
        description="Are you sure you want to delete this chat session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isLoading}
      />
    </>
  );
}
