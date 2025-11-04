import type React from "react";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/chat/message";
import ChatInput from "@/components/chat/input";
import { ChatMessageRole, ChatMessage as ChatMessageType } from "@/@types/chat";
import { useChatSession } from "@/hooks/useChatSession";
import { useIonViewDidEnter } from "@ionic/react";

export default function ChatDetail() {
  const { currentSession, sendMessage, isLoading, isNewChat } =
    useChatSession();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = currentSession?.messages || ([] as ChatMessageType[]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  useIonViewDidEnter(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="flex h-full flex-col bg-background relative">
      <div className="flex flex-col h-full overflow-y-auto px-4 py-3">
        {isNewChat && (
          <div className="pb-4">
            <ChatMessage
              message={{
                content:
                  "Hello! How can I help you today? Tell me about a problem you're facing.",
                role: ChatMessageRole.ASSISTANT,
                createdAt: new Date(),
                updatedAt: new Date(),
              }}
            />
          </div>
        )}
        {messages.map((message) => (
          <div className="pb-4" key={message.id}>
            <ChatMessage message={message} />
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-[100%]">
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
