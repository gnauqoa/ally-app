import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createJournal,
  updateJournal,
  fetchJournalByDate,
} from "@/redux/slices/journal";
import { JournalStatus } from "@/@types/journal";
import TopicSuggestions from "@/components/journal/topic-suggestions";
import AnalysisCard from "@/components/journal/analysis-card";
import dayjs from "dayjs";
import { ROUTE_PATHS } from "@/lib/constant";
import PageContainer from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalSchema, JournalFormValues } from "@/lib/validations/journal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const WriteJournalPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { currentJournal, loading } = useAppSelector((state) => state.journal);
  const { success, error: toastError } = useToast();

  const searchParams = new URLSearchParams(location.search);
  const dateParam = searchParams.get("date");
  const selectedDate = dateParam || dayjs().format("YYYY-MM-DD");

  const [wordCount, setWordCount] = useState(0);
  const [startTime] = useState(Date.now());

  const isToday = dayjs(selectedDate).isSame(dayjs(), "day");
  const isPastDate = dayjs(selectedDate).isBefore(dayjs(), "day");
  const isSubmitted = currentJournal?.status === JournalStatus.SUBMITTED;
  const isEditable = !isSubmitted && isToday;

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: `Nhật ký ngày ${dayjs(selectedDate).format("DD/MM/YYYY")}`,
      content: "",
    },
  });

  useEffect(() => {
    // Try to load existing draft for this date
    if (dateParam) {
      dispatch(fetchJournalByDate(dateParam));
    }
  }, [dateParam]);

  useEffect(() => {
    if (currentJournal && currentJournal.status === JournalStatus.DRAFT) {
      form.reset({
        title: currentJournal.title || "",
        content: currentJournal.content,
      });
    } else if (!currentJournal) {
      // Auto-fill title for new journal
      form.reset({
        title: `Nhật ký ngày ${dayjs(selectedDate).format("DD/MM/YYYY")}`,
        content: "",
      });
    }
  }, [currentJournal, selectedDate]);

  const content = form.watch("content");
  useEffect(() => {
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
  }, [content]);

  const handleSelectPrompt = (prompt: string) => {
    const currentContent = form.getValues("content");
    if (!currentContent) {
      form.setValue("content", prompt + "\n\n");
    } else {
      form.setValue("content", currentContent + "\n\n" + prompt);
    }
  };

  const handleSaveDraft = async (data: JournalFormValues) => {
    if (!isToday) {
      toastError({ title: "Bạn chỉ có thể viết nhật ký cho ngày hôm nay" });
      return;
    }

    try {
      const writingDuration = Math.floor((Date.now() - startTime) / 1000);

      if (currentJournal && currentJournal.status === JournalStatus.DRAFT) {
        await dispatch(
          updateJournal({
            id: currentJournal.id,
            data: {
              title: data.title,
              content: data.content,
              wordCount,
              writingDuration,
              status: JournalStatus.DRAFT,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          createJournal({
            date: selectedDate,
            title: data.title,
            content: data.content,
            wordCount,
            writingDuration,
            status: JournalStatus.DRAFT,
          })
        ).unwrap();
      }

      success({ title: "Đã lưu bản nháp" });
    } catch (err: any) {
      toastError(err.message || "Lỗi khi lưu nhật ký");
    }
  };

  const handleSubmit = async (data: JournalFormValues) => {
    if (!isToday) {
      toastError({ title: "Bạn chỉ có thể viết nhật ký cho ngày hôm nay" });
      return;
    }

    try {
      const writingDuration = Math.floor((Date.now() - startTime) / 1000);

      if (currentJournal && currentJournal.status === JournalStatus.DRAFT) {
        await dispatch(
          updateJournal({
            id: currentJournal.id,
            data: {
              title: data.title,
              content: data.content,
              wordCount,
              writingDuration,
              status: JournalStatus.SUBMITTED,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          createJournal({
            date: selectedDate,
            title: data.title,
            content: data.content,
            wordCount,
            writingDuration,
            status: JournalStatus.SUBMITTED,
          })
        ).unwrap();
      }

      success({ title: "Đã gửi nhật ký. AI đang phân tích..." });

      setTimeout(() => {
        history.push(ROUTE_PATHS.JOURNAL);
      }, 1500);
    } catch (err: any) {
      toastError(err.message || "Lỗi khi gửi nhật ký");
    }
  };

  return (
    <PageContainer className="px-4">
      <div className="max-w-4xl mx-auto space-y-4 pb-8 pt-4">
        {/* Warning for non-current date */}
        {!isToday && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              <strong>⚠️ Lưu ý:</strong> Bạn chỉ có thể viết nhật ký cho ngày
              hôm nay.
              {isPastDate ? " Ngày này đã qua." : " Ngày này chưa đến."}
            </p>
          </div>
        )}

        {/* Submitted warning */}
        {isSubmitted && (
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>ℹ️ Thông báo:</strong> Nhật ký này đã được gửi. Bạn không
              thể chỉnh sửa.
            </AlertDescription>
          </Alert>
        )}

        {!isSubmitted && (
          <TopicSuggestions onSelectPrompt={handleSelectPrompt} />
        )}

        <Form {...form}>
          <form className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Tiêu đề"
                      className="text-base"
                      disabled={isSubmitted || loading}
                      readOnly={isSubmitted}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Hôm nay bạn cảm thấy thế nào? Hãy chia sẻ suy nghĩ của bạn..."
                      rows={15}
                      className="text-base resize-none"
                      disabled={isSubmitted || loading}
                      readOnly={isSubmitted}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Show analysis if submitted */}
            {isSubmitted && currentJournal?.analysis && (
              <AnalysisCard analysis={currentJournal.analysis} />
            )}

            {/* Word count */}
            {!isSubmitted && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Số từ: {wordCount}</span>
                <span>
                  Thời gian viết: {Math.floor((Date.now() - startTime) / 60000)}{" "}
                  phút
                </span>
              </div>
            )}

            {/* Actions */}
            {!isSubmitted && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={form.handleSubmit(handleSaveDraft)}
                  disabled={loading || !isToday}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Lưu nháp
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={loading || !isToday}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Gửi để phân tích
                </Button>
              </div>
            )}

            {/* Back button for submitted journals */}
            {isSubmitted && (
              <Button
                type="button"
                className="w-full"
                onClick={() => history.push(ROUTE_PATHS.JOURNAL)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách
              </Button>
            )}

            {/* Info */}
            {!isSubmitted && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
                <p className="text-blue-800 dark:text-blue-200">
                  💡 <strong>Lưu ý:</strong> Sau khi gửi để phân tích, nhật ký sẽ
                  không thể chỉnh sửa. AI sẽ phân tích cảm xúc và đưa ra đánh giá về
                  trạng thái tinh thần của bạn.
                </p>
              </div>
            )}
          </form>
        </Form>
      </div>
    </PageContainer>
  );
};

export default WriteJournalPage;
