import { z } from "zod";

export const DOMAINS = [
  "Artificial Intelligence & Prompt Engineering",
  "Full Stack Development",
  "Data Science",
  "Data Analytics",
  "Cloud & DevOps",
  "Digital Marketing",
  "DSA",
  "Python Programming",
  "Other"
] as const;

export const PAYMENT_MODES = [
  "Google Pay",
  "PhonePe",
  "Paytm",
  "UPI",
  "Bank Transfer",
  "Other"
] as const;

export const ALLOWED_FILE_EXTENSIONS = ["jpg", "jpeg", "png", "pdf"];

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf"
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const paymentSubmissionSchema = z.object({
  fullName: z.string().min(1, "Name is required").trim(),
  collegeName: z.string().min(1, "College is required").trim(),
  domainOfInterest: z.enum(DOMAINS, {
    message: "Domain of Interest is required",
  }),
  modeOfPayment: z.enum(PAYMENT_MODES, {
    message: "Payment Mode is required",
  }),
  transactionId: z.string().min(1, "Transaction ID is required").trim(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[0-9+\s-]{10,15}$/, "Valid Phone Number is required"),
  whatsAppNumber: z
    .string()
    .min(10, "WhatsApp number must be at least 10 digits")
    .max(15, "WhatsApp number must not exceed 15 digits")
    .regex(/^[0-9+\s-]{10,15}$/, "Valid WhatsApp Number is required"),
  emailAddress: z.string().email("Valid Email is required").trim(),
  declaration: z.boolean().refine((val) => val === true, "You must check the declaration"),
});

export type PaymentSubmissionInput = z.infer<typeof paymentSubmissionSchema>;
