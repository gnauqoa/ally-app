import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Settings, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchMyPsychologists,
  updateDataPermissions,
  updateConnection,
} from "@/redux/slices/patient-psychologist";
import { RelationshipStatus } from "@/@types/psychologist";
import dayjs from "dayjs";
import { useToast } from "@/components/ui/toast";

const statusLabels: Record<RelationshipStatus, string> = {
  [RelationshipStatus.PENDING]: "Chờ xác nhận",
  [RelationshipStatus.ACTIVE]: "Đang hoạt động",
  [RelationshipStatus.INACTIVE]: "Không hoạt động",
};

const statusVariants: Record<
  RelationshipStatus,
  "warning" | "success" | "default"
> = {
  [RelationshipStatus.PENDING]: "warning",
  [RelationshipStatus.ACTIVE]: "success",
  [RelationshipStatus.INACTIVE]: "default",
};

export default function MyPsychologist() {
  const dispatch = useAppDispatch();
  const { myPsychologists, isLoading } = useAppSelector(
    (state) => state.patientPsychologist
  );
  const { success, error: toastError } = useToast();
  const [selectedRelationship, setSelectedRelationship] = useState<
    number | null
  >(null);
  const [permissions, setPermissions] = useState({
    canViewJournals: false,
    canViewChats: false,
    canViewAssessments: false,
    shareAll: false,
  });

  useEffect(() => {
    dispatch(fetchMyPsychologists({ status: RelationshipStatus.ACTIVE }));
  }, [dispatch]);

  const handleOpenPermissions = (relationshipId: number) => {
    const rel = myPsychologists.find((r) => r.id === relationshipId);
    if (rel?.permission) {
      setPermissions({
        canViewJournals: rel.permission.canViewJournals || false,
        canViewChats: rel.permission.canViewChats || false,
        canViewAssessments: rel.permission.canViewAssessments || false,
        shareAll: rel.permission.shareAll || false,
      });
    }
    setSelectedRelationship(relationshipId);
  };

  const handleSavePermissions = async () => {
    if (!selectedRelationship) return;

    try {
      await dispatch(
        updateDataPermissions({
          relationshipId: selectedRelationship,
          permissions,
        })
      );
      success({ title: "Đã lưu thay đổi quyền truy cập" });
      setSelectedRelationship(null);
    } catch (error: any) {
      toastError(error.message || "Lỗi khi lưu thay đổi");
    }
  };

  const handleDisconnect = async (relationshipId: number) => {
    try {
      await dispatch(
        updateConnection({
          relationshipId,
          status: RelationshipStatus.INACTIVE,
        })
      ).unwrap();
      success({ title: "Đã ngắt kết nối với chuyên gia" });
    } catch (error: any) {
      toastError(error.message || "Lỗi khi ngắt kết nối");
    }
  };

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Chuyên gia của tôi</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý kết nối và quyền truy cập dữ liệu
          </p>
        </div>

        {/* Psychologists List */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Đang tải...
          </div>
        ) : myPsychologists.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                Bạn chưa kết nối với chuyên gia nào
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myPsychologists.map((rel) => (
              <Card key={rel.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-semibold text-primary">
                          {rel.psychologist?.user?.name
                            ?.charAt(0)
                            .toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-xl">
                            {rel.psychologist?.user?.name}
                          </CardTitle>
                          <Badge variant={statusVariants[rel.status]}>
                            {statusLabels[rel.status]}
                          </Badge>
                        </div>
                        {rel.psychologist?.specialization && (
                          <p className="text-sm text-muted-foreground">
                            {rel.psychologist.specialization}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Kết nối: {dayjs(rel.connectedAt).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Current Permissions Display */}
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      QUYỀN TRUY CẬP HIỆN TẠI
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        {rel.permission?.canViewJournals ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Nhật ký</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {rel.permission?.canViewChats ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Trò chuyện</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {rel.permission?.canViewAssessments ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Đánh giá</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {rel.permission?.shareAll ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>Chia sẻ tất cả</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenPermissions(rel.id)}
                      className="flex-1"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Quản lý quyền
                    </Button>
                    {rel.status === RelationshipStatus.ACTIVE && (
                      <Button
                        variant="destructive"
                        onClick={() => handleDisconnect(rel.id)}
                      >
                        Ngắt kết nối
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Permissions Dialog */}
      <Dialog
        open={selectedRelationship !== null}
        onOpenChange={(open) => !open && setSelectedRelationship(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quản lý quyền truy cập</DialogTitle>
            <DialogDescription>
              Chọn dữ liệu bạn muốn chia sẻ với chuyên gia
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="journals" className="flex-1">
                <div>
                  <p className="font-medium">Nhật ký tâm trạng</p>
                  <p className="text-xs text-muted-foreground">
                    Cho phép xem các bài nhật ký hàng ngày
                  </p>
                </div>
              </Label>
              <Switch
                id="journals"
                checked={permissions.canViewJournals}
                onCheckedChange={(checked) =>
                  setPermissions((prev) => ({
                    ...prev,
                    canViewJournals: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="chats" className="flex-1">
                <div>
                  <p className="font-medium">Lịch sử trò chuyện</p>
                  <p className="text-xs text-muted-foreground">
                    Cho phép xem các cuộc trò chuyện với AI
                  </p>
                </div>
              </Label>
              <Switch
                id="chats"
                checked={permissions.canViewChats}
                onCheckedChange={(checked) =>
                  setPermissions((prev) => ({ ...prev, canViewChats: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="assessments" className="flex-1">
                <div>
                  <p className="font-medium">Kết quả đánh giá</p>
                  <p className="text-xs text-muted-foreground">
                    Cho phép xem kết quả các bài kiểm tra tâm lý
                  </p>
                </div>
              </Label>
              <Switch
                id="assessments"
                checked={permissions.canViewAssessments}
                onCheckedChange={(checked) =>
                  setPermissions((prev) => ({
                    ...prev,
                    canViewAssessments: checked,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="shareAll" className="flex-1">
                <div>
                  <p className="font-medium">Chia sẻ tất cả</p>
                  <p className="text-xs text-muted-foreground">
                    Chia sẻ toàn bộ dữ liệu với chuyên gia
                  </p>
                </div>
              </Label>
              <Switch
                id="shareAll"
                checked={permissions.shareAll}
                onCheckedChange={(checked) =>
                  setPermissions((prev) => ({ ...prev, shareAll: checked }))
                }
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedRelationship(null)}
            >
              Hủy
            </Button>
            <Button onClick={handleSavePermissions} disabled={isLoading}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
