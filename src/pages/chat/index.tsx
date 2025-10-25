import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare } from "lucide-react";
import { deleteChatRecord, getChatRecords } from "@/lib/chat-storage";

interface ChatRecord {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatPage() {
  const history = useHistory();
  const [records, setRecords] = useState<ChatRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const loadedRecords = getChatRecords();
    setRecords(
      loadedRecords.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    );
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    deleteChatRecord(id);
    setRecords(records.filter((r) => r.id !== id));
  };

  const handleChatClick = (chatId: string) => {
    history.push(`/chat/${chatId}`);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="w-full">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : records.length === 0 ? (
            <div
              className="w-full rounded-lg border border-border bg-card p-8 text-center"
              onClick={() => handleChatClick("new")}
            >
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                No chat records yet. Start a new conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted cursor-pointer"
                  onClick={() => handleChatClick(record.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate text-2xl">
                      {record.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.messages.length} messages •{" "}
                      {new Date(record.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(record.id);
                    }}
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
  );
}
