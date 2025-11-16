import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonLoading,
  IonAlert,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import { saveOutline, sendOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createJournal, updateJournal, fetchJournalByDate } from '@/redux/slices/journal';
import { JournalStatus } from '@/@types/journal';
import TopicSuggestions from '@/components/journal/topic-suggestions';
import dayjs from 'dayjs';
import { ROUTE_PATHS } from '@/lib/constant';

const WriteJournalPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { currentJournal, loading } = useAppSelector((state) => state.journal);

  const searchParams = new URLSearchParams(location.search);
  const dateParam = searchParams.get('date');
  const selectedDate = dateParam || dayjs().format('YYYY-MM-DD');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    // Try to load existing draft for this date
    if (dateParam) {
      dispatch(fetchJournalByDate(dateParam));
    }
  }, [dateParam]);

  useEffect(() => {
    if (currentJournal && currentJournal.status === JournalStatus.DRAFT) {
      setTitle(currentJournal.title || '');
      setContent(currentJournal.content);
    }
  }, [currentJournal]);

  useEffect(() => {
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
  }, [content]);

  const handleSelectPrompt = (prompt: string) => {
    if (!content) {
      setContent(prompt + '\n\n');
    } else {
      setContent(content + '\n\n' + prompt);
    }
  };

  const handleSaveDraft = async () => {
    if (!content.trim()) {
      setAlertMessage('Vui lòng nhập nội dung nhật ký');
      setShowAlert(true);
      return;
    }

    try {
      const writingDuration = Math.floor((Date.now() - startTime) / 1000);
      
      if (currentJournal && currentJournal.status === JournalStatus.DRAFT) {
        await dispatch(
          updateJournal({
            id: currentJournal.id,
            data: {
              title,
              content,
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
            title,
            content,
            wordCount,
            writingDuration,
            status: JournalStatus.DRAFT,
          })
        ).unwrap();
      }

      setAlertMessage('Đã lưu bản nháp');
      setShowAlert(true);
    } catch (error: any) {
      setAlertMessage(error.message || 'Lỗi khi lưu nhật ký');
      setShowAlert(true);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setAlertMessage('Vui lòng nhập nội dung nhật ký');
      setShowAlert(true);
      return;
    }

    try {
      const writingDuration = Math.floor((Date.now() - startTime) / 1000);
      
      if (currentJournal && currentJournal.status === JournalStatus.DRAFT) {
        await dispatch(
          updateJournal({
            id: currentJournal.id,
            data: {
              title,
              content,
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
            title,
            content,
            wordCount,
            writingDuration,
            status: JournalStatus.SUBMITTED,
          })
        ).unwrap();
      }

      setAlertMessage('Đã gửi nhật ký. AI đang phân tích...');
      setShowAlert(true);
      
      setTimeout(() => {
        history.push(ROUTE_PATHS.JOURNAL);
      }, 1500);
    } catch (error: any) {
      setAlertMessage(error.message || 'Lỗi khi gửi nhật ký');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTE_PATHS.JOURNAL} />
          </IonButtons>
          <IonTitle>Viết nhật ký</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Date display */}
          <div className="text-center py-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ngày: {dayjs(selectedDate).format('DD/MM/YYYY')}
            </p>
          </div>

          {/* Topic Suggestions */}
          <TopicSuggestions onSelectPrompt={handleSelectPrompt} />

          {/* Title */}
          <div>
            <IonInput
              value={title}
              onIonInput={(e) => setTitle(e.detail.value || '')}
              placeholder="Tiêu đề (không bắt buộc)"
              className="border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          {/* Content */}
          <div>
            <IonTextarea
              value={content}
              onIonInput={(e) => setContent(e.detail.value || '')}
              placeholder="Hôm nay bạn cảm thấy thế nào? Hãy chia sẻ suy nghĩ của bạn..."
              rows={15}
              className="border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          {/* Word count */}
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Số từ: {wordCount}</span>
            <span>Thời gian viết: {Math.floor((Date.now() - startTime) / 60000)} phút</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-8">
            <IonButton expand="block" fill="outline" onClick={handleSaveDraft} disabled={loading}>
              <IonIcon slot="start" icon={saveOutline} />
              Lưu nháp
            </IonButton>
            <IonButton expand="block" onClick={handleSubmit} disabled={loading}>
              <IonIcon slot="start" icon={sendOutline} />
              Gửi để phân tích
            </IonButton>
          </div>

          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
            <p className="text-blue-800 dark:text-blue-200">
              💡 <strong>Lưu ý:</strong> Sau khi gửi để phân tích, nhật ký sẽ không thể chỉnh sửa.
              AI sẽ phân tích cảm xúc và đưa ra đánh giá về trạng thái tinh thần của bạn.
            </p>
          </div>
        </div>

        <IonLoading isOpen={loading} message="Đang xử lý..." />
        
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

export default WriteJournalPage;

