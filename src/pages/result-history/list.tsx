import ResultHistoryItem from "@/components/result-history-item";
import { useAppSelector } from "@/redux/hooks";

const ResultHistoryList = () => {
  const { results } = useAppSelector((state) => state.result);
  return (
    <div className="space-y-3">
      {results.map((result) => (
        <ResultHistoryItem key={result.id} result={result} />
      ))}
    </div>
  );
};

export default ResultHistoryList;
