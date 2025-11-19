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
  Loader2,
  Trash2,
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
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, treatmentPlanSchema, NoteFormValues, TreatmentPlanFormValues } from "@/lib/validations/psychologist";
import { useToast } from "@/components/ui/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function PatientProfile() {
  const { patientId } = useParams<{ patientId: string }>();
  const router = useIonRouter();
  const dispatch = useAppDispatch();
  const { patients, currentPatientNotes, currentPatientPlans, isLoading } =
    useAppSelector((state) => state.psychologist);
  const { success, error: toastError } = useToast();

  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  // Note form
  const noteForm = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: "",
      isPrivate: true,
    },
  });

  // Plan form
  const planForm = useForm<TreatmentPlanFormValues>({
    resolver: zodResolver(treatmentPlanSchema),
    defaultValues: {
      title: "",
      description: "",
      goals: "",
      tasks: "",
      startDate: "",
      endDate: "",
    },
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

  const handleCreateNote = async (data: NoteFormValues) => {
    if (!patientId) return;

    try {
      await dispatch(
        createNote({
          patientId: parseInt(patientId),
          content: data.content,
          isPrivate: data.isPrivate ?? true,
        })
      ).unwrap();
      success({ title: "Ghi chú đã được tạo thành công" });
      noteForm.reset();
      setShowNoteDialog(false);
    } catch (error: any) {
      toastError(error.message || "Lỗi khi tạo ghi chú");
      console.error("Failed to create note:", error);
    }
  };

  const handleCreatePlan = async (data: TreatmentPlanFormValues) => {
    if (!patientId) return;

    try {
      // Parse goals and tasks from string to array
      const goals = data.goals
        ? data.goals.split("\n").filter((g) => g.trim())
        : [];
      const tasks = data.tasks
        ? data.tasks.split("\n").filter((t) => t.trim())
        : [];

      await dispatch(
        createPlan({
          patientId: parseInt(patientId),
          title: data.title,
          description: data.description || "",
          goals,
          tasks,
          startDate: data.startDate || "",
          endDate: data.endDate || "",
        })
      ).unwrap();
      success({ title: "Kế hoạch điều trị đã được tạo thành công" });
      planForm.reset();
      setShowPlanDialog(false);
    } catch (error: any) {
      toastError(error.message || "Lỗi khi tạo kế hoạch");
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
      success({ title: "Kế hoạch đã được đánh dấu hoàn thành" });
    } catch (error: any) {
      toastError(error.message || "Lỗi khi cập nhật kế hoạch");
      console.error("Failed to update plan:", error);
    }
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
          <Form {...noteForm}>
            <form onSubmit={noteForm.handleSubmit(handleCreateNote)} className="space-y-4">
              <FormField
                control={noteForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Nhập ghi chú..."
                        rows={6}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNoteDialog(false)}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu ghi chú
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
          <Form {...planForm}>
            <form onSubmit={planForm.handleSubmit(handleCreatePlan)} className="space-y-4">
              <FormField
                control={planForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ví dụ: Kế hoạch giảm căng thẳng"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={planForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Mô tả chi tiết về kế hoạch..."
                        rows={3}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={planForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={planForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={planForm.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mục tiêu (một dòng cho mỗi mục tiêu)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Nhập mục tiêu, mỗi mục tiêu trên một dòng..."
                        rows={3}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={planForm.control}
                name="tasks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhiệm vụ (một dòng cho mỗi nhiệm vụ)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Nhập nhiệm vụ, mỗi nhiệm vụ trên một dòng..."
                        rows={3}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPlanDialog(false)}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Tạo kế hoạch
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

