"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { PaymentSubmissionForm } from "@/components/payment/PaymentSubmissionForm";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck } from "lucide-react";
import { designSystem } from "@/lib/design-system";

export default function PaymentSubmissionPage() {
  return (
    <>
      <Navbar />
      
      {/* Background gradients and decorative elements */}
      <div className="relative font-sans overflow-hidden min-h-screen flex flex-col pt-32 pb-24 bg-gradient-to-b from-[#FFFDFB] via-[#FFF9F5] to-[#FFF6F0]">
        
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f9731605_1px,transparent_1px),linear-gradient(to_bottom,#f9731605_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-[10%] left-[-10%] w-[45vw] h-[45vw] max-w-[500px] rounded-full bg-gradient-to-tr from-orange-400/10 to-red-400/5 blur-[100px] pointer-events-none z-0 animate-[pulse_12s_infinite_alternate]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[35vw] h-[35vw] max-w-[400px] rounded-full bg-gradient-to-br from-red-400/5 to-purple-400/10 blur-[90px] pointer-events-none z-0 animate-[pulse_10s_infinite_alternate]" />

        <main className={`${designSystem.spacing.containerMaxWidth} px-6 md:px-8 relative z-10 flex-grow flex items-center justify-center`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl"
          >
            {/* Header Area */}
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-orange-500/10 text-orange-600 font-bold text-xs tracking-wider uppercase mb-5 shadow-[0_4px_15px_rgba(249,115,22,0.03)]"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Secure Payment Verification</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
                Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Submission</span>
              </h1>

              <h2 className="text-lg md:text-xl font-bold text-orange-500 mb-3">
                Already completed your payment?
              </h2>

              <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                Submit your payment details below. Our team will verify your payment and activate your enrollment as soon as possible.
              </p>
            </div>

            {/* Form Glassmorphic Card Container */}
            <div className="relative bg-white/50 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(249,115,22,0.05),inset_0_1px_2px_rgba(255,255,255,0.7)] border border-white/60 p-6 md:p-12">
              {/* Internal ambient glow */}
              <div className="absolute top-1/2 left-1/2 w-4/5 h-4/5 bg-orange-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10" />

              {/* Form Component */}
              <PaymentSubmissionForm />
            </div>
            
            {/* Quick security notice */}
            <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>We handle payment validation protocols and personal records according to standard student data safety frameworks.</span>
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />
    </>
  );
}
