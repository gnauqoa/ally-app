import * as z from "zod";

export const noteSchema = z.object({
  content: z.string()
    .min(1, "Ghi chú không được để trống")
    .max(2000, "Ghi chú không được quá 2000 ký tự"),
  isPrivate: z.boolean().optional(),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

export const treatmentPlanSchema = z.object({
  title: z.string()
    .min(1, "Tiêu đề không được để trống")
    .max(255, "Tiêu đề không được quá 255 ký tự"),
  description: z.string()
    .max(2000, "Mô tả không được quá 2000 ký tự")
    .optional()
    .or(z.literal("")),
  goals: z.string()
    .max(2000, "Mục tiêu không được quá 2000 ký tự")
    .optional()
    .or(z.literal("")),
  tasks: z.string()
    .max(2000, "Nhiệm vụ không được quá 2000 ký tự")
    .optional()
    .or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
});

export type TreatmentPlanFormValues = z.infer<typeof treatmentPlanSchema>;

