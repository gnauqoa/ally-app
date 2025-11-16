import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useIonRouter } from "@ionic/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  FileText,
  ClipboardList,
  User,
  Plus,
  Calendar,
  Target,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchMyPatients,
  fetchPatientNotes,
  fetchPatientPlans,
  createNote,
  createPlan,
  updatePlan,
  clearCurrentPatient,
} from "@/redux/slices/psychologist";
import {  TreatmentPlanStatus } from "@/@types/psychologist";
import dayjs from "dayjs";

export default function PatientProfile() {
  const { patientId } = useParams<{ patientId: string }>();
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { patients, currentPatientNotes, currentPatientPlans, isLoading } =
    useAppSelector((state) => state.psychologist);

  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [planForm, setPlanForm] = useState({
    title: "",
    description: "",
    goals: [""],
    tasks: [""],
    startDate: "",
    endDate: "",
  });

  const patient = patients.find((p) => p.patientId === parseInt(patientId || "0"));

  useEffect(() => {
    if (!patients.length) {
      dispatch(fetchMyPatients());
    }
    if (patientId) {
      dispatch(fetchPatientNotes(parseInt(patientId)));
      dispatch(fetchPatientPlans(parseInt(patientId)));
    }

    return () => {
      dispatch(clearCurrentPatient());
    };
  }, [patientId, dispatch]);

  const handleCreateNote = async () => {
    if (!noteContent.trim() || !patientId) return;

    try {
      await dispatch(
        createNote({
          patientId: parseInt(patientId),
          content: noteContent,
          isPrivate: true,
        })
      ).unwrap();
      setNoteContent("");
      setShowNoteDialog(false);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleCreatePlan = async () => {
    if (!planForm.title.trim() || !patientId) return;

    try {
      await dispatch(
        createPlan({
          patientId: parseInt(patientId),
          title: planForm.title,
          description: planForm.description,
          goals: planForm.goals.filter((g) => g.trim()),
          tasks: planForm.tasks.filter((t) => t.trim()),
          startDate: planForm.startDate,
          endDate: planForm.endDate,
        })
      ).unwrap();
      setPlanForm({
        title: "",
        description: "",
        goals: [""],
        tasks: [""],
        startDate: "",
        endDate: "",
      });
      setShowPlanDialog(false);
    } catch (error) {
      console.error("Failed to create plan:", error);
    }
  };

  const handleCompletePlan = async (planId: number) => {
    try {
      await dispatch(
        updatePlan({
          planId,
          data: { status: TreatmentPlanStatus.COMPLETED },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update plan:", error);
    }
  };

  const addGoal = () => {
    setPlanForm((prev) => ({ ...prev, goals: [...prev.goals, ""] }));
  };

  const addTask = () => {
    setPlanForm((prev) => ({ ...prev, tasks: [...prev.tasks, ""] }));
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...planForm.goals];
    newGoals[index] = value;
    setPlanForm((prev) => ({ ...prev, goals: newGoals }));
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...planForm.tasks];
    newTasks[index] = value;
    setPlanForm((prev) => ({ ...prev, tasks: newTasks }));
  };

  if (!patient) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Không tìm thấy bệnh nhân</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background overflow-y-auto">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.goBack()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{patient.patient?.name}</h1>
            <p className="text-sm text-muted-foreground">{patient.patient?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">
              <User className="h-4 w-4 mr-2" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="h-4 w-4 mr-2" />
              Ghi chú
            </TabsTrigger>
            <TabsTrigger value="plans">
              <ClipboardList className="h-4 w-4 mr-2" />
              Kế hoạch
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bệnh nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-muted-foreground">Họ tên</Label>
                  <p className="font-medium">{patient.patient?.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{patient.patient?.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Giới tính</Label>
                  <p className="font-medium">{patient.patient?.gender || "Không có"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Năm sinh</Label>
                  <p className="font-medium">{patient.patient?.birthYear || "Không có"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Kết nối từ</Label>
                  <p className="font-medium">
                    {dayjs(patient.connectedAt).format("DD/MM/YYYY")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quyền truy cập</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Xem nhật ký</span>
                  <Badge variant={patient.permission?.canViewJournals ? "success" : "default"}>
                    {patient.permission?.canViewJournals ? "Có" : "Không"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Xem trò chuyện</span>
                  <Badge variant={patient.permission?.canViewChats ? "success" : "default"}>
                    {patient.permission?.canViewChats ? "Có" : "Không"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Xem đánh giá</span>
                  <Badge variant={patient.permission?.canViewAssessments ? "success" : "default"}>
                    {patient.permission?.canViewAssessments ? "Có" : "Không"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4 mt-4">
            <Button onClick={() => setShowNoteDialog(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Thêm ghi chú mới
            </Button>

            {currentPatientNotes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Chưa có ghi chú nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {currentPatientNotes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs text-muted-foreground">
                          {dayjs(note.createdAt).format("DD/MM/YYYY HH:mm")}
                        </p>
                        {note.isPrivate && (
                          <Badge variant="secondary" className="text-xs">
                            Riêng tư
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Treatment Plans Tab */}
          <TabsContent value="plans" className="space-y-4 mt-4">
            <Button onClick={() => setShowPlanDialog(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Tạo kế hoạch điều trị
            </Button>

            {currentPatientPlans.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Chưa có kế hoạch điều trị nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {currentPatientPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{plan.title}</CardTitle>
                          {plan.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {plan.description}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            plan.status === TreatmentPlanStatus.ACTIVE
                              ? "success"
                              : plan.status === TreatmentPlanStatus.COMPLETED
                              ? "default"
                              : "destructive"
                          }
                        >
                          {plan.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {plan.startDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {dayjs(plan.startDate).format("DD/MM/YYYY")}
                            {plan.endDate && ` - ${dayjs(plan.endDate).format("DD/MM/YYYY")}`}
                          </span>
                        </div>
                      )}

                      {plan.goals && plan.goals.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4" />
                            <Label className="font-medium">Mục tiêu</Label>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {plan.goals.map((goal, idx) => (
                              <li key={idx}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {plan.status === TreatmentPlanStatus.ACTIVE && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompletePlan(plan.id)}
                          className="w-full"
                        >
                          Đánh dấu hoàn thành
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm ghi chú mới</DialogTitle>
            <DialogDescription>
              Ghi chú riêng tư cho bệnh nhân {patient.patient?.name}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Nhập ghi chú..."
            rows={6}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateNote} disabled={!noteContent.trim() || isLoading}>
              Lưu ghi chú
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Treatment Plan Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo kế hoạch điều trị</DialogTitle>
            <DialogDescription>
              Kế hoạch điều trị cho bệnh nhân {patient.patient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tiêu đề *</Label>
              <Input
                value={planForm.title}
                onChange={(e) => setPlanForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Ví dụ: Kế hoạch giảm căng thẳng"
              />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={planForm.description}
                onChange={(e) =>
                  setPlanForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Mô tả chi tiết về kế hoạch..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ngày bắt đầu</Label>
                <Input
                  type="date"
                  value={planForm.startDate}
                  onChange={(e) =>
                    setPlanForm((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Ngày kết thúc</Label>
                <Input
                  type="date"
                  value={planForm.endDate}
                  onChange={(e) => setPlanForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Mục tiêu</Label>
                <Button variant="outline" size="sm" onClick={addGoal}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {planForm.goals.map((goal, idx) => (
                  <Input
                    key={idx}
                    value={goal}
                    onChange={(e) => updateGoal(idx, e.target.value)}
                    placeholder={`Mục tiêu ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Nhiệm vụ</Label>
                <Button variant="outline" size="sm" onClick={addTask}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {planForm.tasks.map((task, idx) => (
                  <Input
                    key={idx}
                    value={task}
                    onChange={(e) => updateTask(idx, e.target.value)}
                    placeholder={`Nhiệm vụ ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreatePlan} disabled={!planForm.title.trim() || isLoading}>
              Tạo kế hoạch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

