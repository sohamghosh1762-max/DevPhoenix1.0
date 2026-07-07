"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md overflow-hidden bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_30px_70px_rgba(249,115,22,0.15)] border border-orange-100 flex flex-col items-center text-center z-10"
          >
            {/* Tech grid overlay inside modal for premium design */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f9731604_1px,transparent_1px),linear-gradient(to_bottom,#f9731604_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none -z-10" />

            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-orange-400/10 blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-red-400/10 blur-3xl pointer-events-none -z-10" />

            {/* Checkmark Animation Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 mb-8"
            >
              <Check className="w-9 h-9 stroke-[3]" />
              {/* Outer pulsing ring */}
              <span className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-ping opacity-75" />
            </motion.div>

            {/* Text details */}
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 leading-tight">
              Payment Submitted<br />Successfully
            </h3>
            
            <div className="space-y-3 mb-8 text-sm text-slate-600 font-medium leading-relaxed">
              <p>Thank you for submitting your payment details.</p>
              <p>Our team will verify your payment shortly.</p>
              <p>A confirmation email has been sent to your registered email address.</p>
              <p className="text-slate-800 font-bold">
                You can now join our official WhatsApp Community for updates.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 w-full">
              <Link href="https://chat.whatsapp.com/Gu812Z0hWlD6pinIiL5EI0?mode=gi_t" target="_blank" className="w-full">
                <Button 
                  variant="whatsapp"
                  size="lg" 
                  className="w-full flex items-center justify-center gap-2.5 rounded-full shadow-[0_8px_20px_rgba(34,197,94,0.2)] hover:shadow-[0_12px_25px_rgba(34,197,94,0.3)] transition-all cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>Join WhatsApp Community</span>
                </Button>
              </Link>

              <Link href="/" className="w-full">
                <Button 
                  variant="secondary"
                  size="lg" 
                  className="w-full text-slate-600 border border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-all cursor-pointer"
                >
                  <span>Back to Home</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
