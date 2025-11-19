import { Result, ResultJson } from "@/@types/result";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronRight } from "lucide-react";
import {
  getInterpretation,
  calculateDASS21Subscales,
  calculateGritSubscales,
  calculateHollandDimensions,
  calculateReidSubscales,
} from "@/lib/score";
import dayjs from "dayjs";
import { stringToColor } from "@/lib/utils";
import { useIonRouter } from "@ionic/react";
import { useMemo } from "react";

const ResultHistoryItem = ({ result }: { result: Result }) => {
  return <></>;
};

export default ResultHistoryItem;
