import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchJournalByDate,
  analyzeJournal,
  deleteJournal,
  clearCurrentJournal,
} from '@/redux/slices/journal';
import { JournalStatus } from '@/@types/journal';
import AnalysisCard from '@/components/journal/analysis-card';
import dayjs from 'dayjs';
import { ROUTE_PATHS } from '@/lib/constant';
import PageContainer from '@/components/page-container';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ArrowLeft, Edit, Sparkles, Share2, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const ViewJournalPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { currentJournal, loading } = useAppSelector((state) => state.journal);
  const { success, error: toastError } = useToast();

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAnalyzeAlert, setShowAnalyzeAlert] = useState(false);

  useEffect(() => {
    if (date) {
      dispatch(fetchJournalByDate(date));
    }

    return () => {
      dispatch(clearCurrentJournal());
    };
  }, [date]);

  const handleEdit = () => {
    history.push(`${ROUTE_PATHS.JOURNAL_WRITE}?date=${date}`);
  };

  const handleAnalyze = async () => {
    if (!currentJournal) return;

    try {
      await dispatch(analyzeJournal(currentJournal.id)).unwrap();
      success({ title: 'Phân tích hoàn tất!' });
      setShowAnalyzeAlert(false);
    } catch (error: any) {
      toastError({ title: error.message || 'Lỗi khi phân tích' });
    }
  };

  const handleDelete = async () => {
    if (!currentJournal) return;

    try {
      await dispatch(deleteJournal(currentJournal.id)).unwrap();
      success({ title: 'Đã xóa nhật ký' });
      setShowDeleteAlert(false);
      
      setTimeout(() => {
        history.push(ROUTE_PATHS.JOURNAL);
      }, 1000);
    } catch (error: any) {
      toastError(error.message || 'Lỗi khi xóa');
    }
  };

  const isToday = currentJournal && dayjs(currentJournal.date).isSame(dayjs(), 'day');
  const canEdit = currentJournal?.status === JournalStatus.DRAFT && isToday;
  const canAnalyze = currentJournal?.status === JournalStatus.SUBMITTED && !currentJournal.analysis;
  const hasAnalysis = currentJournal?.analysis;

  if (!currentJournal && !loading) {
    return (
      <PageContainer className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => history.push(ROUTE_PATHS.JOURNAL)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Nhật ký</h1>
          </div>
          <div className="text-center py-10">
            <p className="text-muted-foreground">Không tìm thấy nhật ký</p>
            <Button onClick={() => history.push(ROUTE_PATHS.JOURNAL)} className="mt-4">
              Quay lại
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="px-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b mb-6 -mx-4 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => history.push(ROUTE_PATHS.JOURNAL)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Nhật ký</h1>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {currentJournal && !loading && (
        <div className="max-w-4xl mx-auto space-y-6 pb-8">
          {/* Date & Status */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {dayjs(currentJournal.date).format('DD/MM/YYYY')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentJournal.status === JournalStatus.DRAFT && 'Bản nháp'}
                {currentJournal.status === JournalStatus.SUBMITTED && 'Đã gửi'}
                {currentJournal.status === JournalStatus.ANALYZED && 'Đã phân tích'}
              </p>
            </div>

            <div className="flex gap-2">
              {canEdit && (
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowDeleteAlert(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Title */}
          {currentJournal.title && (
            <div>
              <h3 className="text-xl font-semibold">
                {currentJournal.title}
              </h3>
            </div>
          )}

          {/* Content */}
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {currentJournal.content}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {currentJournal.wordCount && <span>Số từ: {currentJournal.wordCount}</span>}
            {currentJournal.writingDuration && (
              <span>Thời gian viết: {Math.floor(currentJournal.writingDuration / 60)} phút</span>
            )}
          </div>

          {/* Analysis */}
          {hasAnalysis && <AnalysisCard analysis={currentJournal.analysis!} />}

          {/* Analyze Button */}
          {canAnalyze && (
            <div className="text-center space-y-2">
              <Button onClick={() => setShowAnalyzeAlert(true)} size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                Phân tích bằng AI
              </Button>
              <p className="text-sm text-muted-foreground">
                AI sẽ phân tích cảm xúc và đưa ra đánh giá
              </p>
            </div>
          )}

          {/* Share with specialist */}
          {hasAnalysis && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Bạn có thể chia sẻ nhật ký này với chuyên gia tâm lý để được tư vấn
              </p>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Chia sẻ với chuyên gia
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhật ký này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Analyze Confirmation */}
      <AlertDialog open={showAnalyzeAlert} onOpenChange={setShowAnalyzeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Phân tích AI</AlertDialogTitle>
            <AlertDialogDescription>
              AI sẽ phân tích cảm xúc trong nhật ký của bạn. Sau khi phân tích, nhật ký sẽ không thể chỉnh sửa. Tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleAnalyze}>Phân tích</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default ViewJournalPage;

