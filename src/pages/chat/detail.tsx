import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatMessage from "@/components/chat/message";
import ChatInput from "@/components/chat/input";
import {
  getChatRecord,
  saveChatRecord,
  generateChatTitle,
  ChatRecord,
} from "@/lib/chat-storage";
import { useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { stringToColor } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  categories?: Array<{ id: string; label: string }>;
}

const CATEGORIES = [
  { id: "family", label: "Family" },
  { id: "job", label: "Job" },
  { id: "mentality", label: "Mentality" },
];

const CATEGORY_SOLUTIONS: Record<string, string> = {
  family:
    "For family-related issues, consider having an open conversation with your loved ones. Listen actively to their perspectives and share your feelings calmly. Sometimes seeking family counseling can help improve communication and resolve conflicts.",
  job: "For job-related challenges, focus on clear communication with your manager or colleagues. Document your concerns and propose solutions. Consider professional development opportunities or consulting with HR if needed.",
  mentality:
    "For mental health concerns, prioritize self-care and consider speaking with a mental health professional. Practice mindfulness, exercise regularly, and maintain healthy relationships. Remember that seeking help is a sign of strength.",
};

export default function ChatDetail() {
  const { chatId } = useParams<{ chatId: string }>();
  const [chatRecord, setChatRecord] = useState<ChatRecord | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const isNewChat = chatId === "new" && !messages.length;
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useIonRouter();

  useEffect(() => {
    if (chatId && !isNewChat) {
      const record = getChatRecord(chatId);
      if (record) {
        setChatRecord(record);
        setMessages(record.messages);
      } else {
        router.push("/chat/new", "forward", "replace");
      }
    } else if (isNewChat) {
      setChatRecord(null);
      setMessages([]);
    }
  }, [chatId, isNewChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCategorySelect = (categoryId: string) => {
    setIsLoading(true);

    setTimeout(() => {
      const solution = CATEGORY_SOLUTIONS[categoryId];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: solution,
        role: "assistant",
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, assistantMessage];
      setMessages(updatedMessages);

      const updatedRecord = chatRecord
        ? {
            ...chatRecord,
            messages: updatedMessages,
            updatedAt: new Date(),
            selectedCategory: categoryId,
          }
        : null;

      if (updatedRecord) {
        setChatRecord(updatedRecord);
        saveChatRecord(updatedRecord);
      }

      setIsLoading(false);
    }, 800);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    let currentRecord = chatRecord;
    if (isNewChat || !currentRecord) {
      currentRecord = {
        id: Date.now().toString(),
        title: generateChatTitle(input),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setChatRecord(currentRecord);
    }

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const updatedRecord = {
      ...currentRecord,
      messages: updatedMessages,
      updatedAt: new Date(),
    };

    if (updatedRecord.title === "New Chat") {
      updatedRecord.title = generateChatTitle(input);
    }

    setChatRecord(updatedRecord);
    saveChatRecord(updatedRecord);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're dealing with: "${input}". This seems like it could be related to one of these areas. Please select a category so I can provide more specific guidance.`,
        role: "assistant",
        timestamp: new Date(),
        categories: CATEGORIES,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      const finalRecord = {
        ...updatedRecord,
        messages: finalMessages,
        updatedAt: new Date(),
      };
      setChatRecord(finalRecord);
      saveChatRecord(finalRecord);
      setIsLoading(false);
      router.push(`/chat/${finalRecord.id}`, "forward", "replace");
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col bg-background relative">
      <div className="flex flex-col h-full overflow-y-auto px-4 py-3">
        {isNewChat && (
          <div className="pb-4">
            <ChatMessage
              message={{
                id: "1",
                content:
                  "Hello! How can I help you today? Tell me about a problem you're facing.",
                role: "assistant",
                timestamp: new Date(),
              }}
            />
          </div>
        )}
        {messages.map((message) => (
          <div className="pb-4" key={message.id}>
            <ChatMessage message={message} />
            {message.role === "assistant" &&
              Array.isArray(message.categories) && (
                <div className="mt-1 flex flex-wrap gap-2 justify-start">
                  {message.categories.map(
                    (category: { id: string; label: string }) => {
                      const color = stringToColor(category.id);
                      return (
                        <Button
                          disabled={
                            !!chatRecord?.selectedCategory &&
                            chatRecord.selectedCategory !== category.id
                          }
                          key={category.id}
                          onClick={() =>
                            chatRecord?.selectedCategory
                              ? null
                              : handleCategorySelect(category.id)
                          }
                          size="sm"
                          className="mt-2 text-xs rounded-md border"
                          style={{
                            borderColor: color,
                            color,
                            backgroundColor: `${color}15`, // thêm 10% opacity
                          }}
                        >
                          {category.label}
                        </Button>
                      );
                    }
                  )}
                </div>
              )}
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
