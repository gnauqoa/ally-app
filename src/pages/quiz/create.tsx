import { useState } from "react";
import { useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createQuiz } from "@/redux/slices/quiz";
import type { CreateQuizQuestionRequest } from "@/apis/quiz";

export default function CreateQuizPage() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.quiz);
  
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [localError, setLocalError] = useState("");
  const [questions, setQuestions] = useState<CreateQuizQuestionRequest[]>([
    {
      order: 1,
      text: "",
      type: "SINGLE_CHOICE",
      options: [
        { text: "", score: 0 },
        { text: "", score: 1 },
        { text: "", score: 2 },
        { text: "", score: 3 },
      ],
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        order: questions.length + 1,
        text: "",
        type: "SINGLE_CHOICE",
        options: [
          { text: "", score: 0 },
          { text: "", score: 1 },
          { text: "", score: 2 },
          { text: "", score: 3 },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const filtered = questions.filter((_, i) => i !== index);
      // Re-order questions
      const reordered = filtered.map((q, i) => ({ ...q, order: i + 1 }));
      setQuestions(reordered);
    }
  };

  const updateQuestionText = (index: number, value: string) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, text: value } : q))
    );
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: 'text' | 'score', value: string | number) => {
    setQuestions(
      questions.map((q, i) => {
        if (i === questionIndex) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = {
            ...newOptions[optionIndex],
            [field]: value,
          };
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleSave = async () => {
    setLocalError("");
    
    if (!code.trim()) {
      setLocalError("Please enter a quiz code");
      return;
    }

    if (!name.trim()) {
      setLocalError("Please enter a quiz name");
      return;
    }

    if (!category.trim()) {
      setLocalError("Please enter a quiz category");
      return;
    }

    if (questions.some((q) => !q.text.trim())) {
      setLocalError("Please fill in all questions");
      return;
    }

    if (questions.some((q) => q.options.some((opt) => !opt.text.trim()))) {
      setLocalError("Please fill in all option texts");
      return;
    }

    try {
      await dispatch(
        createQuiz({
          code,
          name,
          description,
          category,
          questions,
        })
      ).unwrap();
      
      router.push("/quiz", "back");
    } catch (err: any) {
      console.error("Failed to create quiz:", err);
      setLocalError(err || "Failed to create quiz");
    }
  };

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Create New Quiz</h1>
          
          {(localError || error) && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-950 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {localError || error}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quiz Code</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., BDI, GAD-7"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quiz Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter quiz name"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Tâm lý, Sức khỏe"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
                className="w-full"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
            <Button onClick={addQuestion} size="sm" className="gap-2" disabled={isLoading}>
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={qIndex} className="p-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">
                      Question {qIndex + 1}
                    </label>
                    <Input
                      value={question.text}
                      onChange={(e) =>
                        updateQuestionText(qIndex, e.target.value)
                      }
                      placeholder="Enter your question"
                      className="w-full"
                      disabled={isLoading}
                    />
                  </div>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(qIndex)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Options (with scores)</label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          value={option.text}
                          onChange={(e) =>
                            updateOption(qIndex, optIndex, 'text', e.target.value)
                          }
                          placeholder={`Option ${optIndex + 1} text`}
                          className="w-full"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          value={option.score}
                          onChange={(e) =>
                            updateOption(qIndex, optIndex, 'score', parseInt(e.target.value) || 0)
                          }
                          placeholder="Score"
                          className="w-full"
                          disabled={isLoading}
                          min={0}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-1">
                    Each option can have a different score value
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleSave} className="gap-2 flex-1" disabled={isLoading}>
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Quiz"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/quiz", "back")}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

