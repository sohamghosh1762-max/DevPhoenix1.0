"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SectionWrapper } from "./SectionWrapper";
import { designSystem } from "@/lib/design-system";
import { ShineBorder } from "@/components/ui/ShineBorder";
import { Timeline, type Event } from "@/components/ui/Timeline";

const FALLBACK_STEPS: Event[] = [
  {
    label: "Explore & Choose",
    message: "Find the right premium or industrial program based on your career goals.",
    icon: {
      name: "Network",
      textColor: "text-orange-500",
      borderColor: "border-orange-200 bg-orange-50",
    },
  },
  {
    label: "Master the Foundations",
    message: "Deep dive into core technologies with interactive, hands-on learning.",
    icon: {
      name: "TerminalSquare",
      textColor: "text-blue-500",
      borderColor: "border-blue-200 bg-blue-50",
    },
  },
  {
    label: "Build Real Systems",
    message: "Execute production-grade projects. No more simple todo apps.",
    icon: {
      name: "Component",
      textColor: "text-purple-500",
      borderColor: "border-purple-200 bg-purple-50",
    },
  },
  {
    label: "Get Mentored",
    message: "Receive code reviews and architectural guidance from top industry experts.",
    icon: {
      name: "CheckCircle",
      textColor: "text-green-500",
      borderColor: "border-green-200 bg-green-50",
    },
  },
  {
    label: "Launch Your Career",
    message: "Earn your verified certification and confidently crush your interviews.",
    icon: {
      name: "Rocket",
      textColor: "text-orange-600",
      borderColor: "border-orange-500/40 bg-orange-100",
    },
  },
];

export function JourneyPreview() {
  const [visualBlocks, setVisualBlocks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/visual-blocks')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setVisualBlocks(d.filter(b => b.section_key === 'journey' && b.visibility));
        }
      })
      .catch(() => {});
  }, []);

  const mascotBlock = visualBlocks.find(b => b.id === 'journey-mascot');
  const stepBlocks = visualBlocks.filter(b => b.id !== 'journey-mascot').sort((a, b) => a.position - b.position);

  // Map theme variants to colors
  const getThemeMap = (variant: string) => {
    if (variant === 'blue') return { textColor: 'text-blue-500', borderColor: 'border-blue-200 bg-blue-50' };
    if (variant === 'purple') return { textColor: 'text-purple-500', borderColor: 'border-purple-200 bg-purple-50' };
    if (variant === 'green') return { textColor: 'text-green-500', borderColor: 'border-green-200 bg-green-50' };
    if (variant === 'orange-bold') return { textColor: 'text-orange-600', borderColor: 'border-orange-500/40 bg-orange-100' };
    return { textColor: 'text-orange-500', borderColor: 'border-orange-200 bg-orange-50' };
  };

  const events: Event[] = stepBlocks.length > 0
    ? stepBlocks.map(b => ({
        label: b.title,
        message: b.description,
        icon: {
          name: b.badge || 'Check',
          ...getThemeMap(b.theme_variant)
        }
      }))
    : FALLBACK_STEPS;

  const mascotImage = mascotBlock?.image_url || "/learning.png";

  return (
    <SectionWrapper background="cream" className="py-16 lg:py-20 relative overflow-hidden max-h-[900px]">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Side: Cinematic Narrative */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center relative">
          <motion.div
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-[10px] tracking-widest uppercase mb-6 shadow-sm w-fit"
          >
            THE DEVPHOENIX ECOSYSTEM
          </motion.div>
          
          <motion.h2 
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-[1.1]"
          >
            Your Journey from <br />
            <span className="text-slate-400">Learner</span> to <span className={designSystem.gradients.textOrangeRed}>Builder</span>
          </motion.h2>

          <motion.p
            initial={designSystem.motion.fadeInUp.initial}
            whileInView={designSystem.motion.fadeInUp.whileInView}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 mb-8 max-w-md"
          >
            We don't just teach syntax. We guide you through the exact pipeline used to build, scale, and deploy real-world products.
          </motion.p>

          <div className="relative h-[300px] w-full max-w-md mt-4 hidden md:block">
            {/* Cinematic background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 to-transparent rounded-[3rem] transform -rotate-6 scale-95 opacity-50 border border-white/50 shadow-inner" />
            <Image
              src={mascotImage}
              alt="Transformation Journey"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain drop-shadow-[0_20px_30px_rgba(249,115,22,0.15)] z-10"
            />
          </div>
        </div>

        {/* Right Side: Timeline inside ShineBorder */}
        <motion.div 
          className="w-full lg:w-1/2 max-w-lg lg:max-w-none ml-auto"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
           <ShineBorder 
             color={["#f97316", "#fb923c", "#fdba74"]} 
             borderWidth={2}
             borderRadius={32}
             className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/60 backdrop-blur-xl border border-white/20 p-8 md:p-10"
           >
              <h3 className="text-xl font-bold text-slate-900 mb-8">The Execution Pipeline</h3>
              <Timeline events={events} />
           </ShineBorder>
        </motion.div>

      </div>
    </SectionWrapper>
  );
}

