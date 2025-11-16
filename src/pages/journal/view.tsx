import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonLoading,
  IonAlert,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { createOutline, analyticsOutline, shareOutline, trashOutline } from 'ionicons/icons';
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

const ViewJournalPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { currentJournal, loading } = useAppSelector((state) => state.journal);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAnalyzeAlert, setShowAnalyzeAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

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
      setAlertMessage('Phân tích hoàn tất!');
      setShowAlert(true);
    } catch (error: any) {
      setAlertMessage(error.message || 'Lỗi khi phân tích');
      setShowAlert(true);
    }
  };

  const handleDelete = async () => {
    if (!currentJournal) return;

    try {
      await dispatch(deleteJournal(currentJournal.id)).unwrap();
      setAlertMessage('Đã xóa nhật ký');
      setShowAlert(true);
      
      setTimeout(() => {
        history.push(ROUTE_PATHS.JOURNAL);
      }, 1000);
    } catch (error: any) {
      setAlertMessage(error.message || 'Lỗi khi xóa');
      setShowAlert(true);
    }
  };

  const canEdit = currentJournal?.status === JournalStatus.DRAFT;
  const canAnalyze = currentJournal?.status === JournalStatus.SUBMITTED && !currentJournal.analysis;
  const hasAnalysis = currentJournal?.analysis;

  if (!currentJournal && !loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref={ROUTE_PATHS.JOURNAL} />
            </IonButtons>
            <IonTitle>Nhật ký</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="text-center py-10">
            <p className="text-gray-500">Không tìm thấy nhật ký</p>
            <IonButton routerLink={ROUTE_PATHS.JOURNAL} className="mt-4">
              Quay lại
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTE_PATHS.JOURNAL} />
          </IonButtons>
          <IonTitle>Nhật ký</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {currentJournal && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Date & Status */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dayjs(currentJournal.date).format('DD/MM/YYYY')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentJournal.status === JournalStatus.DRAFT && 'Bản nháp'}
                  {currentJournal.status === JournalStatus.SUBMITTED && 'Đã gửi'}
                  {currentJournal.status === JournalStatus.ANALYZED && 'Đã phân tích'}
                </p>
              </div>

              <div className="flex gap-2">
                {canEdit && (
                  <IonButton fill="outline" onClick={handleEdit}>
                    <IonIcon slot="start" icon={createOutline} />
                    Chỉnh sửa
                  </IonButton>
                )}
                <IonButton fill="outline" color="danger" onClick={() => setShowDeleteAlert(true)}>
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </div>
            </div>

            {/* Title */}
            {currentJournal.title && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentJournal.title}
                </h2>
              </div>
            )}

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {currentJournal.content}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {currentJournal.wordCount && <span>Số từ: {currentJournal.wordCount}</span>}
              {currentJournal.writingDuration && (
                <span>Thời gian viết: {Math.floor(currentJournal.writingDuration / 60)} phút</span>
              )}
            </div>

            {/* Analysis */}
            {hasAnalysis && <AnalysisCard analysis={currentJournal.analysis!} />}

            {/* Analyze Button */}
            {canAnalyze && (
              <div className="text-center">
                <IonButton onClick={() => setShowAnalyzeAlert(true)}>
                  <IonIcon slot="start" icon={analyticsOutline} />
                  Phân tích bằng AI
                </IonButton>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  AI sẽ phân tích cảm xúc và đưa ra đánh giá
                </p>
              </div>
            )}

            {/* Share with specialist */}
            {hasAnalysis && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Bạn có thể chia sẻ nhật ký này với chuyên gia tâm lý để được tư vấn
                </p>
                <IonButton size="small" fill="outline">
                  <IonIcon slot="start" icon={shareOutline} />
                  Chia sẻ với chuyên gia
                </IonButton>
              </div>
            )}
          </div>
        )}

        <IonLoading isOpen={loading} message="Đang tải..." />

        {/* Delete Confirmation */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa nhật ký này?"
          buttons={[
            {
              text: 'Hủy',
              role: 'cancel',
            },
            {
              text: 'Xóa',
              role: 'destructive',
              handler: handleDelete,
            },
          ]}
        />

        {/* Analyze Confirmation */}
        <IonAlert
          isOpen={showAnalyzeAlert}
          onDidDismiss={() => setShowAnalyzeAlert(false)}
          header="Phân tích AI"
          message="AI sẽ phân tích cảm xúc trong nhật ký của bạn. Sau khi phân tích, nhật ký sẽ không thể chỉnh sửa. Tiếp tục?"
          buttons={[
            {
              text: 'Hủy',
              role: 'cancel',
            },
            {
              text: 'Phân tích',
              handler: handleAnalyze,
            },
          ]}
        />

        {/* General Alert */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default ViewJournalPage;

