import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchQuizById,
  submitQuiz,
  clearCurrentQuiz,
  clearCurrentResult,
} from "@/redux/slices/quiz";
import { getInterpretation } from "@/lib/score";
import { Progress } from "@/components/ui/progress";
import { ROUTE_PATHS } from "@/lib/constant";

export default function TakeQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const {
    currentQuiz: quiz,
    currentResult,
    isLoading,
    error,
  } = useAppSelector((state) => state.quiz);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]); // Store option IDs
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null); // Store option ID
  const showResult = currentResult !== null;

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
      setUserAnswers(new Array(quiz.questions.length).fill(-1));
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
        ).unwrap();
        // showResult will be set by useEffect when currentResult is available
      } catch (err) {
        console.error("Failed to submit quiz:", err);
        alert("Failed to submit quiz. Please try again.");
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

  if (showResult) {
    const interpretation = getInterpretation(
      currentResult.totalScore,
      quiz.code
    );

    return (
      <div className="flex h-full flex-col bg-background overflow-y-auto p-4 space-y-4">
        <Card className="p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Kết quả</h1>

          <div className="flex flex-col">
            <p className="text-slate-500 text-sm">ĐIỂM CỦA BẠN</p>
            <p className={`text-7xl font-bold ${interpretation.color}`}>
              {currentResult.totalScore}
            </p>
            <p className={`text-xl font-semibold mt-2 ${interpretation.color}`}>
              {interpretation.level}
            </p>
          </div>

          <div className="text-left bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mt-4">
            <p className="text-slate-700 dark:text-slate-300 text-sm">
              {interpretation.description}
            </p>
          </div>
        </Card>

        {/* AI Interpretation */}
        {currentResult.interpretation && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <h3 className="font-semibold">Phân tích AI</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {currentResult.interpretation}
              </p>
            </CardContent>
          </Card>
        )}

        {/* AI Recommendations */}
        {currentResult.recommendations && currentResult.recommendations.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">💡</span>
                </div>
                <h3 className="font-semibold">Khuyến nghị</h3>
              </div>
              <ul className="space-y-2">
                {currentResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-2 text-sm">
                    <span className="text-primary font-medium">•</span>
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Comparison with previous */}
        {currentResult.comparisonWithPrevious && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <h3 className="font-semibold">So sánh với lần trước</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {currentResult.comparisonWithPrevious}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            className="w-full" 
            onClick={() => router.push(`/result-history/${currentResult.id}`)}
          >
            Xem chi tiết đầy đủ
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push(ROUTE_PATHS.QUIZ, "root")}
          >
            Xem các bài kiểm tra khác
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
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
              ((currentQuestionIndex + 1) / (quiz.questions?.length || 0)) * 100
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
    </div>
  );
}
