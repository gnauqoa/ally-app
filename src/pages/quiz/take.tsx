import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchQuizById,
  submitQuiz,
  clearCurrentQuiz,
  clearCurrentResult,
} from "@/redux/slices/quiz";
import { QUIZ_CODES } from "@/lib/score";
import { Progress } from "@/components/ui/progress";
import PageContainer from "@/components/page-container";
import { useToast } from "@/components/ui/toast";
import BDIResult from "@/components/quiz/bdi-result";
import DASS21Result from "@/components/quiz/dass21-result";
import ZungResult from "@/components/quiz/zung-result";
import GritResult from "@/components/quiz/grit-result";
import ReidResult from "@/components/quiz/reid-result";
import HollandResult from "@/components/quiz/holland-result";

export default function TakeQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { error: toastError } = useToast();
  const {
    currentQuiz: quiz,
    currentResult,
    isLoading,
    error,
  } = useAppSelector((state) => state.quiz);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]); // Store option IDs
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // Store option ID

  useIonViewDidEnter(() => {
    if (quizId) {
      dispatch(fetchQuizById(quizId));
    }
  }, [quizId, dispatch]);

  useIonViewWillLeave(() => {
    dispatch(clearCurrentQuiz());
    dispatch(clearCurrentResult());
  }, [dispatch]);

  useEffect(() => {
    if (quiz && quiz.questions) {
      // setUserAnswers(new Array(quiz.questions.length).fill(-1));
      setCurrentQuestionIndex(quiz.questions.length - 1);
      setUserAnswers(
        quiz.questions.map(
          (question) =>
            question.options[
              Math.floor(Math.random() * question.options.length)
            ].id
        )
      );
    }
  }, [quiz]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">Loading quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <Card className="w-full max-w-md p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">
                Error loading quiz
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {error}
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/quiz", "back")}
            className="w-full"
          >
            Back to Quizzes
          </Button>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">Quiz not found</div>
      </div>
    );
  }

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === (quiz.questions?.length || 0) - 1;

  if (!currentQuestion) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">
          No questions available
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (optionId: number) => {
    setSelectedAnswer(optionId);
  };

  const handleNext = async () => {
    if (selectedAnswer === null) {
      return;
    }

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (isLastQuestion) {
      // Submit quiz with all answers in the new format
      try {
        // Build answers array with questionId and optionIds
        const formattedAnswers =
          quiz.questions?.map((question, index) => ({
            questionId: question.id,
            selectedOptionIds: [newAnswers[index]], // Single option ID in array
          })) || [];

        await dispatch(
          submitQuiz({
            quizId: quiz.id,
            answers: formattedAnswers,
          })
        );
        // showResult will be set by useEffect when currentResult is available
      } catch (err: any) {
        toastError(
          err.message || "Lỗi khi gửi bài kiểm tra. Vui lòng thử lại."
        );
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1]);
    }
  };

  const renderResult = () => {
    if (!currentResult) return <></>;
    if (quiz.code === QUIZ_CODES.BDI) {
      return <BDIResult result={currentResult} />;
    }
    if (quiz.code === QUIZ_CODES.DASS21) {
      return <DASS21Result result={currentResult} />;
    }
    if (quiz.code === QUIZ_CODES.ZUNG) {
      return <ZungResult result={currentResult} />;
    }
    if (quiz.code === QUIZ_CODES.GRIT) {
      return <GritResult result={currentResult} />;
    }
    if (quiz.code === QUIZ_CODES.REID1984) {
      return <ReidResult result={currentResult} />;
    }
    if (quiz.code === QUIZ_CODES.HOLLAND) {
      return <HollandResult result={currentResult} />;
    }
    return <></>;
  };

  return (
    <PageContainer className="px-4 flex h-full flex-col bg-background overflow-y-auto p-4 space-y-4">
      {currentResult ? (
        renderResult()
      ) : (
        <Card className="p-6 gap-2 mt-6">
          <div className="flex flex-col">
            <div className="flex flex-row">
              <p className="text-sm text-muted-foreground mb-2">Question</p>
              <p className="text-sm ml-auto">
                {currentQuestionIndex + 1} of {quiz.questions?.length || 0}
              </p>
            </div>
            <Progress
              value={
                ((currentQuestionIndex + 1) / (quiz.questions?.length || 0)) *
                100
              }
              className="w-full"
            />
          </div>
          <p className="text-2xl font-semibold">{currentQuestion.text}</p>
          <div className="flex gap-3 mt-4 mb-1">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1"
              disabled={isLoading || selectedAnswer === null}
            >
              {isLastQuestion ? "Finish" : "Next"}
            </Button>
          </div>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswer === option.id
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {selectedAnswer === option.id && (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-left">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
