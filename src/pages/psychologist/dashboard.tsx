import { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, UserCheck, Clock, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchMyPatients, fetchPsychologistProfile } from "@/redux/slices/psychologist";
import { RelationshipStatus } from "@/@types/psychologist";
import { GET_ROUTE_PATHS } from "@/lib/constant";
import dayjs from "dayjs";

const statusLabels: Record<RelationshipStatus, string> = {
  [RelationshipStatus.PENDING]: "Chờ xác nhận",
  [RelationshipStatus.ACTIVE]: "Đang hoạt động",
  [RelationshipStatus.INACTIVE]: "Không hoạt động",
};

const statusVariants: Record<RelationshipStatus, "warning" | "success" | "default"> = {
  [RelationshipStatus.PENDING]: "warning",
  [RelationshipStatus.ACTIVE]: "success",
  [RelationshipStatus.INACTIVE]: "default",
};

export default function PsychologistDashboard() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { patients, profile, isLoading } = useAppSelector((state) => state.psychologist);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchPsychologistProfile());
    dispatch(fetchMyPatients());
  }, [dispatch]);

  const filteredPatients = patients.filter((p) =>
    p.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePatients = patients.filter((p) => p.status === RelationshipStatus.ACTIVE);
  const pendingPatients = patients.filter((p) => p.status === RelationshipStatus.PENDING);

  const handlePatientClick = (patientId: number) => {
    router.push(GET_ROUTE_PATHS.PSYCHOLOGIST_PATIENT(patientId));
  };

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Xin chào, {profile?.user?.name || "Bác sĩ"}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý bệnh nhân và theo dõi tiến trình điều trị
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng bệnh nhân
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-green-500" />
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Đang hoạt động
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activePatients.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Chờ xác nhận
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingPatients.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bệnh nhân theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Patients List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Danh sách bệnh nhân</h2>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Đang tải...
            </div>
          ) : filteredPatients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">
                  {searchTerm
                    ? "Không tìm thấy bệnh nhân nào"
                    : "Bạn chưa có bệnh nhân nào"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredPatients.map((patientRel) => (
                <Card
                  key={patientRel.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handlePatientClick(patientRel.patientId)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-semibold text-primary">
                            {patientRel.patient?.name?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold truncate">
                              {patientRel.patient?.name || "Unknown"}
                            </p>
                            <Badge variant={statusVariants[patientRel.status]}>
                              {statusLabels[patientRel.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {patientRel.patient?.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Kết nối: {dayjs(patientRel.connectedAt).format("DD/MM/YYYY")}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

