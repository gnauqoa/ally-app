import {
  IonButton,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { IonHeader } from "@ionic/react";
import { ChevronLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useClickAway } from "react-use";
import { useAppDispatch } from "@/redux/hooks";
import { updateChatSession } from "@/redux/slices/chat";
import { ROUTE_PATHS } from "@/lib/constant";
import { useChatSession } from "@/hooks/useChatSession";
import TabTitle from "@/components/tab-title";
import { limitText } from "@/lib/utils";
import AddChatButton from "./add-button";

const ChatDetailHeader = () => {
  const { currentSession, isNewChat } = useChatSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useIonRouter();
  const dispatch = useAppDispatch();

  const currentTitle = currentSession?.title || "Đoạn trò chuyện mới";

  const handleEditClick = () => {
    if (!isNewChat && currentSession) {
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
    if (!isNewChat && currentSession && editTitle.trim()) {
      dispatch(
        updateChatSession({
          sessionId: currentSession.id,
          title: editTitle.trim(),
        })
      );
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
          <IonMenuButton />
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
          <TabTitle
            title={
              <div className="flex flex-row items-center justify-center gap-2">
                <ChevronLeft
                  color="var(--color-primary)"
                  onClick={() => router.goBack()}
                />

                <span
                  onClick={!isNewChat ? handleEditClick : undefined}
                  className={
                    !isNewChat
                      ? "cursor-pointer hover:opacity-70 transition-opacity"
                      : ""
                  }
                >
                  {!isNewChat ? limitText(currentTitle, 10) : "Đoạn trò chuyện mới"}
                </span>
              </div>
            }
          />
        )}
        {!isNewChat && (
          <IonButtons slot="end">
            <AddChatButton />
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default ChatDetailHeader;
