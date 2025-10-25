import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getQuiz, saveQuizResult, Quiz } from "@/lib/quiz-storage";
import { CheckCircle2, XCircle } from "lucide-react";

export default function TakeQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const history = useHistory();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (quizId) {
      const loadedQuiz = getQuiz(quizId);
      if (loadedQuiz) {
        setQuiz(loadedQuiz);
        setUserAnswers(new Array(loadedQuiz.questions.length).fill(-1));
      } else {
        history.push("/quiz");
      }
    }
  }, [quizId, history]);

  if (!quiz) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer");
      return;
    }

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (isLastQuestion) {
      // Calculate score
      let correctCount = 0;
      quiz.questions.forEach((q, index) => {
        if (newAnswers[index] === q.correctAnswer) {
          correctCount++;
        }
      });
      setScore(correctCount);

      // Save result
      saveQuizResult({
        id: Date.now().toString(),
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: correctCount,
        totalQuestions: quiz.questions.length,
        answers: newAnswers,
        completedAt: new Date(),
      });

      setShowResult(true);
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
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background px-4">
        <Card className="w-full max-w-2xl p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
          <div className="text-6xl font-bold text-primary mb-4">
            {percentage}%
          </div>
          <p className="text-xl mb-6">
            You got {score} out of {quiz.questions.length} questions correct
          </p>

          <div className="space-y-4 mb-6 text-left">
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-red-500 bg-red-50 dark:bg-red-950"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <p className="text-sm">
                        Your answer: {question.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button onClick={() => history.push("/quiz")} className="flex-1">
              Back to Quizzes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCurrentQuestionIndex(0);
                setUserAnswers(new Array(quiz.questions.length).fill(-1));
                setSelectedAnswer(null);
                setShowResult(false);
                setScore(0);
              }}
              className="flex-1"
            >
              Retake Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
            >
              Previous
            </Button>
            <Button onClick={handleNext} className="flex-1">
              {isLastQuestion ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

