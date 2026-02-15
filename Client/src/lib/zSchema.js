import * as z from "zod"

export const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
})

export const profileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(8, "Password must be 8+ chars")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

export const blogSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(5, "Slug must be at least 5 characters"),
  featuredImage: z.any().optional(),
  blogContent: z.string().min(5, "Blog Content must be at least 5 characters"),
});