import type React from "react";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/chat/message";
import ChatInput from "@/components/chat/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessageRole, ChatMessage as ChatMessageType } from "@/@types/chat";
import { ChatSessionStatus, PriorityLevel } from "@/@types/consultation";
import { useChatSession } from "@/hooks/useChatSession";
import { useIonViewDidEnter } from "@ionic/react";
import { useAppDispatch } from "@/redux/hooks";
import {
  analyzeSession,
  generateSummary,
  addEmotionalFeedback,
} from "@/redux/slices/chat";
import {
  Sparkles,
  FileText,
  Heart,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema, FeedbackFormValues } from "@/lib/validations/feedback";
import { useToast } from "@/components/ui/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

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

export default function ChatDetail() {
  const dispatch = useAppDispatch();
  const { currentSession, sendMessage, isLoading, isNewChat } =
    useChatSession();
  const { success, error: toastError } = useToast();
  const [input, setInput] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = currentSession?.messages || ([] as ChatMessageType[]);

  const feedbackForm = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      emotion: "satisfied",
      feedback: "",
    },
  });

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

  const handleAnalyze = async () => {
    if (!currentSession?.id) return;
    setAnalyzing(true);
    try {
      await dispatch(analyzeSession(currentSession.id)).unwrap();
    } catch (error) {
      console.error("Failed to analyze session:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!currentSession?.id) return;
    setGeneratingSummary(true);
    try {
      await dispatch(generateSummary(currentSession.id)).unwrap();
      setShowSummary(true);
    } catch (error) {
      console.error("Failed to generate summary:", error);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleSubmitFeedback = async (data: FeedbackFormValues) => {
    if (!currentSession?.id) return;
    try {
      // Map emotion to rating (rough scale)
      const emotionToRating: Record<string, number> = {
        very_satisfied: 10,
        satisfied: 7,
        neutral: 5,
        unsatisfied: 3,
        very_unsatisfied: 1,
      };

      await dispatch(
        addEmotionalFeedback({
          sessionId: currentSession.id,
          data: {
            rating: emotionToRating[data.emotion],
            feelingBetter:
              data.emotion === "very_satisfied" || data.emotion === "satisfied",
            comment: data.feedback || "",
          },
        })
      ).unwrap();
      success({ title: "Cảm ơn bạn đã để lại đánh giá!" });
      setShowFeedback(false);
      feedbackForm.reset();
    } catch (error) {
      toastError({ title: "Lỗi khi gửi đánh giá" });
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background relative">
      {/* Header with metadata and actions */}
      {!isNewChat && currentSession && (
        <div className="border-b bg-card px-3 py-2 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
              {currentSession.status && (
                <Badge
                  variant={
                    statusVariants[currentSession.status as ChatSessionStatus]
                  }
                  className="text-xs"
                >
                  {statusLabels[currentSession.status as ChatSessionStatus]}
                </Badge>
              )}
              {currentSession.metadata?.priorityLevel && (
                <Badge
                  variant={
                    priorityVariants[currentSession.metadata.priorityLevel]
                  }
                  className="text-xs"
                >
                  {currentSession.metadata.priorityLevel}
                </Badge>
              )}
              {currentSession.metadata?.problemCategory && (
                <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                  {currentSession.metadata.problemCategory}
                </Badge>
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Phân tích</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary}
                  >
                    {generatingSummary ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tóm tắt</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowFeedback(true)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Đánh giá</TooltipContent>
              </Tooltip>
            </div>
          </div>
          {currentSession.metadata?.needsSpecialist && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">Cần hỗ trợ từ chuyên gia</span>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex flex-col h-full overflow-y-auto px-4 py-3">
        {isNewChat && (
          <div className="pb-4">
            <ChatMessage
              message={{
                content:
                  "Xin chào! Tôi có thể giúp gì cho bạn hôm nay? Hãy chia sẻ với tôi về vấn đề bạn đang gặp phải.",
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

      {/* Input */}
      <div className="w-[100%]">
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tóm tắt cuộc trò chuyện</DialogTitle>
            <DialogDescription>
              AI đã tạo bản tóm tắt về cuộc trò chuyện của bạn
            </DialogDescription>
          </DialogHeader>
          {currentSession?.metadata?.aiSummary && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {currentSession.metadata.aiSummary}
                </p>
              </CardContent>
            </Card>
          )}
          <DialogFooter>
            <Button onClick={() => setShowSummary(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh giá cuộc trò chuyện</DialogTitle>
            <DialogDescription>
              Chia sẻ cảm nhận của bạn về cuộc trò chuyện này
            </DialogDescription>
          </DialogHeader>
          <Form {...feedbackForm}>
            <form
              onSubmit={feedbackForm.handleSubmit(handleSubmitFeedback)}
              className="space-y-4"
            >
              <FormField
                control={feedbackForm.control}
                name="emotion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cảm xúc của bạn</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={
                            field.value === "very_satisfied"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange("very_satisfied")}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Rất tốt
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === "satisfied" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange("satisfied")}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Tốt
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === "neutral" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange("neutral")}
                        >
                          Trung bình
                        </Button>
                        <Button
                          type="button"
                          variant={
                            field.value === "unsatisfied"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => field.onChange("unsatisfied")}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Không tốt
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={feedbackForm.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhận xét (tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
                        rows={4}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFeedback(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Gửi đánh giá</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
