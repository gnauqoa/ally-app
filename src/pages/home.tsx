import { useIonRouter } from "@ionic/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, BookOpen, Settings } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { ROUTE_PATHS } from "@/lib/constant";

export default function HomePage() {
  const router = useIonRouter();
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="p-4 space-y-6">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold mb-2">
          Chào mừng đến với Ally{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Chăm sóc sức khỏe tâm lý của bạn với Ally, trợ lý tâm lý cá nhân hóa.
        </p>
      </div>

      <div className="grid gap-4">
        <Card
          className="p-4 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => router.push(ROUTE_PATHS.CHAT)}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold">Trò chuyện</p>
              <p className="text-muted-foreground">
                Bắt đầu cuộc trò chuyện và nhận hỗ trợ cho vấn đề của bạn. Chia
                sẻ mối quan tâm và nhận hướng dẫn cá nhân hóa.
              </p>
              <Button className="mt-4" size="sm">
                Bắt đầu trò chuyện
              </Button>
            </div>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => router.push(ROUTE_PATHS.QUIZ)}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold mb-2">Đánh giá tâm lý</p>
              <p className="text-muted-foreground">
                Tạo và làm bài đánh giá tâm lý để kiểm tra trạng thái tâm lý của
                bạn. Theo dõi tiến trình và cải thiện kỹ năng của bạn.
              </p>
              <Button className="mt-4" size="sm">
                Xem Bài Đánh Giá
              </Button>
            </div>
          </div>
        </Card>

        <Card
          className="p-4 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => router.push(ROUTE_PATHS.SETTINGS)}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xl font-semibold mb-2">Cài đặt</p>
              <p className="text-muted-foreground">
                Quản lý tài khoản, xem hồ sơ và tùy chỉnh các thiết lập của bạn.
              </p>
              <Button className="mt-4" size="sm" variant="outline">
                Vào Cài đặt
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
