import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useIonRouter } from "@ionic/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { getResultById, getHistoricalResults } from "@/apis/results";
import { Result, HistoricalResults } from "@/@types/result";
import {
  getInterpretation,
  calculateDASS21Subscales,
  calculateGritSubscales,
  calculateHollandDimensions,
  calculateReidSubscales,
} from "@/lib/score";
import dayjs from "dayjs";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ResultDetailPage() {
  return <></>;
}
