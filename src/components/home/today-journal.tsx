import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { useIonRouter } from "@ionic/react";
import { ROUTE_PATHS } from "@/lib/constant";
import dayjs from "dayjs";

const sentimentColors: Record<string, string> = {
  POSITIVE: "success",
  NEUTRAL: "default",
  NEGATIVE: "warning",
};

const sentimentLabels: Record<string, string> = {
  POSITIVE: "Tích cực",
  NEUTRAL: "Trung lập",
  NEGATIVE: "Tiêu cực",
};

export default function TodayJournal() {
  const router = useIonRouter();
  const { journals } = useAppSelector((state) => state.journal);
  
  const today = dayjs().format("YYYY-MM-DD");
  const todayJournal = journals.find(
    (journal) => dayjs(journal.date).format("YYYY-MM-DD") === today
  );

  const handleWrite = () => {
    router.push(ROUTE_PATHS.JOURNAL_WRITE);
  };

  const handleView = () => {
    if (todayJournal) {
      router.push(`/journal/view/${dayjs(todayJournal.date).format("YYYY-MM-DD")}`);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nhật ký hôm nay
          </CardTitle>
          {todayJournal && todayJournal.analysis?.sentiment && (
            <Badge variant={sentimentColors[todayJournal.analysis.sentiment] as any}>
              {sentimentLabels[todayJournal.analysis.sentiment]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {todayJournal ? (
          <div className="space-y-3">
            <div>
              <p className="font-medium">{todayJournal.title || "Không có tiêu đề"}</p>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {todayJournal.content}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleView} className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Xem
              </Button>
              <Button size="sm" onClick={handleWrite} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Viết thêm
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Bạn chưa viết nhật ký hôm nay
            </p>
            <Button size="sm" onClick={handleWrite}>
              <Plus className="h-4 w-4 mr-2" />
              Viết ngay
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

