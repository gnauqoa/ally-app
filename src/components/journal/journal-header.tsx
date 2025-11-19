import { useAppSelector } from "@/redux/hooks";
import { useIonRouter } from "@ionic/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { JournalStatus } from "@/@types/journal";

interface JournalHeaderProps {
  date?: string;
  showStatus?: boolean;
}

export default function JournalHeader({ date, showStatus = true }: JournalHeaderProps) {
  const router = useIonRouter();
  const { currentJournal } = useAppSelector((state) => state.journal);

  const displayDate = date || (currentJournal?.createdAt ? dayjs(currentJournal.createdAt).format("DD/MM/YYYY") : dayjs().format("DD/MM/YYYY"));
  const isSubmitted = currentJournal?.status === JournalStatus.SUBMITTED;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 border-b border-border bg-background">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/journal", "back", "pop")}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">Nhật ký cảm xúc</h1>
          <p className="text-sm text-muted-foreground">{displayDate}</p>
        </div>
      </div>
      {showStatus && isSubmitted && (
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Đã gửi
          </span>
        </div>
      )}
    </div>
  );
}

