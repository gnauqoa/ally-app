import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchChatSessionMessages,
  createChatMessage,
  updateChatSession,
  deleteChatSession,
  createChatSession,
} from "@/redux/slices/chat";
import { RootState } from "@/redux";
import { useIonViewDidEnter } from "@ionic/react";
import { useParams } from "react-router-dom";

export const useChatSession = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const isNewChat = chatId === "new" && !isCreate;
  const dispatch = useAppDispatch();
  const { sessions, isLoading, error } = useAppSelector(
    (state: RootState) => state.chat
  );

  const currentSession = useMemo(
    () =>
      isCreate ? sessions[0] : sessions.find((s) => s.id === Number(chatId)),
    [sessions, chatId, isCreate]
  );

  useIonViewDidEnter(() => {
    if (chatId && !isNewChat && !currentSession?.messages) {
      dispatch(fetchChatSessionMessages(Number(chatId)));
    }
  }, [chatId]);

  const sendMessage = (content: string) => {
    if (isNewChat) {
      dispatch(createChatSession({ title: content, content }));
      setIsCreate(true);
    } else if (currentSession?.id) {
      dispatch(
        createChatMessage({
          sessionId: currentSession.id,
          content,
        })
      );
    }
  };

  const renameSession = (title: string) => {
    if (!chatId) return;
    dispatch(updateChatSession({ sessionId: Number(chatId), title }));
  };

  const removeSession = () => {
    if (!chatId) return;
    dispatch(deleteChatSession(Number(chatId)));
  };

  return {
    chatId,
    isNewChat,
    currentSession,
    isLoading,
    error,
    sendMessage,
    renameSession,
    removeSession,
  };
};
