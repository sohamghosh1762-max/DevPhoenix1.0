"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, Award, FileText, CheckCircle, 
  XCircle, Clock, Calendar, Globe, QrCode, Search, PhoneCall, Eye 
} from 'lucide-react';
import { showToast } from '@/components/ui/PremiumToast';

interface VerificationResult {
  id: string;
  studentProfileId: string;
  studentName: string;
  verificationId: string;
  email: string;
  phone: string | null;
  course: string;
  courseCode: string;
  documentType: string;
  issueDate: string;
  startDate: string | null;
  endDate: string | null;
  duration: string;
  status: 'Valid' | 'Revoked' | 'Expired';
  generatedBy: string;
  pdfUrl: string | null;
  createdAt: string;
}

export default function PublicVerifyPage() {
  return (
    <div className="min-h-screen bg-[#060814] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none selection:bg-orange-500/20 selection:text-orange-400">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6366F1]/10 blur-[130px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Loading Portal...</p>
          </div>
        }>
          <VerifyPortalContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 relative z-10 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-[#060814]/80 backdrop-blur-md">
        &copy; {new Date().getFullYear()} DevPhoenix Technologies LLP. All credentials cryptographically signed.
      </footer>

    </div>
  );
}

// ─── Child Content Component supporting URL parameters ───────────────────────

function VerifyPortalContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorState, setErrorState] = useState(false);

  // Auto-populate when Verification ID is present in URL query
  useEffect(() => {
    if (idParam) {
      const decoded = decodeURIComponent(idParam).trim();
      setInputVal(decoded);
      triggerVerification(decoded);
    }
  }, [idParam]);

  const triggerVerification = async (verificationId: string) => {
    if (!verificationId.trim()) return;

    setLoading(true);
    setSearched(true);
    setErrorState(false);
    setResult(null);

    try {
      const res = await fetch(`/api/verification/${encodeURIComponent(verificationId.trim())}`, {
        cache: 'no-store'
      });
      const json = await res.json();
      
      if (res.ok && json.success && json.data) {
        setResult(json.data);
      } else {
        setErrorState(true);
        showToast(json.error?.message || 'Document verification index not found.', 'error');
      }
    } catch (err) {
      console.error(err);
      setErrorState(true);
      showToast('Connection to registry failed. Check your internet connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) {
      showToast('Please enter a valid Verification ID', 'error');
      return;
    }
    triggerVerification(inputVal);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      
      {/* Brand Header Logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-[#FF5A1F] flex items-center justify-center shadow-lg shadow-orange-500/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="text-left leading-none">
          <span className="text-sm font-black tracking-widest text-white block uppercase">DEVPHOENIX</span>
          <span className="text-[9px] font-black text-orange-500 tracking-widest uppercase mt-0.5 block">ACADEMY</span>
        </div>
      </div>

      <div className="text-center max-w-lg mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
          Document Verification Registry
        </h1>
        <p className="text-xs text-slate-400 font-semibold mt-2 leading-relaxed">
          Verify the authenticity of Offer Letters, Training Certificates, Internship Certificates, Experience Letters, and Completion Certificates issued by DevPhoenix Technologies LLP.
        </p>
      </div>

      {/* Verification Query Box */}
      <div className="w-full bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
            <input
              type="text"
              placeholder="Enter Verification ID (e.g. DPA-TTP-AIPE-2026-001)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 transition-all font-mono font-bold tracking-wide uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-[#FF5A1F] hover:from-orange-600 hover:to-[#E04D15] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Verify Document
              </>
            )}
          </button>
        </form>

        {/* Verification Result Area */}
        <AnimatePresence mode="wait">
          
          {/* A. Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="py-12 flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] rounded-2xl"
            >
              <div className="w-10 h-10 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Validating Cryptographic Signatures...</p>
            </motion.div>
          )}

          {/* B. Success State */}
          {!loading && searched && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="text-left border border-green-500/20 bg-green-500/[0.02] rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden"
            >
              {/* Top Banner verified badge */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest block leading-none">Status: {result.status}</span>
                    <h2 className="text-base font-black text-white uppercase mt-1.5 leading-none">Credential Verified</h2>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-wider border border-green-500/20 self-start sm:self-auto">
                  <CheckCircle className="w-3.5 h-3.5" /> Dynamic Check Valid
                </span>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Candidate Name</span>
                  <span className="text-white font-extrabold text-sm">{result.studentName}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Verification ID</span>
                  <span className="font-mono text-orange-400 font-bold">{result.verificationId}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Enrolled Program</span>
                  <span className="text-white font-extrabold">{result.course}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Course Code</span>
                  <span className="font-mono text-slate-300 font-bold uppercase">{result.courseCode}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Document Type</span>
                  <span className="text-white font-extrabold flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                    {result.documentType}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Training Tenure / Duration</span>
                  <span className="text-white font-extrabold">{result.duration}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Date of Issue</span>
                  <span className="text-white font-extrabold">
                    {new Date(result.issueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Student Database Code</span>
                  <span className="font-mono text-slate-400">{result.studentProfileId.slice(0, 8).toUpperCase()}-XXXX</span>
                </div>
              </div>

              {/* Sub-verifications check indicators */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Digital Signature Verified
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Official Seal Confirmed
                </div>
                <div className="flex items-center gap-2 text-green-400 col-span-2 sm:col-span-1">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" /> QR Record Verified
                </div>
                <div className="flex items-center gap-2 text-green-400 col-span-2 sm:col-span-1">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Issued By DevPhoenix Technologies
                </div>
              </div>

              {/* Action buttons (View Offer Letter) */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-white/5">
                <a
                  href={`/api/verification/pdf/${result.verificationId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow px-4 py-3 bg-gradient-to-r from-orange-500 to-[#FF5A1F] hover:from-orange-600 hover:to-[#E04D15] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> View Industrial Offer Letter
                </a>
              </div>
            </motion.div>
          )}

          {/* C. Failure State */}
          {!loading && searched && errorState && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="text-center border border-red-500/20 bg-red-500/[0.02] rounded-2xl p-6 md:p-8 space-y-4"
            >
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/25 rounded-full flex items-center justify-center mx-auto text-red-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Invalid Verification ID</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-sm mx-auto">
                  The Verification ID entered does not exist or has been deleted from our cryptographic registry database.
                </p>
              </div>

              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-[10px] font-black uppercase tracking-wider text-slate-500 leading-relaxed text-left max-w-md mx-auto space-y-1.5">
                <p className="text-red-400 font-extrabold flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> This document cannot be verified.
                </p>
                <p>
                  Please check the formatting of the verification code. If you believe this is a technical error, please contact the Verification Board at DevPhoenix Technologies LLP.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="mailto:support@devphoenix.com"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-400 hover:text-orange-500 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" /> Contact DevPhoenix Board
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
