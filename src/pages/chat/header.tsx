import { getChatRecord, saveChatRecord } from "@/lib/chat-storage";
import {
  IonButton,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { IonHeader } from "@ionic/react";
import { ChevronLeft, Plus } from "lucide-react";
import { useParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { useClickAway } from "react-use";
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const chatRecord = getChatRecord(chatId);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useIonRouter();

  const isChatDetail = !!chatId;
  const isNewChat = isChatDetail && chatId === "new";

  const currentTitle = chatRecord?.title || "New Chat";

  const handleEditClick = () => {
    if (!isNewChat && chatRecord) {
      setEditTitle(currentTitle);
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editTitle.trim()) {
        handleSaveTitle();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      // Focus and select all text when editing starts
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    if (!isNewChat && chatRecord && editTitle.trim()) {
      const updatedRecord = {
        ...chatRecord,
        title: editTitle.trim(),
        updatedAt: new Date(),
      };
      saveChatRecord(updatedRecord);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
  };

  useClickAway(inputRef, () => {
    if (isEditing) {
      handleSaveTitle();
    }
  });

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton style={{ "--color": "var(--color-primary)" }} />
        </IonButtons>

        {isEditing ? (
          <div className="flex items-center justify-center gap-2 flex-1 px-2">
            <input
              ref={inputRef}
              value={editTitle}
              placeholder="Enter chat title"
              className="outline-none"
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              size={Math.max(editTitle.length, 1)} // 👈 size auto theo số ký tự
            />
          </div>
        ) : (
          <IonTitle>
            <div className="flex flex-row items-center justify-center gap-2">
              {isChatDetail && (
                <ChevronLeft
                  color="var(--color-primary)"
                  onClick={() => router.push("/chat")}
                />
              )}
              <span
                onClick={!isNewChat ? handleEditClick : undefined}
                className={
                  !isNewChat
                    ? "cursor-pointer hover:opacity-70 transition-opacity"
                    : ""
                }
              >
                {isChatDetail ? currentTitle : "Chat"}
              </span>
            </div>
          </IonTitle>
        )}

        <IonButtons slot="end">
          <IonButton routerLink="/chat/new">
            <Plus
              color="var(--color-primary)"
              style={{ opacity: isNewChat ? 0 : 1 }}
            />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default ChatHeader;
