import { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, CheckCircle2, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { searchForPsychologists, requestConnection } from "@/redux/slices/patient-psychologist";
import { useToast } from "@/components/ui/toast";

export default function FindPsychologist() {
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { psychologists, isLoading } = useAppSelector((state) => state.patientPsychologist);
  const { success, error: toastError } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [requestingId, setRequestingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(searchForPsychologists({ verified: true }));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(searchForPsychologists({ search: searchTerm, verified: true }));
  };

  const handleConnect = async (psychologistId: number) => {
    setRequestingId(psychologistId);
    try {
      await dispatch(requestConnection(psychologistId)).unwrap();
      success({ title: "Đã gửi yêu cầu kết nối" });
    } catch (error: any) {
      toastError(error.message || "Lỗi khi gửi yêu cầu");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Tìm chuyên gia tâm lý</h1>
          <p className="text-muted-foreground mt-1">
            Kết nối với chuyên gia để được tư vấn chuyên sâu
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, chuyên môn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Đang tải...</div>
        ) : psychologists.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                {searchTerm
                  ? "Không tìm thấy chuyên gia phù hợp"
                  : "Chưa có chuyên gia nào"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {psychologists.map((psych) => (
              <Card key={psych.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-semibold text-primary">
                          {psych.user?.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-xl">{psych.user?.name}</CardTitle>
                          {psych.verified && (
                            <Badge variant="success" className="rounded-full p-0 text-lg ml-auto">
                              <CheckCircle2 className="h-5 w-5" />
                            </Badge>
                          )}
                        </div>
                        {psych.specialization && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <Award className="h-4 w-4" />
                            <span>{psych.specialization}</span>
                          </div>
                        )}
                        {psych.experience && (
                          <p className="text-sm text-muted-foreground">
                            {psych.experience} năm kinh nghiệm
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {psych.bio && (
                    <p className="text-sm text-muted-foreground">{psych.bio}</p>
                  )}
                  {psych.education && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        HỌC VẤN
                      </p>
                      <p className="text-sm">{psych.education}</p>
                    </div>
                  )}
                  <Button
                    onClick={() => handleConnect(psych.id)}
                    disabled={requestingId === psych.id}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {requestingId === psych.id ? "Đang gửi..." : "Gửi yêu cầu kết nối"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

