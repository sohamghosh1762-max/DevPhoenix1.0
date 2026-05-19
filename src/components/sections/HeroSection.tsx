"use client";

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, Play, Users, Code, BookOpen, Trophy, Star } from "lucide-react";
import Image from "next/image";
import { designSystem } from "@/lib/design-system";
import Link from "next/link";
import { DynamicImage } from "@/components/ui/DynamicImage";

// Default/static fallbacks in case configuration is loading or missing
const FALLBACK = {
  badge: "Welcome to DevPhoenix Ecosystem",
  headline1: "Learn. Grow.",
  headline2: "Succeed.",
  subheadline: "Empowering minds with the skills, knowledge, and confidence to build a better tomorrow.",
  primaryCta: { text: "Explore Programs", href: "/programs" },
  secondaryCta: { text: "How It Works", href: "/learning-paths" },
  mascotImage: "/learning.png",
  glowColor: "orange",
  floatingCard1Title: "Your Journey",
  floatingCard1Status: "In Progress",
  floatingCard2Label: "Next Milestone",
  floatingCard2Content: "Build Your First Project",
  stats: [
    { value: "25,000+", label: "Active Learners" },
    { value: "300+", label: "Expert Courses" },
    { value: "98%", label: "Success Rate" },
    { value: "4.8/5", label: "Learner Rating" }
  ]
};

export function HeroSection() {
  const [config, setConfig] = useState<any>(null);
  const [visualBlocks, setVisualBlocks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/site-config')
      .then(r => r.json())
      .then(d => {
        if (d && d.hero) {
          setConfig(d.hero);
        }
      })
      .catch(() => {});

    fetch('/api/visual-blocks', { cache: 'no-store' })

      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setVisualBlocks(d.filter(b => b.section_key === 'hero' && b.visibility));
        }
      })
      .catch(() => {});
  }, []);

  const hero = config || FALLBACK;
  
  // Resolve dynamic visual blocks overrides
  const mascotBlock = visualBlocks.find(b => b.id === 'hero-mascot');
  const card1Block = visualBlocks.find(b => b.id === 'hero-card-1');
  const card2Block = visualBlocks.find(b => b.id === 'hero-card-2');

  const badge = hero.badge || FALLBACK.badge;
  const headline1 = hero.headline1 || FALLBACK.headline1;
  const headline2 = hero.headline2 || FALLBACK.headline2;
  const subheadline = hero.subheadline || FALLBACK.subheadline;
  const primaryCta = hero.primaryCta || FALLBACK.primaryCta;
  const secondaryCta = hero.secondaryCta || FALLBACK.secondaryCta;
  
  const mascotImage = mascotBlock?.image_url || hero.mascotImage || FALLBACK.mascotImage;
  const glowColor = hero.glowColor || FALLBACK.glowColor;
  
  const card1Title = card1Block?.title || hero.floatingCard1Title || FALLBACK.floatingCard1Title;
  const card1Status = card1Block?.subtitle || hero.floatingCard1Status || FALLBACK.floatingCard1Status;
  
  const card2Label = card2Block?.subtitle || hero.floatingCard2Label || FALLBACK.floatingCard2Label;
  const card2Content = card2Block?.title || hero.floatingCard2Content || FALLBACK.floatingCard2Content;
  
  const stats = Array.isArray(hero.stats) && hero.stats.length > 0 ? hero.stats : FALLBACK.stats;


  return (
    <div className="relative font-sans overflow-hidden min-h-screen flex flex-col justify-center pt-24 bg-[#FFF9F5]">
      <main className={`${designSystem.spacing.containerMaxWidth} px-8 pb-24 relative`}>
        {/* Background Decorative Elements */}
        <div className={`absolute top-1/2 right-1/4 w-[800px] h-[800px] ${glowColor === 'orange' ? 'bg-orange-200/40' : 'bg-blue-200/30'} rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none z-0`} />

        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={designSystem.motion.fadeInUp.initial}
            animate={designSystem.motion.fadeInUp.whileInView}
            transition={designSystem.motion.fadeInUp.transition as any}
            className="flex flex-col items-start"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-orange-100 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">{badge}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-slate-900">
              {headline1}<br />
              <span className={designSystem.gradients.textOrangeRed}>
                {headline2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-md leading-relaxed">
              {subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href={primaryCta.href || '/programs'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-2 group"
                >
                  {primaryCta.text || 'Explore Programs'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <Link href={secondaryCta.href || '/learning-paths'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-slate-700 font-medium rounded-full shadow-sm border border-slate-100 flex items-center gap-3 hover:shadow-md transition-shadow"
                >
                  {secondaryCta.text || 'How It Works'}
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                </motion.button>
              </Link>
            </div>

            {/* Feature Badges Row */}
            <div className="flex items-center gap-6 mt-16 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Expert Instructors</p>
                  <p className="text-slate-500 text-xs">Learn from industry experts</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Hands-on Learning</p>
                  <p className="text-slate-500 text-xs">Practice with real projects</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Mascot/Visuals */}
          <div className="relative h-[600px] w-full flex justify-center items-center">
            {/* Soft Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-100/50 to-transparent rounded-full blur-2xl transform scale-90 -z-10" />

            {/* Circular Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute bottom-10 w-[80%] h-8 border-2 border-orange-200 rounded-[100%] shadow-[0_0_40px_rgba(249,115,22,0.1)] -z-10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
              className="absolute bottom-12 w-[60%] h-6 border border-orange-300 rounded-[100%] -z-10"
            />

            {/* Mascot Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 w-full h-full flex items-end justify-center pb-12"
            >
              <motion.div 
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-80 h-[450px]"
              >
                <DynamicImage 
                  src={mascotImage} 
                  alt="DevPhoeniX Student Builder" 
                  fill
                  priority
                  className="object-contain drop-shadow-[0_30px_50px_rgba(249,115,22,0.3)]"
                  category="mascot"
                />
              </motion.div>
            </motion.div>

            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-0 md:-right-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col gap-2 z-20"
            >
              <p className="text-sm font-semibold text-slate-800">{card1Title}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-orange-500 font-medium">{card1Status}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
              <svg className="w-24 h-8 mt-1" viewBox="0 0 100 30" fill="none">
                <path d="M0 20 Q 20 10, 40 25 T 80 10" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="80" cy="10" r="3" fill="#f97316" />
              </svg>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 left-0 md:-left-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center gap-3 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{card2Label}</p>
                <p className="text-sm font-semibold text-slate-800" dangerouslySetInnerHTML={{ __html: card2Content.replace('\n', '<br />') }} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50 p-8 relative z-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-slate-100">
            {stats.slice(0, 4).map((stat: any, i: number) => {
              // Dynamically resolve matching Icon
              const getIcon = (idx: number) => {
                if (idx === 0) return <Users className="w-6 h-6" />;
                if (idx === 1) return <BookOpen className="w-6 h-6" />;
                if (idx === 2) return <Trophy className="w-6 h-6" />;
                return <Star className="w-6 h-6" />;
              };

              return (
                <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                  <div className="flex items-center gap-3 mb-2 text-orange-500">
                    {getIcon(i)}
                    <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
