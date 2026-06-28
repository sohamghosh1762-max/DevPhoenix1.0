"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Download, Eye, X, CheckCircle2, ArrowRight, ExternalLink, FileText } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";
import { designSystem } from "@/lib/design-system";

export function CatalogSection() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Brochure features list
  const catalogFeatures = [
    "Comprehensive Course Curriculums",
    "Real-World Industry Projects",
    "Step-by-Step Learning Roadmaps",
    "Globally Recognized Certifications",
    "Premium Pricing & Special Offers",
    "FAQ & Careers Placement Guide"
  ];

  return (
    <>
      <SectionWrapper background="white" className="!py-16 md:!py-24 relative overflow-hidden border-b border-slate-100">
        {/* Subtle orange accent backgrounds */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-100/40 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-tl from-orange-50/30 via-red-50/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Side: Content */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              {/* Animated Icon Badge */}
              <motion.div
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-bold text-xs tracking-widest uppercase mb-6 shadow-sm"
              >
                <BookOpen className="w-4 h-4 animate-pulse text-orange-500" />
                Explore Our Training Catalog
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight"
              >
                Discover the Journey to <br />
                <span className={designSystem.gradients.textOrangeRed}>Becoming a Professional Developer</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed max-w-xl"
              >
                Everything you need to know about DEVPHOENIX Academy in one comprehensive brochure. Explore our curriculums, learning tracks, project work, and pricing details.
              </motion.p>

              {/* Mobile Mockup (shown between description and features on mobile) */}
              <div className="block lg:hidden my-8 flex justify-center w-full">
                <CatalogMockup onClick={() => setIsViewerOpen(true)} />
              </div>

              {/* Catalog Contents Checklist */}
              <motion.div
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="grid sm:grid-cols-2 gap-4 mb-10 max-w-2xl"
              >
                {catalogFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </motion.div>

              {/* Buttons & Subtext Container */}
              <motion.div
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4"
              >
                {/* View Catalog - Glassmorphism Button */}
                <button
                  onClick={() => setIsViewerOpen(true)}
                  className="px-8 py-4 bg-white/80 hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <Eye className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
                  View Catalog Online
                </button>

                {/* Download PDF - Phoenix Orange filled button */}
                <a
                  href="/catalog brochure.pdf"
                  download="DEVPHOENIX_Catalog_Brochure_2026.pdf"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.2)] hover:shadow-[0_15px_35px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <Download className="w-5 h-5 text-white group-hover:-translate-y-0.5 group-hover:translate-y-0.5 transition-transform" />
                  Download Catalog PDF
                </a>
              </motion.div>

              {/* Document metadata subtext */}
              <motion.div
                initial={designSystem.motion.fadeInUp.initial}
                whileInView={designSystem.motion.fadeInUp.whileInView}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-slate-500 text-xs font-semibold pl-1"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>2026 Industrial Training Programs Brochure • PDF (20.3 MB)</span>
              </motion.div>
            </div>

            {/* Right Side: Mockup (Desktop only) */}
            <div className="hidden lg:col-span-5 lg:flex justify-center items-center relative">
              <CatalogMockup onClick={() => setIsViewerOpen(true)} />
            </div>

          </div>
        </div>
      </SectionWrapper>

      {/* Fullscreen PDF Viewer Modal */}
      <AnimatePresence>
        {isViewerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex flex-col bg-slate-950/95 backdrop-blur-md p-4 sm:p-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full mb-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg">
                    DEVPHOENIX Training Catalog 2026
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                    Industrial Training Programs Brochure
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="/catalog brochure.pdf"
                  download="DEVPHOENIX_Catalog_Brochure_2026.pdf"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <button
                  onClick={() => setIsViewerOpen(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                  aria-label="Close PDF Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - PDF embed with mobile fallbacks */}
            <div className="flex-1 max-w-7xl mx-auto w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col relative">
              {/* Mobile and direct access alert overlay (shown prominently on small screen / mobile layout) */}
              <div className="sm:hidden flex flex-col items-center justify-center text-center p-6 bg-slate-900 text-white flex-1">
                <FileText className="w-16 h-16 text-orange-500 mb-4 animate-bounce" />
                <h4 className="text-lg font-bold mb-2">View Catalog on Mobile</h4>
                <p className="text-slate-400 text-sm mb-6 max-w-xs">
                  For the best reading experience, open the catalog directly in a new browser tab or download it to your device.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <a
                    href="/catalog brochure.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in New Tab
                  </a>
                  <a
                    href="/catalog brochure.pdf"
                    download="DEVPHOENIX_Catalog_Brochure_2026.pdf"
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </a>
                </div>
              </div>

              {/* Standard PDF Embed for desktop/tablet screens */}
              <div className="hidden sm:block w-full h-full flex-1">
                <iframe
                  src="/catalog brochure.pdf#toolbar=1"
                  className="w-full h-full border-none"
                  title="DEVPHOENIX Catalog Viewer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// 3D book cover mockup component
interface CatalogMockupProps {
  onClick: () => void;
}

function CatalogMockup({ onClick }: CatalogMockupProps) {
  return (
    <div className="relative group flex-shrink-0" onClick={onClick}>
      {/* Orange ambient glow behind the brochure */}
      <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-[2.5rem] blur-3xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
      
      {/* 3D Mockup Container */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        whileHover={{
          rotateY: -12,
          rotateX: 6,
          scale: 1.03,
          boxShadow: "0 30px 60px -15px rgba(249,115,22,0.25)"
        }}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        className="relative w-[280px] h-[380px] sm:w-[320px] sm:h-[440px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-slate-900 border border-slate-200/50 transition-all duration-300 cursor-pointer"
      >
        {/* Book spine shading / lighting overlay */}
        <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-r from-black/40 via-white/5 to-transparent z-20 pointer-events-none" />
        
        {/* Stacked book page edges simulation (right and bottom stack look) */}
        <div className="absolute right-0 top-0 w-1.5 h-full bg-slate-100/90 z-10 border-l border-slate-200 pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-100/90 z-10 border-t border-slate-200 pointer-events-none" />

        {/* Cover image rendered directly */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/catalog-cover.png" 
            alt="DEVPHOENIX Catalog 2026 Cover" 
            className="w-full h-full object-cover select-none"
            draggable="false"
          />
        </div>
        
        {/* Premium overlay gloss sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 mix-blend-overlay z-10 pointer-events-none" />
      </motion.div>
    </div>
  );
}
