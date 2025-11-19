import * as z from "zod";

export const feedbackSchema = z.object({
  emotion: z.enum([
    "very_satisfied",
    "satisfied",
    "neutral",
    "unsatisfied",
    "very_unsatisfied",
  ]),
  feedback: z
    .string()
    .min(0, "Bình luận không được để trống")
    .max(500, "Bình luận không được quá 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
