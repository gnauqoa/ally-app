import TabTitle from "@/components/tab-title";
import { useAppSelector } from "@/redux/hooks";

export default function QuizTaskHeader() {
  const { currentQuiz } = useAppSelector((state) => state.quiz);
  if (!currentQuiz) return <></>;
  return <TabTitle title={currentQuiz.code} />;
}
