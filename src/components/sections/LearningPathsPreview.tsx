"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SectionWrapper } from "./SectionWrapper";
import { Skeleton } from "@/components/ui/Skeleton";

export function LearningPathsPreview() {
  const [paths, setPaths] = useState<any[]>([]);
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


  const previewPaths = paths.slice(0, 4);

  return (
    <SectionWrapper background="white" className="!pb-12 lg:!pb-16">
      <div className="flex flex-col items-center text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          LEARNING PATHS
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
        >
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Build Path</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 max-w-2xl leading-relaxed"
        >
          Structured learning tracks designed to take you from beginner to builder.
        </motion.p>
      </div>

      <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-6 pb-8 md:pb-0 md:grid-cols-2 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full relative overflow-hidden animate-pulse min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center"
              >
                <Skeleton className="h-6 w-12 rounded-lg mb-4" />
                <Skeleton className="h-40 w-full rounded-2xl mb-6 bg-slate-100" />
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-6" />
                <div className="flex gap-2 mb-6 mt-auto">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))
          : previewPaths.map((path, idx) => (
              <motion.div
                key={path.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)] transition-all duration-300 flex flex-col h-full relative overflow-hidden min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-50/10 transition-colors duration-500" />

                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg">{path.id}</span>
                </div>

                {path.image && (
                  <div className="w-full flex justify-center mb-6 z-10">
                    <div className="relative w-[160px] h-[280px] select-none pointer-events-none drop-shadow-[0_12px_24px_rgba(249,115,22,0.12)] group-hover:drop-shadow-[0_16px_32px_rgba(249,115,22,0.22)] group-hover:scale-[1.03] group-hover:rotate-1 transition-all duration-500">
                      {/* Device Chassis / Bezel */}
                      <div className="absolute inset-0 bg-[#0F172A] rounded-[2.2rem] p-[7px] shadow-2xl ring-1 ring-white/15">
                        {/* Screen Glass */}
                        <div className="relative w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-950 border border-slate-800">
                          {/* Speaker / Dynamic Island */}
                          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#020617] rounded-full z-30 flex items-center justify-between px-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-800" />
                            <span className="w-1 h-1 rounded-full bg-blue-950" />
                          </div>

                          {/* Status Bar */}
                          <div className="absolute top-1.5 left-0 right-0 h-4 px-3.5 flex items-center justify-between text-[7px] font-extrabold text-white/95 z-20 select-none">
                            <span>9:41</span>
                            <div className="flex items-center gap-1.5">
                              {/* Signal Bars */}
                              <div className="flex items-end gap-[1px]">
                                <span className="w-[1.5px] h-1.5 bg-white rounded-[0.5px]" />
                                <span className="w-[1.5px] h-2 bg-white rounded-[0.5px]" />
                                <span className="w-[1.5px] h-2.5 bg-white rounded-[0.5px]" />
                                <span className="w-[1.5px] h-3 bg-white/40 rounded-[0.5px]" />
                              </div>
                              {/* WiFi SVG */}
                              <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21l-12-12c4.4-4.4 11.6-4.4 16 0l-4 4zM12 6c-3.3 0-6.4 1.3-8.7 3.5l8.7 8.7 8.7-8.7c-2.3-2.2-5.4-3.5-8.7-3.5z" />
                              </svg>
                              {/* Battery Body */}
                              <div className="relative w-4 h-2 border border-white/85 rounded-[3px] p-[0.5px] flex items-center bg-transparent">
                                <div className="h-full w-[80%] bg-emerald-500 rounded-[1.5px]" />
                                <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1.5px] h-1 bg-white/80 rounded-r-[0.5px]" />
                              </div>
                            </div>
                          </div>

                          {/* Wallpaper/Display Content */}
                          <div className="w-full h-full relative">
                            <Image 
                              src={path.image} 
                              alt={path.title} 
                              fill 
                              sizes="160px"
                              className="object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            {/* Cinematic Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-transparent to-[#020617]/60" />
                            
                            {/* Simulated App UI/Widget Box */}
                            <div className="absolute bottom-3.5 left-2 right-2 bg-slate-900/85 backdrop-blur-md border border-white/10 p-2 rounded-xl text-left shadow-lg">
                              <p className="text-[7px] font-black text-orange-500 uppercase tracking-widest mb-0.5">DEVPHOENIX APP</p>
                              <p className="text-[9px] font-bold text-white truncate">{path.title}</p>
                            </div>
                          </div>

                          {/* Bottom Gestures Line */}
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-white/70 rounded-full z-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">{path.title}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed relative z-10 line-clamp-3">{path.description}</p>
                
                {Array.isArray(path.tags) && path.tags.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2 relative z-10 mt-auto">
                    {path.tags.slice(0, 3).map((tag: string, i: number) => (
                      <span key={i} className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link href="/learning-paths" className="mt-auto relative z-10">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Explore Path</span>
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {!loading && previewPaths.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                No learning paths available right now. Check back soon!
              </div>
            )}
      </div>

      <div className="mt-12 text-center">
        <Link href="/learning-paths">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full shadow-sm border border-slate-200 hover:border-orange-200 hover:shadow-md transition-all inline-flex items-center gap-2"
          >
            Explore All Learning Paths
            <ArrowRight className="w-5 h-5 text-orange-500" />
          </motion.button>
        </Link>
      </div>
    </SectionWrapper>
  );
}
