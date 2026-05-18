"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Code2, BookOpen } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { Program } from "@/types";

interface ProgramCurriculumProps {
  program: Program;
}

export function ProgramCurriculum({ program }: ProgramCurriculumProps) {
  const [openModule, setOpenModule] = useState<number | null>(0);

  // Fallback if curriculum doesn't exist
  const curriculum = program.curriculum && program.curriculum.length > 0 
    ? program.curriculum 
    : [
        {
          title: "Foundation & Core Concepts",
          duration: "Weeks 1-2",
          lessons: ["System Architecture Setup", "Core Language Fundamentals", "Version Control & Collaboration"],
        },
        {
          title: "Building the Engine",
          duration: "Weeks 3-5",
          lessons: ["Database Schema Design", "API Development & Routing", "Authentication & Security"],
        },
        {
          title: "Production & Scale",
          duration: "Weeks 6-8",
          lessons: ["Performance Optimization", "CI/CD Pipelines", "Cloud Deployment Strategy"],
        }
      ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Master the Curriculum</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A step-by-step roadmap designed by industry experts to take you from beginner to production-ready developer.
          </p>
        </div>

        <div className="space-y-4">
          {curriculum.map((mod, idx) => (
            <motion.div 
              key={idx}
              initial={designSystem.motion.fadeInUp.initial}
              whileInView={designSystem.motion.fadeInUp.whileInView}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`border rounded-2xl overflow-hidden transition-colors ${
                openModule === idx ? 'border-orange-500 bg-white shadow-lg shadow-orange-500/5' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button 
                onClick={() => setOpenModule(openModule === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between focus:outline-none"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    openModule === idx ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{mod.title}</h3>
                    <p className="text-sm font-semibold text-slate-500 flex items-center gap-1 mt-1">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {/* Support both 'week' (from JSON) and 'duration' (from Supabase) */}
                      {mod.week || mod.duration || `Module ${idx + 1}`}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openModule === idx ? 'rotate-180 text-orange-500' : ''}`} />
              </button>

              <AnimatePresence>
                {openModule === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100/50">
                      <ul className="space-y-3 mt-4">
                      {/* Support topics[] from JSON and lessons[] from Supabase */}
                      {(mod.topics || mod.lessons || []).map((item, lIdx) => (
                          <li key={lIdx} className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                            <span className="text-slate-600 font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                      {mod.tools && mod.tools.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Code2 className="w-4 h-4" /> Tools Learned
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {mod.tools.map(tool => (
                              <span key={tool} className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-semibold text-slate-600">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
