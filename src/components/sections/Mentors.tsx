"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from './SectionWrapper';
import { designSystem } from '@/lib/design-system';

const companies = [
  {
    name: "Microsoft",
    tagline: "Cloud & Product Engineering",
    logoSvg: (
      <svg className="w-8 h-8 group-hover:drop-shadow-[0_0_8px_rgba(242,80,34,0.6)] transition-all duration-300" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="10.5" height="10.5" fill="#F25022"/>
        <rect x="12.5" width="10.5" height="10.5" fill="#7FBA00"/>
        <rect y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
        <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
      </svg>
    )
  },
  {
    name: "IBM",
    tagline: "Enterprise Systems & Hybrid Cloud",
    logoSvg: (
      <svg className="w-12 h-6 group-hover:drop-shadow-[0_0_8px_rgba(15,98,254,0.6)] transition-all duration-300 fill-[#0F62FE]" viewBox="0 0 24 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h3v1.2H0zm4.5 0h3v1.2h-3zm4.5 0h7v1.2H9zM0 1.8h3v1.2H0zm4.5 0h3v1.2h-3zm4.5 0h7v1.2H9zM0 3.6h3v1.2H0zm4.5 0h3v1.2h-3zm4.5 0h7v1.2H9zM0 5.4h3V6.6H0zm4.5 0h3v1.2h-3zm4.5 0h7v1.2H9zM0 7.2h3v1.2H0zm4.5 0h3v1.2h-3zm4.5 0h7v1.2H9zm-9 1.8h3v1.2H0zm4.5 0h3v1.2h-3zm4.5 0h7v1.2H9zm-9 1.8h3v1.2H0zm4.5 0h3v1.2h-3zm4.5 0h7v1.2H9z" />
      </svg>
    )
  },
  {
    name: "Accenture",
    tagline: "Global Technology & Strategy",
    logoSvg: (
      <svg className="w-8 h-8 group-hover:drop-shadow-[0_0_8px_rgba(161,0,255,0.6)] transition-all duration-300 fill-[#A100FF]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.2 2h3.6l9.7 10-9.7 10H2.2l7.7-10z" />
      </svg>
    )
  },
  {
    name: "Wipro",
    tagline: "Engineering & Digital Transformation",
    logoSvg: (
      <svg className="w-9 h-9 group-hover:drop-shadow-[0_0_8px_rgba(255,90,31,0.6)] transition-all duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#3F51B5" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="6" stroke="#E91E63" strokeWidth="1" />
        <circle cx="12" cy="12" r="3" fill="#ff5a1f" />
        <circle cx="12" cy="4.5" r="1" fill="#4CAF50" />
        <circle cx="12" cy="19.5" r="1" fill="#FFEB3B" />
        <circle cx="4.5" cy="12" r="1" fill="#E91E63" />
        <circle cx="19.5" cy="12" r="1" fill="#00BCD4" />
      </svg>
    )
  },
  {
    name: "Infosys",
    tagline: "Technology Innovation Leader",
    logoSvg: (
      <svg className="w-9 h-9 group-hover:drop-shadow-[0_0_8px_rgba(0,124,195,0.6)] transition-all duration-300 fill-[#007cc3]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2h20v20H2V2zm2 2v16h16V4H4zm4 4h8v8H8V8zm2 2v4h4v-4h-4z" />
      </svg>
    )
  },
  {
    name: "Cognizant",
    tagline: "Enterprise Technology Solutions",
    logoSvg: (
      <svg className="w-9 h-9 group-hover:drop-shadow-[0_0_8px_rgba(0,51,160,0.6)] transition-all duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="#0033A0" strokeWidth="2" />
        <circle cx="12" cy="12" r="5" stroke="#0033A0" strokeWidth="2" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#0033A0" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Capgemini",
    tagline: "Consulting & Technology Services",
    logoSvg: (
      <svg className="w-9 h-9 group-hover:drop-shadow-[0_0_8px_rgba(0,112,173,0.6)] transition-all duration-300 fill-[#0070ad]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    )
  },
  {
    name: "Sentinent Geeks",
    tagline: "Software & Web Engineering",
    logoSvg: (
      <svg className="w-8 h-8 group-hover:drop-shadow-[0_0_8px_rgba(255,90,31,0.6)] transition-all duration-300 fill-[#ff5a1f]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22h20L12 2zm0 5l6 12H6l6-12z" />
      </svg>
    )
  },
  {
    name: "Code Cloud",
    tagline: "Cloud Infrastructure & DevOps",
    logoSvg: (
      <svg className="w-9 h-9 group-hover:drop-shadow-[0_0_8px_rgba(0,176,255,0.6)] transition-all duration-300 fill-[#00B0FF]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
    )
  }
];

export const Mentors = () => {
  return (
    <SectionWrapper background="white" className="!pt-16 lg:!pt-24 !pb-20 lg:!pb-24 relative overflow-hidden" overflowHidden={true}>
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(249, 115, 22, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(249, 115, 22, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            animation: "gridMove 25s linear infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>

      {/* Header section */}
      <div className="flex flex-col items-center mb-16 text-center max-w-4xl mx-auto relative z-10 px-4">
        <motion.div
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
        >
          ⭐ INDUSTRY EXPERTS
        </motion.div>
        
        <motion.h2
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 mb-6"
        >
          Learn From <span className={designSystem.gradients.textOrangeRed}>Industry Leaders</span>
        </motion.h2>
        
        <motion.p
          initial={designSystem.motion.fadeInUp.initial}
          whileInView={designSystem.motion.fadeInUp.whileInView}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-slate-500 leading-relaxed max-w-3xl"
        >
          Get mentored by professionals associated with leading global technology companies. Gain real-world insights, hands-on project experience, and industry-ready skills from experts who build products and solutions used by millions worldwide.
        </motion.p>
      </div>

      {/* Label section */}
      <div className="text-center mb-10 relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-xs font-bold uppercase tracking-widest text-slate-400"
        >
          OUR INDUSTRY MENTORS COME FROM
        </motion.p>
      </div>

      {/* Grid of Company Glassmorphism Cards */}
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
              className="bg-white border border-slate-100 hover:border-orange-200 rounded-2xl p-6 relative overflow-hidden flex items-center gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_15px_45px_rgba(249,115,22,0.08)] group cursor-pointer"
            >
              {/* Subtle backglow gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Logo container */}
              <div className="w-14 h-14 rounded-xl bg-orange-50/40 border border-orange-100/30 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-orange-50/80 group-hover:border-orange-200 transition-all duration-300">
                {company.logoSvg}
              </div>

              {/* Text content */}
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors duration-300">
                  {company.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  {company.tagline}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Footer Banner */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-20 p-8 lg:p-12 bg-gradient-to-r from-orange-500/5 to-red-500/5 border border-orange-100 rounded-[2rem] text-center max-w-4xl mx-auto relative overflow-hidden z-10 shadow-[0_15px_45px_rgba(249,115,22,0.03)]"
      >
        {/* Radial background blur/glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-4 tracking-tight">
          Learn. Build. Grow. Succeed.
        </h3>
        
        <p className="text-slate-600 max-w-2xl mx-auto mb-6 text-sm md:text-base leading-relaxed">
          Gain industry-ready skills, mentorship, career guidance, internship support, and networking opportunities from professionals associated with world-class organizations.
        </p>
        
        <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-orange-500 border-t border-orange-100 pt-4 inline-block">
          Your Journey. Guided By The Best.
        </div>
      </motion.div>

    </SectionWrapper>
  );
};
