"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Target, BookOpen, Code2, Users, Briefcase, Bot, Settings, Zap, Layers, PieChart, Cloud, PlayCircle, Rocket } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { SectionWrapper } from "@/components/sections/SectionWrapper";
import { PremiumEmptyState } from "@/components/ui/PremiumEmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { LearningPath, LearningPathBuildItem } from "@/types";
import { designSystem } from "@/lib/design-system";


// Map static lucide icons for custom build indicators
const ICON_MAP: Record<string, React.ReactNode> = {
  'Bot': <Bot className="w-4 h-4" />,
  'Settings': <Settings className="w-4 h-4" />,
  'Zap': <Zap className="w-4 h-4" />,
  'Layers': <Layers className="w-4 h-4" />,
  'Code': <Code2 className="w-4 h-4" />,
  'PieChart': <PieChart className="w-4 h-4" />,
  'Cloud': <Cloud className="w-4 h-4" />,
  'PlayCircle': <PlayCircle className="w-4 h-4" />,
  'Rocket': <Rocket className="w-4 h-4" />,
  'Users': <Users className="w-4 h-4" />
};

export default function LearningPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/learning-paths', { cache: 'no-store' })
      .then(res => res.json())
      .then(d => {
        const list = d && d.success && Array.isArray(d.data) ? d.data : (Array.isArray(d) ? d : []);
        setPaths(list);
        setLoading(false);
      })
      .catch(() => {
        setPaths([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-24">
        
        {/* Page Hero */}
        <SectionWrapper background="cream" className="pb-16 pt-16">
          <div className="flex flex-col items-center text-center mb-8 relative">
            <motion.h1
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
            >
              Master Your <span className={designSystem.gradients.textOrangeRed}>Build Path</span>
            </motion.h1>
            <motion.p
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed"
            >
              Structured learning journeys to transform you from a beginner to an industry-ready builder.
            </motion.p>
          </div>
        </SectionWrapper>

        {/* Detailed Learning Paths */}
        <SectionWrapper background="white" className="py-24">
          <div className="flex flex-col gap-16">
            {loading ? (
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-[0_10px_40px_rgb(0,0,0,0.03)] flex flex-col lg:flex-row gap-12 animate-pulse w-full"
                >
                  <div className="lg:w-1/3 flex flex-col gap-4">
                    <Skeleton className="h-6 w-20 rounded-lg bg-slate-200" />
                    <Skeleton className="h-10 w-3/4 rounded-xl bg-slate-200" />
                    <Skeleton className="h-4 w-full bg-slate-200" />
                    <Skeleton className="h-4 w-5/6 mb-4 bg-slate-200" />
                    <div className="relative w-full aspect-[4/3] rounded-2xl border border-orange-100 overflow-hidden bg-slate-100/50" />
                  </div>
                  <div className="lg:w-2/3 flex flex-col gap-8 lg:border-l border-slate-100 lg:pl-12 justify-center">
                    <div>
                      <Skeleton className="h-4 w-48 mb-4 bg-slate-200" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <Skeleton key={idx} className="h-12 w-full rounded-xl bg-slate-200" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-4 w-48 mb-4 bg-slate-200" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <Skeleton key={idx} className="h-16 w-full rounded-xl bg-slate-200" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : paths.length === 0 ? (
              <PremiumEmptyState
                title="No Learning Paths Available"
                description="We are currently laying out custom skill maps and paths. Join the builder community to suggest a curriculum!"
              />
            ) : (
              paths.map((path, idx) => (
                <motion.div
                  key={path.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-[0_10px_40px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.08)] transition-all duration-500 relative overflow-hidden group flex flex-col lg:flex-row gap-12"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="lg:w-1/3 flex flex-col z-10">
                     <span className="text-sm font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg w-max mb-4">Path {path.id}</span>
                     <h3 className="text-3xl font-extrabold text-slate-900 mb-4">{path.title}</h3>
                     <p className="text-slate-600 text-base leading-relaxed mb-8">{path.description}</p>
                     
                     {path.image && (
                        <>
                          {/* Mobile View: Phone Mockup */}
                          <div className="w-full lg:hidden flex justify-center mt-2 mb-6 z-10">
                            <div className="relative w-[180px] h-[315px] sm:w-[210px] sm:h-[368px] md:w-[220px] md:h-[385px] select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(249,115,22,0.12)] hover:drop-shadow-[0_16px_32px_rgba(249,115,22,0.22)] transition-all duration-500">
                              {/* Device Chassis / Bezel */}
                              <div className="absolute inset-0 bg-[#0F172A] rounded-[2.2rem] p-[8px] shadow-2xl ring-1 ring-white/15">
                                {/* Screen Glass */}
                                <div className="relative w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-950 border border-slate-800">
                                  {/* Speaker / Dynamic Island */}
                                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#020617] rounded-full z-30 flex items-center justify-between px-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-800" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-950" />
                                  </div>

                                  {/* Status Bar */}
                                  <div className="absolute top-1 left-0 right-0 h-5 px-1.5 z-20 select-none">
                                    <svg className="w-full h-full text-white/95 fill-current" viewBox="0 0 150 20">
                                      <text x="12" y="13" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif" fontSize="8.5" fontWeight="800" fill="currentColor">9:41</text>
                                      
                                      <rect x="106" y="10" width="1.5" height="3" rx="0.5" fill="currentColor" />
                                      <rect x="109" y="8" width="1.5" height="5" rx="0.5" fill="currentColor" />
                                      <rect x="112" y="6" width="1.5" height="7" rx="0.5" fill="currentColor" />
                                      <rect x="115" y="4" width="1.5" height="9" rx="0.5" fill="currentColor" opacity="0.4" />
                                      
                                      <path d="M122 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm-2.5-2.5a4.5 4.5 0 0 1 7 0M117 8a8 8 0 0 1 12 0" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                      
                                      <rect x="133" y="6" width="12" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
                                      <rect x="134.5" y="7.5" width="7" height="3.5" rx="0.5" fill="#10b981" />
                                      <path d="M146 7.5v3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                                    </svg>
                                  </div>

                                  {/* Wallpaper/Display Content */}
                                  <div className="w-full h-full relative">
                                    <Image 
                                      src={path.image} 
                                      alt={path.title} 
                                      fill 
                                      sizes="(max-width: 640px) 180px, (max-width: 768px) 210px, 220px"
                                      className="object-cover transition-transform duration-700" 
                                    />
                                    {/* Cinematic Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-transparent to-[#020617]/60" />
                                    
                                    {/* Simulated App UI/Widget Box */}
                                    <div className="absolute bottom-4 left-2.5 right-2.5 bg-slate-900/85 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-left shadow-lg">
                                      <p className="text-[7.5px] font-black text-orange-500 uppercase tracking-widest mb-0.5">DEVPHOENIX APP</p>
                                      <p className="text-[9.5px] font-bold text-white truncate">{path.title}</p>
                                    </div>
                                  </div>

                                  {/* Bottom Gestures Line */}
                                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-[3px] bg-white/70 rounded-full z-20" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Desktop View: Normal Desktop Size Rectangle filled image */}
                          <div className="hidden lg:block w-full aspect-[16/10] rounded-2xl relative overflow-hidden mt-2 mb-6 border border-slate-100 bg-slate-50 z-10 shadow-sm hover:shadow-md transition-all duration-500">
                            <Image 
                              src={path.image} 
                              alt={path.title} 
                              fill 
                              sizes="(min-width: 1024px) 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                          </div>
                        </>
                      )}
                  </div>

                  <div className="lg:w-2/3 flex flex-col z-10 gap-8 lg:border-l border-slate-100 lg:pl-12">
                     
                     {Array.isArray(path.included) && path.included.length > 0 && (
                       <div>
                         <p className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Included Core Programs</p>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {path.included.map((item: string, i: number) => (
                             <div key={i} className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                               <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                               <span className="text-sm font-semibold text-slate-700">{item}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     {Array.isArray(path.build) && path.build.length > 0 && (
                       <div>
                         <p className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">What You&apos;ll Build & Ship</p>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {path.build.map((item: LearningPathBuildItem, i: number) => (
                             <div key={i} className="flex items-center gap-4 bg-white border border-orange-100 shadow-sm rounded-xl p-4 group-hover:border-orange-200 transition-colors">
                               <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner shrink-0">
                                 {ICON_MAP[item.icon as keyof typeof ICON_MAP] || <Code2 className="w-4 h-4" />}
                               </div>
                               <span className="text-sm font-bold text-slate-800">{item.text}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     {Array.isArray(path.tags) && path.tags.length > 0 && (
                       <div className="mt-auto pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                         {path.tags.map((tag: string, i: number) => (
                           <span key={i} className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-3 py-1.5 rounded-md tracking-wider">
                             {tag}
                           </span>
                         ))}
                       </div>
                     )}

                  </div>
                </motion.div>
              ))
            )}
          </div>
        </SectionWrapper>

        {/* Learning Process / Transformation */}
        <SectionWrapper background="cream" className="py-24 border-t border-slate-200">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">The Builder&apos;s Journey</h2>
            <p className="text-lg text-slate-600">A proven path from foundational knowledge to industry readiness.</p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4 relative">
             {/* Desktop connecting line */}
             <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 rounded-full" />
             
             {[
               { icon: <Target className="w-6 h-6"/>, title: "Foundation", desc: "Build strong fundamentals" },
               { icon: <BookOpen className="w-6 h-6"/>, title: "Skill Building", desc: "Learn by doing with hands-on projects" },
               { icon: <Code2 className="w-6 h-6"/>, title: "Real Projects", desc: "Build real-world industry systems" },
               { icon: <Briefcase className="w-6 h-6"/>, title: "Portfolio", desc: "Create a portfolio that gets you hired" },
               { icon: <Users className="w-6 h-6"/>, title: "Career Launch", desc: "Get placed or build your startup" },
             ].map((step, idx) => (
               <div key={idx} className="flex flex-col items-center text-center relative z-10 group">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-md border-4 border-orange-100 mb-4 group-hover:scale-110 group-hover:border-orange-300 transition-all duration-300 relative">
                     {/* Step number badge */}
                     <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm">
                       {idx + 1}
                     </div>
                     {step.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-500 px-4">{step.desc}</p>
               </div>
             ))}
          </div>
        </SectionWrapper>
      </div>
      <Footer />
    </>
  );
}
