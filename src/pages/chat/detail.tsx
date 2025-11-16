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
  const [input, setInput] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feelingBetter, setFeelingBetter] = useState<boolean | undefined>(
    undefined
  );
  const [feedbackComment, setFeedbackComment] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
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

  const handleSubmitFeedback = async () => {
    if (!currentSession?.id) return;
    try {
      await dispatch(
        addEmotionalFeedback({
          sessionId: currentSession.id,
          data: {
            rating: feedbackRating,
            feelingBetter,
            comment: feedbackComment,
          },
        })
      ).unwrap();
      setShowFeedback(false);
      setFeedbackRating(5);
      setFeelingBetter(undefined);
      setFeedbackComment("");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background relative">
      {/* Header with metadata and actions */}
      {!isNewChat && currentSession && (
        <div className="border-b bg-card px-4 py-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {currentSession.status && (
                <Badge
                  variant={
                    statusVariants[currentSession.status as ChatSessionStatus]
                  }
                >
                  {statusLabels[currentSession.status as ChatSessionStatus]}
                </Badge>
              )}
              {currentSession.metadata?.priorityLevel && (
                <Badge
                  variant={
                    priorityVariants[currentSession.metadata.priorityLevel]
                  }
                >
                  {currentSession.metadata.priorityLevel}
                </Badge>
              )}
              {currentSession.metadata?.problemCategory && (
                <Badge variant="outline">
                  {currentSession.metadata.problemCategory}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
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
                <TooltipContent>Phân tích cuộc trò chuyện</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
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
                <TooltipContent>Tạo tóm tắt cuộc trò chuyện</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFeedback(true)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Đánh giá cuộc trò chuyện</TooltipContent>
              </Tooltip>
            </div>
          </div>
          {currentSession.metadata?.needsSpecialist && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>Cần hỗ trợ từ chuyên gia</span>
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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Đánh giá (1-10)</Label>
              <div className="flex gap-2">
                {[...Array(10)].map((_, i) => (
                  <Button
                    key={i}
                    variant={feedbackRating === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedbackRating(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bạn có cảm thấy tốt hơn không?</Label>
              <div className="flex gap-2">
                <Button
                  variant={feelingBetter === true ? "default" : "outline"}
                  onClick={() => setFeelingBetter(true)}
                  className="flex-1"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Có
                </Button>
                <Button
                  variant={feelingBetter === false ? "default" : "outline"}
                  onClick={() => setFeelingBetter(false)}
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Không
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nhận xét (tùy chọn)</Label>
              <Textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedback(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitFeedback}>Gửi đánh giá</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
