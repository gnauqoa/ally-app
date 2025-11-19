import * as z from "zod";

export const journalSchema = z.object({
  title: z.string()
    .min(1, "Tiêu đề không được để trống")
    .max(200, "Tiêu đề không được quá 200 ký tự"),
  content: z.string()
    .min(10, "Nội dung phải có ít nhất 10 ký tự")
    .max(10000, "Nội dung không được quá 10000 ký tự"),
});

export type JournalFormValues = z.infer<typeof journalSchema>;

