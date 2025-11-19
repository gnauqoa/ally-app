import { Result } from "@/@types/result";
import {
  calculateGritSubscales,
  calculateReidSubscales,
  calculateHollandDimensions,
  calculateDASS21Subscales,
  getNormalResultBadgeMeta,
  QUIZ_CODES,
} from "@/lib/score";
import dayjs from "dayjs";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const ResultBadge = ({
  result,
  code,
}: {
  result: Result | undefined;
  code: string;
}) => {
  const renderReidBadgeMeta = (result: Result) => {
    const assessmentResult = calculateReidSubscales(result.resultJson);
    return (
      <div className="flex flex-row gap-3">
        <p className="text-sm">
          {dayjs(result.createdAt).format("MMM DD, YYYY")}
        </p>
        <Badge variant="outline" className={cn(`text-primary ml-auto`)}>
          {assessmentResult[0].name}
        </Badge>
      </div>
    );
  };
  const renderGritBadgeMeta = (result: Result) => {
    const assessmentResult = calculateGritSubscales(result.resultJson);
    return (
      <div className="flex flex-row gap-3">
        <p className="text-sm">
          {dayjs(result.createdAt).format("MMM DD, YYYY")}
        </p>
        <Badge variant="outline" className={cn(`text-primary`, "ml-auto")}>
          {assessmentResult.interpretation.level}
        </Badge>
      </div>
    );
  };
  const renderHollandBadgeMeta = (result: Result) => {
    const assessmentResult = calculateHollandDimensions(result.resultJson);
    return (
      <div className="flex flex-row gap-3">
        <p className="text-sm">
          {dayjs(result.createdAt).format("MMM DD, YYYY")}
        </p>
        <Badge variant="outline" className={cn(`text-primary`, "ml-auto")}>
          {assessmentResult[0].name}
        </Badge>
      </div>
    );
  };

  const renderDass21BadgeMeta = (result: Result) => {
    const assessmentResult = calculateDASS21Subscales(result.resultJson);
    return (
      <div className="flex flex-col gap-3">
        <Badge
          variant="outline"
          className={cn(`text-${assessmentResult.depression.color}`)}
        >
          Trầm cảm: {assessmentResult.depression.label}
        </Badge>
        <Badge
          variant="outline"
          className={cn(`text-${assessmentResult.anxiety.color}`)}
        >
          Lo âu: {assessmentResult.anxiety.label}
        </Badge>
        <Badge
          variant="outline"
          className={cn(`text-${assessmentResult.stress.color}`)}
        >
          Căng thẳng: {assessmentResult.stress.label}
        </Badge>
      </div>
    );
  };

  const renderNormalBadgeMeta = (result: Result) => {
    const badgeMeta =
      code === QUIZ_CODES.BDI || code === QUIZ_CODES.ZUNG
        ? getNormalResultBadgeMeta(code, result)
        : undefined;

    if (!badgeMeta) {
      return <></>;
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <p className="text-sm">
            {dayjs(result.createdAt).format("MMM DD, YYYY")}
          </p>
          <Badge variant="outline" className={cn(badgeMeta?.color, "ml-auto")}>
            {badgeMeta.label}
          </Badge>
        </div>
      </div>
    );
  };

  if (!result) {
    return <p className="text-xs text-muted-foreground">Chưa có kết quả</p>;
  }

  if (code === QUIZ_CODES.REID1984) {
    return renderReidBadgeMeta(result);
  }

  if (code === QUIZ_CODES.GRIT) {
    return renderGritBadgeMeta(result);
  }

  if (code === QUIZ_CODES.HOLLAND) {
    return renderHollandBadgeMeta(result);
  }

  if (code === QUIZ_CODES.DASS21) {
    return renderDass21BadgeMeta(result);
  }

  return renderNormalBadgeMeta(result);
};

export default ResultBadge;
