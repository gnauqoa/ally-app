import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save } from "lucide-react";
import { saveQuiz, Quiz, QuizQuestion } from "@/lib/quiz-storage";
import { Card } from "@/components/ui/card";

export default function CreateQuizPage() {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }

    if (questions.some((q) => !q.question.trim())) {
      alert("Please fill in all questions");
      return;
    }

    if (questions.some((q) => q.options.some((opt) => !opt.trim()))) {
      alert("Please fill in all options");
      return;
    }

    const quiz: Quiz = {
      id: Date.now().toString(),
      title,
      description,
      questions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    saveQuiz(quiz);
    history.push("/quiz");
  };

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Create New Quiz</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quiz Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
            <Button onClick={addQuestion} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={question.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">
                      Question {qIndex + 1}
                    </label>
                    <Input
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(question.id, "question", e.target.value)
                      }
                      placeholder="Enter your question"
                      className="w-full"
                    />
                  </div>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Options</label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === optIndex}
                        onChange={() =>
                          updateQuestion(question.id, "correctAnswer", optIndex)
                        }
                        className="w-4 h-4"
                      />
                      <Input
                        value={option}
                        onChange={(e) =>
                          updateOption(question.id, optIndex, e.target.value)
                        }
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the correct answer by clicking the radio button
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleSave} className="gap-2 flex-1">
            <Save className="h-4 w-4" />
            Save Quiz
          </Button>
          <Button
            variant="outline"
            onClick={() => history.push("/quiz")}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

