export const designSystem = {
  colors: {
    primary: {
      orange: "bg-orange-500",
      red: "bg-red-500",
      amber: "bg-amber-400",
    },
    background: {
      cream: "bg-[#FFF9F5]",
      white: "bg-white",
      dark: "bg-slate-900",
      darker: "bg-[#0B1120]",
    },
    text: {
      slate: "text-slate-600",
      dark: "text-slate-900",
      light: "text-slate-300",
      white: "text-white",
      muted: "text-slate-500",
    },
    border: {
      light: "border-slate-100",
      orange: "border-orange-100",
      dark: "border-slate-800",
    }
  },
  gradients: {
    textOrangeRed: "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500",
    textOrangeAmber: "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300",
    bgOrangeRed: "bg-gradient-to-r from-orange-500 to-red-500",
    bgDark: "bg-gradient-to-r from-slate-900 to-[#0B1120]",
    glowOrange: "bg-orange-500/10",
  },
  shadows: {
    sm: "shadow-sm",
    soft: "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
    hover: "hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)]",
    dark: "shadow-[0_20px_50px_rgba(0,0,0,0.4)]",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]",
  },
  spacing: {
    sectionPadding: "py-20 lg:py-32 px-6 lg:px-8",
    containerMaxWidth: "max-w-7xl mx-auto",
    cardPadding: "p-6 lg:p-10",
  },
  borderRadius: {
    card: "rounded-[2rem]",
    button: "rounded-full",
    tag: "rounded-md",
  },
  typography: {
    hero: "text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]",
    sectionTitle: "text-3xl md:text-5xl font-extrabold tracking-tight leading-tight",
    cardTitle: "text-2xl font-bold leading-snug",
    body: "text-lg text-slate-600 leading-relaxed",
    muted: "text-sm text-slate-500 font-medium",
  },
  motion: {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.5 }
    },
    hoverLift: {
      whileHover: { y: -5, transition: { duration: 0.3 } }
    },
    hoverGlow: {
      whileHover: { boxShadow: "0 20px 40px rgba(249,115,22,0.08)" }
    }
  }
};
