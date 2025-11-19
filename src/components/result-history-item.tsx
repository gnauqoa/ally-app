import { Result } from "@/@types/result";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import ResultBadge from "./quiz/result-badge";

const ResultHistoryItem = ({ result }: { result: Result }) => {
  const { quiz } = result;
  return (
    <Card
      className="gap-0 py-4 hover:bg-accent/80 cursor-pointer"
    >
      <CardHeader className="px-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{quiz?.code}</p>
          <CardTitle> {quiz?.name} </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-4">
        <ResultBadge result={result} code={quiz?.code || ""} />
      </CardContent>
    </Card>
  );
};

export default ResultHistoryItem;
