"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Input, Select } from "@/components/ui/FormElements";
import { FileUpload } from "@/components/payment/FileUpload";
import { SuccessModal } from "@/components/payment/SuccessModal";
import { Button } from "@/components/ui/Button";
import { 
  paymentSubmissionSchema, 
  PaymentSubmissionInput, 
  DOMAINS, 
  PAYMENT_MODES 
} from "@/lib/validation";
import { AlertCircle, Send, ShieldCheck } from "lucide-react";

export function PaymentSubmissionForm() {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentSubmissionInput>({
    resolver: zodResolver(paymentSubmissionSchema),
    defaultValues: {
      fullName: "",
      collegeName: "",
      domainOfInterest: undefined,
      modeOfPayment: undefined,
      transactionId: "",
      phoneNumber: "",
      whatsAppNumber: "",
      emailAddress: "",
      declaration: false,
    },
  });

  const declarationChecked = watch("declaration");

  const onSubmit = async (data: PaymentSubmissionInput) => {
    setSubmissionError(null);
    setScreenshotError(null);

    if (!screenshotFile) {
      setScreenshotError("Payment screenshot is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("collegeName", data.collegeName);
      formData.append("domainOfInterest", data.domainOfInterest);
      formData.append("modeOfPayment", data.modeOfPayment);
      formData.append("transactionId", data.transactionId);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("whatsAppNumber", data.whatsAppNumber);
      formData.append("emailAddress", data.emailAddress);
      formData.append("declaration", String(data.declaration));
      formData.append("screenshot", screenshotFile);

      const response = await fetch("/api/payment-submission", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "Something went wrong. Please try again.");
      }

      // Success
      setIsSubmitSuccess(true);
      reset();
      setScreenshotFile(null);
    } catch (err: any) {
      console.error("Submission Error:", err);
      setSubmissionError(err.message || "An unexpected error occurred during submission.");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {submissionError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <span className="font-bold">Submission Failed</span>
              <p className="mt-0.5 text-xs text-rose-600 font-medium leading-relaxed">
                {submissionError}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <FormField label="Full Name" required error={errors.fullName?.message}>
            <Input
              type="text"
              placeholder="John Doe"
              disabled={isSubmitting}
              {...register("fullName")}
            />
          </FormField>

          {/* Email Address */}
          <FormField label="Email Address" required error={errors.emailAddress?.message}>
            <Input
              type="email"
              placeholder="johndoe@example.com"
              disabled={isSubmitting}
              {...register("emailAddress")}
            />
          </FormField>

          {/* College Name */}
          <FormField label="College Name" required error={errors.collegeName?.message}>
            <Input
              type="text"
              placeholder="Your University / College"
              disabled={isSubmitting}
              {...register("collegeName")}
            />
          </FormField>

          {/* Domain of Interest */}
          <FormField label="Domain of Interest" required error={errors.domainOfInterest?.message}>
            <div className="relative">
              <Select disabled={isSubmitting} {...register("domainOfInterest")}>
                <option value="">Select Domain</option>
                {DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </Select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </FormField>

          {/* Phone Number */}
          <FormField label="Phone Number" required error={errors.phoneNumber?.message}>
            <Input
              type="tel"
              placeholder="e.g. +91 9876543210"
              disabled={isSubmitting}
              {...register("phoneNumber")}
            />
          </FormField>

          {/* WhatsApp Number */}
          <FormField label="WhatsApp Number" required error={errors.whatsAppNumber?.message}>
            <Input
              type="tel"
              placeholder="e.g. +91 9876543210"
              disabled={isSubmitting}
              {...register("whatsAppNumber")}
            />
          </FormField>

          {/* Mode of Payment */}
          <FormField label="Mode of Payment" required error={errors.modeOfPayment?.message}>
            <div className="relative">
              <Select disabled={isSubmitting} {...register("modeOfPayment")}>
                <option value="">Select Mode</option>
                {PAYMENT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </Select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </FormField>

          {/* Transaction ID */}
          <FormField label="Transaction ID" required error={errors.transactionId?.message}>
            <Input
              type="text"
              placeholder="UPI Ref / UTR / Txn No."
              disabled={isSubmitting}
              {...register("transactionId")}
            />
          </FormField>
        </div>

        {/* File Upload Component */}
        <div className="w-full pt-2">
          <FormField label="Payment Screenshot" required error={screenshotError || undefined}>
            <FileUpload
              value={screenshotFile}
              onChange={(file) => {
                setScreenshotFile(file);
                if (file) setScreenshotError(null);
              }}
              error={screenshotError || undefined}
            />
          </FormField>
        </div>

        {/* Declaration */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <div className="flex items-center h-5">
              <input
                id="declaration"
                type="checkbox"
                disabled={isSubmitting}
                className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-400 focus:ring-offset-2 accent-orange-500 cursor-pointer"
                {...register("declaration")}
              />
            </div>
            <div className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
              <label htmlFor="declaration" className="cursor-pointer select-none">
                I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that my payment will be verified by the <span className="font-bold text-slate-800">DEVPHOENIX Academy</span> team before my enrollment is confirmed.
              </label>
              {errors.declaration?.message && (
                <p className="text-xs text-rose-500 font-semibold mt-1 animate-pulse">
                  {errors.declaration.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2 rounded-full cursor-pointer shadow-[0_8px_25px_rgba(249,115,22,0.2)]"
            disabled={!declarationChecked || isSubmitting}
            loading={isSubmitting}
          >
            <Send className="w-4 h-4 shrink-0" />
            <span>{isSubmitting ? "Submitting details..." : "Submit Payment Details"}</span>
          </Button>
          
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium mt-3 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure 256-bit encrypted submission connection</span>
          </div>
        </div>
      </form>

      {/* Success Modal popup */}
      <SuccessModal
        isOpen={isSubmitSuccess}
        onClose={() => setIsSubmitSuccess(false)}
      />
    </div>
  );
}
