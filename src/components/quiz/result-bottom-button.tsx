import { Button } from "../ui/button";
import { useIonRouter } from "@ionic/react";
import { ROUTE_PATHS } from "@/lib/constant";

const ResultBottomButton = ({
  needHelpFromPsychologist,
}: {
  needHelpFromPsychologist: boolean;
}) => {
  const router = useIonRouter();
  return needHelpFromPsychologist ? (
    <div className="gap-2 flex">
      <Button
        size="lg"
        variant="outline"
        className="flex-1 min-w-0"
        onClick={() => router.push(ROUTE_PATHS.QUIZ)}
      >
        Làm bài kiểm tra khác
      </Button>
      <Button size="lg" className="flex-1 min-w-0">
        Liên hệ chuyên gia
      </Button>
    </div>
  ) : (
    <Button
      size="lg"
      variant="outline"
      onClick={() => router.push(ROUTE_PATHS.QUIZ)}
    >
      Làm bài kiểm tra khác
    </Button>
  );
};

export default ResultBottomButton;
