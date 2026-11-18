
import { z } from "zod";

export const authSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters"),

    lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),

    email: z.email("Enter a valid email address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AuthFormData = z.infer<typeof authSchema>;
