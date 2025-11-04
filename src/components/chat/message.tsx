import { cn } from "@/lib/utils";
import { ChatMessageRole, ChatMessage as ChatMessageType } from "@/@types/chat";
import dayjs from "dayjs";

export default function ChatMessage({
  message,
}: {
  message: Omit<ChatMessageType, "session" | "id" | "sessionId">;
}) {
  const isUser = message.role === ChatMessageRole.USER;

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs max-w-[80%] rounded-lg px-4 py-3 sm:max-w-md lg:max-w-lg",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span
          className={cn(
            "mt-1 block text-xs",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {dayjs(message.createdAt).format("HH:mm")}
        </span>
      </div>
    </div>
  );
}
