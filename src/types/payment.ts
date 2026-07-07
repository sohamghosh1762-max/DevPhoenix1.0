export interface PaymentSubmissionFormData {
  fullName: string;
  collegeName: string;
  domainOfInterest: string;
  modeOfPayment: string;
  transactionId: string;
  screenshot: any; // Used for File on frontend and string/buffer on API
  phoneNumber: string;
  whatsAppNumber: string;
  emailAddress: string;
  declaration: boolean;
}

export type DomainOption =
  | "Artificial Intelligence & Prompt Engineering"
  | "Full Stack Development"
  | "Data Science"
  | "Data Analytics"
  | "Cloud & DevOps"
  | "Digital Marketing"
  | "DSA"
  | "Python Programming"
  | "Other";

export type PaymentModeOption =
  | "Google Pay"
  | "PhonePe"
  | "Paytm"
  | "UPI"
  | "Bank Transfer"
  | "Other";
