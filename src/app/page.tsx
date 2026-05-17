"use client";

import { motion } from "framer-motion";
import { Search, ChevronRight, Play, Users, BookOpen, Trophy, Star, Code, ArrowRight, Bot, Laptop, Settings, Rocket, PlayCircle, CheckCircle2, Zap, Layers, Briefcase, GraduationCap, PieChart, FileSpreadsheet, Code2, Cloud, Cpu, Target, Lightbulb, Binary, Sparkles, Award, UserCheck, Flag, Globe, MessageSquare, Quote, Video, Mail, Send } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "AI Workflows",
    description: "Learn how modern AI systems improve productivity and execution.",
    icon: <Bot className="w-7 h-7" />
  },
  {
    title: "Build Real Projects",
    description: "Create portfolio-ready systems instead of consuming endless theory.",
    icon: <Laptop className="w-7 h-7" />
  },
  {
    title: "Automation Systems",
    description: "Design workflows that reduce manual work and scale operations.",
    icon: <Settings className="w-7 h-7" />
  },
  {
    title: "Community Learning",
    description: "Learn alongside builders, creators, and future-focused learners.",
    icon: <Users className="w-7 h-7" />
  },
  {
    title: "Startup Execution",
    description: "Understand how modern digital products and ventures are built.",
    icon: <Rocket className="w-7 h-7" />
  },
  {
    title: "Creator Economy Tools",
    description: "Build systems for content, audience growth, and monetization.",
    icon: <PlayCircle className="w-7 h-7" />
  }
];

const learningPaths = [
  {
    id: "01",
    title: "AI Foundations",
    description: "Learn AI tools, prompting, workflows, and productivity systems to amplify learning and execution.",
    included: ["AI Automation", "AI Productivity Systems", "Prompt Engineering"],
    build: [
      { icon: <Bot className="w-4 h-4" />, text: "AI Research Assistant" },
      { icon: <Settings className="w-4 h-4" />, text: "Smart Workflow System" }
    ],
    tags: ["AI Tools", "Prompting", "Productivity"],
    illustration: <div className="w-full h-40 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 relative overflow-hidden group-hover:bg-orange-100/50 transition-colors"><Bot className="w-20 h-20 text-orange-400 group-hover:scale-110 transition-transform duration-500" /></div>
  },
  {
    id: "02",
    title: "Automation Systems",
    description: "Design automated workflows and AI-powered integrations to save time and scale operations.",
    included: ["AI Automation", "Workflow Automation", "Automation Pipelines"],
    build: [
      { icon: <Zap className="w-4 h-4" />, text: "Automation Dashboard" },
      { icon: <Layers className="w-4 h-4" />, text: "End-to-End Workflow System" }
    ],
    tags: ["No-Code", "Workflows", "Integrations"],
    illustration: <div className="w-full h-40 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 relative overflow-hidden group-hover:bg-orange-100/50 transition-colors"><Settings className="w-20 h-20 text-orange-400 group-hover:scale-110 transition-transform duration-500" /></div>
  },
  {
    id: "03",
    title: "Build AI Projects",
    description: "Build real-world AI applications, full stack systems, dashboards, cloud deployments, and portfolio-ready products.",
    included: ["Full Stack Development", "MERN Stack Development", "DSA (Industry Ready)", "Cloud Computing (AWS)"],
    build: [
      { icon: <Code className="w-4 h-4" />, text: "AI Web App" },
      { icon: <PieChart className="w-4 h-4" />, text: "Data-Powered Dashboard" },
      { icon: <Cloud className="w-4 h-4" />, text: "Cloud Deployment Pipeline" }
    ],
    tags: ["MERN", "DSA", "AWS", "AI Apps", "Portfolio"],
    illustration: <div className="w-full h-40 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 relative overflow-hidden group-hover:bg-orange-100/50 transition-colors"><Laptop className="w-20 h-20 text-orange-400 group-hover:scale-110 transition-transform duration-500" /></div>
  },
  {
    id: "04",
    title: "Creator & Startup OS",
    description: "Build systems for content, audience growth, business execution, and digital entrepreneurship.",
    included: ["Digital Marketing", "Entrepreneurship", "Creator Growth Systems"],
    build: [
      { icon: <PlayCircle className="w-4 h-4" />, text: "Content Engine" },
      { icon: <Rocket className="w-4 h-4" />, text: "Startup MVP System" },
      { icon: <Users className="w-4 h-4" />, text: "Audience Growth Pipeline" }
    ],
    tags: ["Digital Marketing", "Entrepreneurship", "Growth", "Creator Tools"],
    illustration: <div className="w-full h-40 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100 relative overflow-hidden group-hover:bg-orange-100/50 transition-colors"><Target className="w-20 h-20 text-orange-400 group-hover:scale-110 transition-transform duration-500" /></div>
  }
];

const featureStrip = [
  { icon: <GraduationCap className="w-6 h-6" />, title: "Project-Based", text: "Learn by building real-world systems" },
  { icon: <Briefcase className="w-6 h-6" />, title: "Industry Relevant", text: "Skills that companies actually need" },
  { icon: <Code className="w-6 h-6" />, title: "Hands-On Learning", text: "Practice, build and ship your own projects" },
  { icon: <Users className="w-6 h-6" />, title: "Mentorship & Community", text: "Learn with a supportive community of builders" }
];

const industrialPrograms = [
  { title: "Data Analytics", description: "Analyze data, uncover insights, and make data-driven decisions using modern tools.", tags: ["SQL", "Power BI", "Visualization"], icon: <PieChart className="w-8 h-8" /> },
  { title: "Advanced Excel", description: "Master advanced Excel techniques for reporting, dashboards, and business intelligence.", tags: ["Advanced Excel", "Dashboards", "Reporting"], icon: <FileSpreadsheet className="w-8 h-8" /> },
  { title: "Full Stack Development", description: "Build dynamic web applications using modern front-end and back-end technologies.", tags: ["HTML", "CSS", "JavaScript", "Node.js"], icon: <Code2 className="w-8 h-8" /> },
  { title: "Cloud Computing (AWS)", description: "Learn cloud services, architecture and deployment on AWS platform.", tags: ["AWS", "EC2", "S3", "CloudOps"], icon: <Cloud className="w-8 h-8" /> },
  { title: "AI Automation", description: "Automate workflows using AI tools and no-code/low-code automation platforms.", tags: ["Make", "Zapier", "n8n", "AI Agents"], icon: <Cpu className="w-8 h-8" /> },
  { title: "Digital Marketing", description: "Grow brands, run campaigns and build digital presence across multiple channels.", tags: ["SEO", "Social Media", "Ads", "Analytics"], icon: <Target className="w-8 h-8" /> },
  { title: "Entrepreneurship", description: "Validate ideas, build MVPs and scale your business with modern execution strategies.", tags: ["Validation", "MVP", "Growth", "Business"], icon: <Lightbulb className="w-8 h-8" /> },
  { title: "DSA (Industry Ready)", description: "Master data structures and algorithms with problem solving for interviews and real world applications.", tags: ["DSA", "Algorithms", "Problem Solving", "Interviews"], icon: <Binary className="w-8 h-8" /> }
];

const learningProcessSteps = [
  {
    step: 1,
    title: "Choose Your Path",
    description: "Pick the learning track that aligns with your goals and interests.",
    icon: <Target className="w-6 h-6" />
  },
  {
    step: 2,
    title: "Learn Through Guided Systems",
    description: "Follow structured modules, bite-sized lessons, and hands-on implementations.",
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    step: 3,
    title: "Build Real Systems",
    description: "Work on real-world projects and build portfolio-ready applications.",
    icon: <Code2 className="w-6 h-6" />
  },
  {
    step: 4,
    title: "Collaborate & Get Mentored",
    description: "Interact with peers, mentors, and industry experts for feedback and guidance.",
    icon: <Users className="w-6 h-6" />
  },
  {
    step: 5,
    title: "Become Industry Ready",
    description: "Gain the skills, confidence, and experience to land opportunities and build your future.",
    icon: <Briefcase className="w-6 h-6" />
  }
];

const processFeatures = [
  { icon: <Code className="w-6 h-6" />, title: "Project-First Learning", desc: "Every concept is applied in real-world projects." },
  { icon: <UserCheck className="w-6 h-6" />, title: "Mentorship & Guidance", desc: "Learn from industry experts who've been there." },
  { icon: <Rocket className="w-6 h-6" />, title: "Career & Growth Focused", desc: "From skills to opportunities, we guide your growth." },
  { icon: <Award className="w-6 h-6" />, title: "Industry Recognized", desc: "Earn certifications that boost your credibility." },
  { icon: <Users className="w-6 h-6" />, title: "Community Driven", desc: "Learn together, build together, grow together." }
];

const portfolioStats = [
  { value: "50+", label: "Real-World Projects", subtext: "to build and ship", icon: <Briefcase className="w-6 h-6" /> },
  { value: "10+", label: "Industry Domains", subtext: "to explore and master", icon: <Globe className="w-6 h-6" /> },
  { value: "100%", label: "Hands-On Learning", subtext: "by building, not watching", icon: <Cpu className="w-6 h-6" /> },
  { value: "Portfolio", label: "Ready", subtext: "Showcase real impact", icon: <Rocket className="w-6 h-6" /> }
];

const showcaseProjects = [
  {
    id: 1,
    title: "AI Automation Dashboard",
    category: "AI / Automation",
    image: "/projects/ai-automation.png",
    features: ["AI Agent Workflows", "Task Automation", "Smart Integrations"]
  },
  {
    id: 2,
    title: "Full Stack SaaS Platform",
    category: "Web Development",
    image: "/projects/fullstack-saas.png",
    features: ["Authentication", "Payments", "REST APIs", "Deployment Ready"]
  },
  {
    id: 3,
    title: "Cloud Infrastructure Panel",
    category: "Cloud / DevOps",
    image: "/projects/cloud-dashboard.png",
    features: ["AWS Deployment", "Monitoring", "Auto Scaling"]
  },
  {
    id: 4,
    title: "Marketing Analytics Workspace",
    category: "Marketing / Growth",
    image: "/projects/marketing-dashboard.png",
    features: ["Campaign Tracking", "Analytics", "Conversion Funnels"]
  },
  {
    id: 5,
    title: "Startup MVP Builder",
    category: "Entrepreneurship",
    image: "/projects/startup-mvp.png",
    features: ["Landing Pages", "User Management", "Payment Flow"]
  },
  {
    id: 6,
    title: "DSA Interview Platform",
    category: "DSA / Problem Solving",
    image: "/projects/dsa-platform.png",
    features: ["Coding Interface", "Progress Tracking", "Test Cases"]
  }
];

const whyChecklist = [
  "Project-first, always",
  "AI-native learning",
  "Real-world execution",
  "Community-driven growth"
];

const whyEcosystemPillars = [
  {
    title: "Project-First Learning",
    description: "Learn by building real-world projects from day one.",
    footerTag: "Build → Deploy → Improve → Repeat",
    icon: <Code2 className="w-6 h-6" />
  },
  {
    title: "AI-Native Education",
    description: "Leverage AI tools, automation, and modern workflows in everything you build.",
    footerTag: "AI is not the future. It's your edge.",
    icon: <Bot className="w-6 h-6" />
  },
  {
    title: "Builder Community",
    description: "Join a community of ambitious learners, creators, and builders collaborating every day.",
    footerTag: "Learn together. Build together. Grow together.",
    icon: <Users className="w-6 h-6" />
  },
  {
    title: "Mentorship & Feedback",
    description: "Get guidance from industry mentors and receive actionable feedback on your work.",
    footerTag: "Real mentors. Real feedback. Real growth.",
    icon: <UserCheck className="w-6 h-6" />
  }
];

const whyStats = [
  { value: "50K+", label: "Builders Empowered", icon: <Users className="w-5 h-5" /> },
  { value: "500+", label: "Projects Shipped", icon: <Code className="w-5 h-5" /> },
  { value: "25+", label: "Industry Domains", icon: <Globe className="w-5 h-5" /> },
  { value: "100%", label: "Hands-On Learning", icon: <Target className="w-5 h-5" /> },
  { value: "Limitless", label: "Opportunities", icon: <Sparkles className="w-5 h-5" /> }
];

const communityFeatures = [
  {
    title: "Mentorship That Matters",
    description: "Learn from industry experts who guide, review, and help you level up.",
    icon: <Users className="w-5 h-5" />
  },
  {
    title: "Real Feedback. Real Growth.",
    description: "Get actionable feedback on your projects and improve faster.",
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    title: "Builder Community",
    description: "Collaborate with ambitious builders, creators, and learners.",
    icon: <Globe className="w-5 h-5" />
  },
  {
    title: "Accountability & Consistency",
    description: "Track progress, build streaks, and stay motivated.",
    icon: <Target className="w-5 h-5" />
  }
];

const communityStats = [
  { value: "10K+", label: "Active Builders", subtext: "learning and growing together", icon: <Users className="w-6 h-6" /> },
  { value: "300+", label: "Expert Mentors", subtext: "guiding your journey", icon: <UserCheck className="w-6 h-6" /> },
  { value: "Live", label: "Daily Sessions", subtext: "workshops, Q&A and more", icon: <PlayCircle className="w-6 h-6" /> },
  { value: "1M+", label: "Messages Exchanged", subtext: "collaborate, discuss, and build", icon: <MessageSquare className="w-6 h-6" /> },
  { value: "Real", label: "Connections", subtext: "a network that stays with you forever", icon: <Rocket className="w-6 h-6" /> }
];

const ctaTrustChips = [
  { text: "Project-First Learning", icon: <Code2 className="w-3.5 h-3.5" /> },
  { text: "AI-Native Workflows", icon: <Bot className="w-3.5 h-3.5" /> },
  { text: "Builder Community", icon: <Users className="w-3.5 h-3.5" /> },
  { text: "Real-World Systems", icon: <Rocket className="w-3.5 h-3.5" /> }
];

const footerLinks = {
  learningPaths: [
    { label: "AI Automation", href: "#" },
    { label: "Full Stack Development", href: "#" },
    { label: "Cloud Computing", href: "#" },
    { label: "Data Analytics", href: "#" },
    { label: "DSA (Industry Ready)", href: "#" }
  ],
  ecosystem: [
    { label: "Community", href: "#" },
    { label: "Mentorship", href: "#" },
    { label: "Projects", href: "#" },
    { label: "Workshops", href: "#" },
    { label: "Builder Network", href: "#" }
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Vision", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" }
  ],
  socials: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "X/Twitter", href: "#" }
  ]
};

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-900 font-sans overflow-hidden selection:bg-orange-200">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto relative z-20">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-600 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/30">
            D
          </div>
          <span className="font-extrabold text-xl tracking-wide">DEVPHOENIX</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <a href="#" className="text-slate-900 border-b-2 border-orange-500 pb-1">Home</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Courses</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Explore</a>
          <a href="#" className="hover:text-orange-500 transition-colors">About Us</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Reviews</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Blog</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="hidden md:block px-6 py-2.5 font-medium hover:text-orange-500 transition-colors">
            Login
          </button>
          <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Hero */}
      <main className="max-w-7xl mx-auto px-8 pt-12 pb-24 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 right-1/4 w-[800px] h-[800px] bg-orange-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none z-0" />

        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-orange-100 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">Welcome to DevPhoenix Edutech</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Learn. Grow.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Succeed.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-md leading-relaxed">
              Empowering minds with the skills, knowledge, and confidence to build a better tomorrow.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-2 group"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-slate-700 font-medium rounded-full shadow-sm border border-slate-100 flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                How It Works
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current" />
                </div>
              </motion.button>
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

            {/* Mascot Placeholder - Using a styled div as a structural proxy for the image */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 w-full h-full flex items-end justify-center pb-12"
            >
              {/* This represents the mascot. In a real app, this would be an <Image src="/mascot.png" /> */}
              <div className="relative w-72 h-96 flex flex-col items-center justify-center">
                <div className="w-full h-full bg-gradient-to-t from-orange-500/20 to-transparent rounded-[3rem] border-2 border-white/50 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent"></div>
                  <span className="text-slate-400 font-medium"><Image
                    src="/mascot.png"
                    alt="DevPhoeniX Mascot"
                    width={300}
                    height={400}
                    className="object-contain rounded-3xl"
                  /></span>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-0 md:-right-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col gap-2 z-20"
            >
              <p className="text-sm font-semibold text-slate-800">Your Journey</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-orange-500 font-medium">In Progress</span>
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
                <p className="text-xs text-slate-500 font-medium">Next Milestone</p>
                <p className="text-sm font-semibold text-slate-800">Build Your First<br />Project</p>
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
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="flex items-center gap-3 mb-2 text-orange-500">
                <Users className="w-6 h-6" />
                <span className="text-3xl font-bold text-slate-900">25,000+</span>
              </div>
              <p className="text-sm text-slate-500 font-medium">Active Learners</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="flex items-center gap-3 mb-2 text-orange-500">
                <BookOpen className="w-6 h-6" />
                <span className="text-3xl font-bold text-slate-900">300+</span>
              </div>
              <p className="text-sm text-slate-500 font-medium">Expert Courses</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="flex items-center gap-3 mb-2 text-orange-500">
                <Trophy className="w-6 h-6" />
                <span className="text-3xl font-bold text-slate-900">98%</span>
              </div>
              <p className="text-sm text-slate-500 font-medium">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="flex items-center gap-3 mb-2 text-orange-500">
                <Star className="w-6 h-6" />
                <span className="text-3xl font-bold text-slate-900">4.8/5</span>
              </div>
              <p className="text-sm text-slate-500 font-medium">Learner Rating</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="relative w-full max-w-7xl mx-auto px-8 py-24 z-10">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-gradient-to-t from-[#FFF9F5] via-orange-50/30 to-transparent" />
        </div>

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20 relative">
          {/* Decorative small stars */}
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 -left-8 text-orange-300"
          >
            <Star className="w-4 h-4 fill-current" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute top-10 -right-8 text-orange-300"
          >
            <Star className="w-5 h-5 fill-current" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            The Future of Learning
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Learn By Building<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Real Systems
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl leading-relaxed"
          >
            Master AI, automation, digital systems, and practical execution through project-based learning designed for the future.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)] transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              {/* Soft background glow on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/10 transition-colors duration-500" />

              <div className="mb-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative border border-orange-100/50">
                  <div className="absolute inset-0 bg-orange-400/20 rounded-2xl blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>

              <div className="mt-auto pt-6 flex items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why DevPhoeniX Ecosystem Section */}
      <section className="relative w-full max-w-7xl mx-auto px-8 py-24 z-10">
        
        {/* Background Ambient Layers */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-[4rem]">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-orange-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-300/10 rounded-full blur-[100px]" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* LEFT SIDE: Typography, Checklist, Mascot */}
          <div className="lg:col-span-5 flex flex-col items-start relative">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">WHY DEVPHOENIX?</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight"
            >
              More Than Courses.<br />
              A Builder Ecosystem<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 drop-shadow-sm">
                For The Future.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg"
            >
              We don&apos;t just teach skills. We build builders.<br/><br/>
              DevPhoeniX is an ecosystem designed to help you learn, build, ship, and grow in the real world.
            </motion.p>

            {/* Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 mb-12 w-full max-w-sm"
            >
              {whyChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 shadow-inner">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </motion.div>

            {/* Mascot Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative w-full max-w-[320px] aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-white/80 to-white/30 backdrop-blur-2xl border border-white/60 shadow-[0_20px_50px_-10px_rgba(249,115,22,0.1)] flex items-center justify-center overflow-hidden group"
            >
              <div className="absolute inset-0 bg-orange-400/10 blur-[40px] rounded-full scale-110" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.6),transparent)]" />
              
              <motion.div 
                animate={{ y: [-8, 8, -8] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[85%] h-[85%] z-10"
              >
                <Image
                  src="/mascots/learning.png"
                  alt="DevPhoeniX Builder Mascot"
                  fill
                  sizes="(max-width: 768px) 320px, 400px"
                  className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] select-none pointer-events-none"
                />
              </motion.div>
            </motion.div>

          </div>

          {/* RIGHT SIDE: Floating Ecosystem Pillars */}
          <div className="lg:col-span-7 flex flex-col gap-6 relative">
            <div className="grid sm:grid-cols-2 gap-6 relative z-10">
              {whyEcosystemPillars.map((pillar, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 + 0.2, duration: 0.6 }}
                  className={`bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.15)] transition-all duration-500 flex flex-col h-full group ${idx % 2 !== 0 ? 'sm:mt-12' : ''}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 flex items-center justify-center shrink-0 mb-6 border border-orange-100 shadow-inner group-hover:-translate-y-1 transition-transform duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-grow text-sm">{pillar.description}</p>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-bold tracking-wider uppercase text-orange-500">
                      {pillar.footerTag}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Ambient detail connecting cards */}
            <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-2 border-dashed border-orange-200/50 rounded-full z-0 pointer-events-none animate-[spin_120s_linear_infinite]" />
          </div>

        </div>

        {/* BOTTOM WIDE FEATURE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 relative w-full bg-gradient-to-r from-slate-900 to-[#0B1120] rounded-[2.5rem] p-10 lg:p-16 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          {/* Inner Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Rocket className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">REAL DIGITAL EXECUTION</span>
            </div>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
              From Idea to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Implementation.
              </span>
            </h3>
            <p className="text-slate-400 text-lg mb-8 max-w-md leading-relaxed">
              Ship products, solve problems, and create real impact. Build for today. Scale for tomorrow.
            </p>
            <button className="px-8 py-3.5 bg-white text-slate-900 font-bold rounded-full hover:bg-orange-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Start Building Now
            </button>
          </div>

          <div className="relative z-10 flex-1 w-full flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]">
              <Image 
                src="/illustrations/rocket-launch.png"
                alt="Rocket Launch Illustration"
                fill
                sizes="(max-width: 1024px) 300px, 400px"
                className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </motion.div>

        {/* BOTTOM STATS STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 w-full bg-white/90 backdrop-blur-2xl rounded-3xl p-8 border border-white shadow-[0_10px_40px_-10px_rgba(249,115,22,0.08)] flex flex-wrap justify-between items-center gap-8 relative overflow-hidden"
        >
          {whyStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center sm:items-start flex-1 min-w-[150px] relative">
              {idx !== whyStats.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 w-[1px] h-12 bg-slate-200" />
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                  {stat.icon}
                </div>
                <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-13 sm:pl-0">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </section>

      {/* Learning Paths Section */}
      <section className="relative w-full max-w-7xl mx-auto px-8 py-24 z-10">
        {/* Header */}
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
            Structured learning tracks designed to take you from beginner to builder. Learn. Build. Launch. Grow.
          </motion.p>
        </div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningPaths.map((path, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)] transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/10 transition-colors duration-500" />

              <div className="flex items-center gap-2 mb-4 relative z-10">
                <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg">{path.id}</span>
              </div>

              <div className="relative z-10">
                {path.illustration}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">{path.title}</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed relative z-10">{path.description}</p>

              <div className="mb-6 relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">INCLUDED PROGRAMS</p>
                <ul className="space-y-2">
                  {path.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">WHAT YOU&apos;LL BUILD</p>
                <ul className="space-y-3">
                  {path.build.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium bg-slate-50 rounded-xl p-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-orange-600 shadow-sm shrink-0">
                        {item.icon}
                      </div>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8 flex flex-wrap gap-2 relative z-10">
                {path.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                <span className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Explore Path</span>
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x divide-slate-200">
            {featureStrip.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 px-4">
                <div className="w-12 h-12 rounded-full bg-orange-100/50 text-orange-600 flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-slate-500">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Industrial Training Programs */}
      <section className="relative w-full max-w-7xl mx-auto px-8 py-24 z-10">
        <div className="flex flex-col items-center text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200 text-orange-600 font-semibold text-xs tracking-widest uppercase mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            MORE INDUSTRIAL TRAINING PROGRAMS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Explore More <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">High-Demand Skills</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base text-slate-600 max-w-2xl leading-relaxed"
          >
            Industry-oriented practical programs designed for modern careers and real-world execution.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industrialPrograms.map((prog, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(249,115,22,0.06)] transition-all duration-300 relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/10 transition-colors duration-500" />

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-orange-100/50 relative z-10">
                {prog.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 relative z-10">{prog.title}</h3>
              <p className="text-slate-500 text-xs mb-5 leading-relaxed relative z-10 flex-grow">{prog.description}</p>

              <div className="flex flex-wrap gap-1.5 relative z-10 mt-auto">
                {prog.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative w-full max-w-7xl mx-auto px-8 py-24 z-10">
        {/* Ambient Background Enhancements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-20">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-orange-50/40 rounded-full blur-[120px]" />
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200/60 text-orange-600 font-bold text-xs tracking-widest uppercase mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            HOW DEVPHOENIX LEARNING WORKS
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Your Journey from Learner<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 drop-shadow-sm">
              to Builder
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed"
          >
            A structured, project-first learning experience designed to transform you into an industry-ready builder.
          </motion.p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left Visual Story Area - Cinematic Premium Scene */}
          <div className="relative w-full h-[650px] bg-gradient-to-br from-white/80 to-white/30 backdrop-blur-2xl rounded-[3rem] border border-white/60 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.15)] overflow-hidden flex items-center justify-center group">

            {/* Atmospheric Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,237,213,0.6),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(254,215,170,0.4),transparent_50%)]" />

            {/* Floating Particles */}
            <motion.div animate={{ y: [-20, 20], opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[10%] w-3 h-3 bg-orange-400 rounded-full blur-sm" />
            <motion.div animate={{ y: [20, -20], opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[30%] right-[20%] w-4 h-4 bg-orange-300 rounded-full blur-md" />
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.5, 0.1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[40%] right-[40%] w-2 h-2 bg-red-400 rounded-full" />

            {/* Glowing Cinematic Roadmap Path */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <svg viewBox="0 0 800 600" className="w-full h-full preserve-3d">
                <defs>
                  <linearGradient id="glowPath" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fdba74" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id="cinematicGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="12" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Outer Ambient Glow */}
                <path d="M -50 550 Q 250 500, 350 350 T 800 100" fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="60" strokeLinecap="round" filter="url(#cinematicGlow)" />
                {/* Main Glowing Trail */}
                <path d="M -50 550 Q 250 500, 350 350 T 800 100" fill="none" stroke="url(#glowPath)" strokeWidth="18" strokeLinecap="round" filter="url(#cinematicGlow)" />
                {/* Inner Bright Core */}
                <path d="M -50 550 Q 250 500, 350 350 T 800 100" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 24" />
              </svg>
            </div>

            {/* Milestones - Premium Glassmorphism */}
            <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
              {[
                { num: 1, bottom: '20%', left: '15%', delay: 0 },
                { num: 2, bottom: '38%', left: '38%', delay: 0.2 },
                { num: 3, top: '40%', left: '52%', delay: 0.4 },
                { num: 4, top: '22%', left: '72%', delay: 0.6 }
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: m.delay, type: "spring", stiffness: 200 }}
                  className="absolute w-14 h-14 rounded-full bg-white/90 backdrop-blur-xl shadow-[0_10px_30px_rgba(249,115,22,0.25)] border-[3px] border-orange-100 flex items-center justify-center font-extrabold text-orange-500 text-xl ring-4 ring-white/50"
                  style={{ bottom: m.bottom, left: m.left, top: m.top }}
                >
                  {m.num}
                </motion.div>
              ))}

              {/* Milestone 5 + Flag */}
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 20 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="absolute top-[8%] left-[82%] flex flex-col items-center"
              >
                <div className="w-20 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-r-xl rounded-tl-xl shadow-[0_15px_35px_rgba(239,68,68,0.4)] flex items-center justify-center text-white relative mb-3 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.4),transparent)]" />
                  <Flag className="w-7 h-7 fill-current relative z-10 drop-shadow-md" />
                  <div className="absolute -left-1.5 top-0 w-3 h-24 bg-gradient-to-b from-slate-200 to-slate-400 rounded-full shadow-inner" />
                </div>
                <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-xl text-orange-600 font-extrabold flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.1)] border-[3px] border-orange-200 ring-4 ring-white/50 text-xl ml-2">5</div>
              </motion.div>

              {/* FULL Premium 3D Phoenix Mascot Scene */}
              <motion.div
                animate={{ y: [-15, 10, -15] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-6 left-6 w-[340px] h-[420px] z-20"
              >
                <div className="relative w-full h-full">
                  {/* Ambient Cinematic Glow */}
                  <div className="absolute inset-0 bg-orange-400/20 blur-[80px] rounded-full scale-110" />

                  {/* Secondary Glow Layer */}
                  <div className="absolute inset-0 bg-amber-300/10 blur-[120px] rounded-full scale-125" />

                  {/* Floating Particles */}
                  <div className="absolute top-10 left-10 w-3 h-3 bg-orange-300 rounded-full blur-sm opacity-70 animate-pulse" />
                  <div className="absolute top-24 right-8 w-2 h-2 bg-amber-200 rounded-full blur-sm opacity-60 animate-ping" />
                  <div className="absolute bottom-20 left-16 w-2 h-2 bg-orange-200 rounded-full blur-sm opacity-50 animate-pulse" />

                  {/* Mascot Image */}
                  <Image
                    src="/learning.png"
                    alt="DevPhoeniX Mascot"
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    priority
                    className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.28)] select-none pointer-events-none"
                  />

                  {/* Bottom Reflection Glow */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-10 bg-orange-300/20 blur-2xl rounded-full" />
                </div>
              </motion.div>

              {/* Floating Project Cards - Highly Detailed */}

              {/* AI Web App Card */}
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-[18%] left-[8%] bg-[#0B1120] rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-700/50 w-56 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/90 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/90 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                    <div className="w-3 h-3 rounded-full bg-green-500/90 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>
                  <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-[9px] text-orange-400 font-bold tracking-widest">LIVE</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 font-mono text-xs">function</span>
                    <span className="text-blue-400 font-mono text-xs">initAI</span>
                    <span className="text-slate-500 font-mono text-xs">() {'{'}</span>
                  </div>
                  <div className="w-[85%] h-1.5 bg-slate-700 rounded-full ml-4" />
                  <div className="w-[60%] h-1.5 bg-orange-500/70 rounded-full ml-4 shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                  <div className="w-[90%] h-1.5 bg-slate-700 rounded-full ml-4" />
                  <div className="text-slate-500 font-mono text-xs">{'}'}</div>
                </div>
              </motion.div>

              {/* Dashboard Preview */}
              <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[28%] right-[8%] bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-[0_20px_40px_rgba(249,115,22,0.15)] border border-white w-56">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">Analytics</span>
                  <span className="text-green-500 text-xs font-bold">+24%</span>
                </div>
                <div className="flex items-end gap-2.5 h-16 mb-2 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-50/50 to-transparent pointer-events-none" />
                  <div className="w-1/4 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-md shadow-sm relative group" style={{ height: '40%' }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">4k</div>
                  </div>
                  <div className="w-1/4 bg-gradient-to-t from-orange-300 to-orange-200 rounded-t-md shadow-sm" style={{ height: '70%' }} />
                  <div className="w-1/4 bg-gradient-to-t from-orange-400 to-orange-300 rounded-t-md shadow-sm" style={{ height: '55%' }} />
                  <div className="w-1/4 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-md shadow-md" style={{ height: '95%' }} />
                </div>
              </motion.div>

              {/* Build Deploy Grow Card */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[8%] left-[45%] bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-white flex items-center gap-4 z-30 group hover:scale-105 transition-transform cursor-default">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-200/50 shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm mb-0.5">Build. Deploy. Grow.</p>
                  <p className="text-[11px] font-medium text-slate-500">Ship real products that matter.</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Learning Process Timeline */}
          <div className="relative flex flex-col gap-8 pl-4 lg:pl-12 py-4">
            {/* Premium Vertical Line */}
            <div className="absolute left-8 lg:left-[3.75rem] top-10 bottom-10 w-1 bg-gradient-to-b from-orange-100 via-orange-200 to-transparent rounded-full shadow-[0_0_10px_rgba(249,115,22,0.2)]" />

            {learningProcessSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
                className="relative bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)] transition-all duration-300 flex items-start gap-5 lg:gap-6 ml-6 group"
              >
                {/* Premium Step Connector Point */}
                <div className="absolute top-1/2 -left-[58px] -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-orange-400 z-10 shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-125 group-hover:border-orange-500 transition-all duration-300">
                  <div className="absolute inset-1 bg-orange-200 rounded-full" />
                </div>

                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[1.5rem] bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 flex items-center justify-center shrink-0 relative overflow-hidden border border-orange-100 shadow-inner group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute inset-0 bg-orange-400/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-[1.5rem] blur-md" />
                  <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                </div>

                <div className="pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                    <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-md">Step {step.step}</span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{step.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Feature Strip - Glassmorphism Premium */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24 w-full bg-gradient-to-r from-white/90 via-white/70 to-white/90 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/60 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
          {/* Subtle glow behind strip */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,237,213,0.3),transparent,rgba(255,237,213,0.3))]" />

          <div className="flex flex-wrap justify-between items-start gap-8 relative z-10">
            {processFeatures.map((feat, idx) => (
              <div key={idx} className="flex-1 min-w-[150px] lg:min-w-[200px] flex flex-col items-start gap-4 relative group">
                {/* Premium Separator */}
                {idx !== processFeatures.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 w-[2px] h-16 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-white text-orange-500 flex items-center justify-center shadow-[0_8px_20px_rgba(249,115,22,0.1)] border border-orange-50 group-hover:scale-110 group-hover:shadow-[0_15px_30px_rgba(249,115,22,0.2)] group-hover:text-orange-600 transition-all duration-300">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1.5">{feat.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Portfolio-Ready Systems Section */}
      <section className="relative w-full max-w-7xl mx-auto px-8 py-24 z-10">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-6"
          >
            <Rocket className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">
              BUILD. DEPLOY. GROW.
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 drop-shadow-sm">Portfolio-Ready</span> Systems
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Go beyond theory. Build real-world projects and ship systems that make your portfolio stand out.
          </motion.p>
        </div>

        {/* Mascot & Top Stats Container */}
        <div className="flex flex-col lg:flex-row items-end lg:items-center gap-8 mb-16 relative">
           
           {/* Replaceable Mascot Container */}
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="relative w-[180px] h-[220px] lg:w-[220px] lg:h-[280px] shrink-0 -mb-6 lg:-mb-12 z-20"
           >
             <Image 
               src="/mascots/build-section-mascot.png"
               alt="DevPhoenix Mascot"
               fill
               sizes="(max-width: 1024px) 180px, 220px"
               className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]"
             />
           </motion.div>

           {/* Stats Strip - Glassmorphism */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="flex-1 w-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white/60 shadow-[0_15px_40px_-15px_rgba(249,115,22,0.1)] hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.15)] transition-shadow duration-500 relative overflow-hidden"
           >
             <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 via-transparent to-orange-50/50" />
             <div className="relative z-10 flex flex-wrap lg:flex-nowrap justify-between gap-8 lg:gap-4">
                {portfolioStats.map((stat, idx) => (
                  <div key={idx} className="flex-1 min-w-[140px] flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-200/50 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                       {stat.icon}
                     </div>
                     <div>
                       <div className="flex items-baseline gap-1.5">
                         <span className="text-2xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">{stat.value}</span>
                       </div>
                       <p className="font-bold text-slate-700 text-sm">{stat.label}</p>
                       <p className="text-[11px] text-slate-500 font-medium">{stat.subtext}</p>
                     </div>
                  </div>
                ))}
             </div>
           </motion.div>
        </div>

        {/* Main Bento Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {showcaseProjects.map((project) => (
             <motion.div
               key={project.id}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: project.id * 0.1, duration: 0.5 }}
               className="bg-white/95 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all duration-500 group flex flex-col h-full"
             >
                {/* Number & Category Badge */}
                <div className="px-6 pt-6 pb-4 flex items-center justify-between z-10 relative">
                   <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 font-bold flex items-center justify-center text-sm border border-orange-100">
                     {project.id}
                   </div>
                   <span className="px-3 py-1 bg-orange-50 text-orange-600 font-bold text-[10px] uppercase tracking-wider rounded-full">
                     {project.category}
                   </span>
                </div>
                
                {/* Title */}
                <h3 className="px-6 pb-5 text-xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {project.title}
                </h3>

                {/* Replaceable Image Container */}
                <div className="relative h-[220px] w-full bg-slate-50 overflow-hidden mx-auto">
                   <div className="absolute inset-x-6 top-0 bottom-0 rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner group-hover:shadow-md transition-shadow duration-500">
                      <Image 
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                   </div>
                </div>

                {/* Features List */}
                <div className="p-6 mt-auto">
                   <div className="space-y-3">
                     {project.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-3">
                           <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                           </div>
                           <span className="text-sm font-semibold text-slate-700">{feature}</span>
                        </div>
                     ))}
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Community & Mentorship Section */}
      <section className="relative w-full max-w-[1400px] mx-auto px-8 py-24 z-10 overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-400/5 rounded-full blur-[120px] -translate-x-1/2" />
          <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-[150px] translate-x-1/3" />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 xl:gap-16 items-start relative z-10">
          
          {/* LEFT COLUMN: Typography & Features */}
          <div className="lg:col-span-4 flex flex-col items-start relative pt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-6"
            >
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-700 tracking-widest uppercase">TOGETHER, WE BUILD</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight"
            >
              You Don&apos;t Build Alone.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Grow</span> With Builders.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-10 leading-relaxed"
            >
              At DevPhoeniX, you&apos;re part of a thriving ecosystem of builders, mentors, and creators supporting each other at every step.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-6 w-full"
            >
              {communityFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-orange-50/50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100/50 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1 text-sm sm:text-base">{feat.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* CENTER COLUMN: Main Collaborative Visual */}
          <div className="lg:col-span-4 flex justify-center w-full relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative w-full max-w-[400px] lg:max-w-none aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group"
            >
              <Image 
                src="/community/community-scene.png"
                alt="Builder Community"
                fill
                sizes="(max-width: 1024px) 400px, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col gap-4">
                 <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-orange-400">
                    <Quote className="w-5 h-5" fill="currentColor" />
                 </div>
                 <p className="text-white text-lg font-medium leading-relaxed drop-shadow-md">
                   &quot;Surround yourself with builders who challenge, inspire, and push you forward.
                 </p>
                 <p className="text-orange-400 font-bold drop-shadow-md">That&apos;s how you grow.&quot;</p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Floating Ecosystem Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6 relative">
            {/* Ambient detail */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05),transparent)] pointer-events-none rounded-full blur-3xl" />

            {/* Mentor Feedback Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10"
            >
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-bold text-slate-800">Mentor Feedback</span>
                 <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full">Mentor</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                 <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                   <Image src="/mentors/mentor-1.png" alt="Mentor" fill className="object-cover" />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900 text-sm">Arjun Mehta</p>
                   <p className="text-xs text-slate-500">Senior Software Engineer @ Stripe</p>
                 </div>
              </div>
              <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                &quot;Great implementation! 🔥 Consider optimizing the API caching layer and handling edge cases in the auth flow.&quot;
              </p>
              {/* Syntax highlighted code block representation */}
              <div className="w-full bg-[#0D1117] rounded-xl p-3 text-xs font-mono overflow-hidden">
                <div className="flex gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                </div>
                <div className="text-slate-300 flex flex-col gap-1">
                  <span className="text-purple-400">export const <span className="text-blue-400">fetchData</span> <span className="text-slate-300">=</span> <span className="text-purple-400">async</span> () <span className="text-purple-400">{`=>`}</span> <span className="text-slate-300">{`{`}</span></span>
                  <span className="pl-4">await cache.set(data, {`{`} ttl: 3600 {`}`})</span>
                </div>
              </div>
            </motion.div>

            {/* Live Workshop Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden z-10"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/4" />
              <div className="flex items-center justify-between mb-5 relative z-10">
                 <span className="text-xs font-bold text-slate-300">Live Workshop</span>
                 <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase rounded-full border border-red-500/20">
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live
                 </span>
              </div>
              <div className="flex items-start gap-4 mb-5 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight mb-1">Building Scalable SaaS with Next.js & AI</h4>
                  <p className="text-xs text-slate-400">Today, 7:00 PM</p>
                </div>
              </div>
              <button className="w-full py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors">
                Join Live Session
              </button>
            </motion.div>

            {/* Minor Data Cards Stacked */}
            <div className="grid grid-cols-2 gap-4">
               {/* Roadmap Card */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.5 }}
                 className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm"
               >
                 <div className="flex items-center gap-2 mb-3">
                   <Target className="w-4 h-4 text-orange-500" />
                   <span className="text-xs font-bold text-slate-800">Roadmap</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden">
                   <div className="w-[70%] h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
                 </div>
                 <p className="text-[10px] font-bold text-slate-500">70% Completed</p>
               </motion.div>

               {/* Streak Card */}
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.6 }}
                 className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-sm"
               >
                 <div className="flex items-center gap-2 mb-2">
                   <Zap className="w-4 h-4 text-orange-500" />
                   <span className="text-xs font-bold text-slate-800">Streak</span>
                 </div>
                 <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-black text-slate-900">14</span>
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Days</span>
                 </div>
               </motion.div>
            </div>

          </div>
        </div>

        {/* BOTTOM COMMUNITY STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-16 w-full bg-white/80 backdrop-blur-2xl rounded-3xl p-8 border border-white shadow-[0_15px_50px_-12px_rgba(0,0,0,0.05)] relative z-10"
        >
          <div className="flex flex-wrap justify-between gap-8 lg:gap-4">
            {communityStats.map((stat, idx) => (
              <div key={idx} className="flex-1 min-w-[140px] flex items-center gap-4 relative group">
                {idx !== communityStats.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 -translate-y-1/2 w-[1px] h-12 bg-slate-200" />
                )}
                <div className="w-12 h-12 rounded-xl bg-orange-50/50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100/50 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 block group-hover:text-orange-600 transition-colors">{stat.value}</span>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative w-full max-w-[1400px] mx-auto px-8 pt-24 pb-12 z-10 overflow-hidden">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative">
          
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_70%)] pointer-events-none -translate-y-1/2 translate-x-1/4" />
          
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            
            {/* LEFT SIDE: Typography & Actions */}
            <div className="p-10 lg:p-16 xl:p-20 flex flex-col justify-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-8 self-start"
              >
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-orange-600 tracking-widest uppercase">YOUR BUILD JOURNEY STARTS HERE</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight"
              >
                Don&apos;t Just Learn Technology.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 drop-shadow-sm">Build</span> With It.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg"
              >
                Go beyond passive learning. Build real-world systems, ship impactful projects, collaborate with builders, and grow into the future-ready creator you&apos;re meant to become.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 mb-12"
              >
                <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group">
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Start Building
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:border-orange-200 hover:bg-orange-50 transition-colors duration-300 flex items-center justify-center gap-2 group">
                  Explore Learning Paths
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-orange-500" />
                </button>
              </motion.div>

              {/* Trust Chips */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {ctaTrustChips.map((chip, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-orange-500">{chip.icon}</div>
                    <span className="text-xs font-bold text-slate-700">{chip.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT SIDE: Cinematic Workspace Visual */}
            <div className="relative min-h-[400px] lg:min-h-full bg-slate-900 overflow-hidden">
               {/* Replaceable Workspace Image */}
               <Image 
                 src="/cta/final-workspace.png"
                 alt="Future Builder Workspace"
                 fill
                 sizes="(max-width: 1024px) 100vw, 50vw"
                 className="object-cover opacity-60 mix-blend-overlay"
               />
               <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#0f172a]/80 to-transparent" />
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1),transparent)]" />

               {/* Floating UI Panels Container */}
               <div className="absolute inset-0 p-8 lg:p-12 relative pointer-events-none">
                  
                  {/* Floating Panel 1 - AI Assistant */}
                  <motion.div 
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-10 lg:right-20 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl w-64"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-bold text-white">AI Assistant</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Suggest improvements for the authentication flow...
                    </p>
                    <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-orange-400 rounded-full animate-pulse" />
                    </div>
                  </motion.div>

                  {/* Floating Panel 2 - Live Workshop */}
                  <motion.div 
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-20 left-10 lg:left-12 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-3 gap-6">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold text-white">Live Workshop</span>
                      </div>
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-bold uppercase rounded-full">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Scaling APIs with Next.js & AI</h4>
                  </motion.div>

                  {/* Floating Panel 3 - Streak */}
                  <motion.div 
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 right-8 lg:right-16 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50">
                      <Zap className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-white">12</span>
                        <span className="text-[10px] text-slate-300 uppercase">Day Streak</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-400" />)}
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      </div>
                    </div>
                  </motion.div>

               </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM EMOTIONAL STRIP */}
      <section className="w-full border-y border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-8 lg:py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-full h-full pointer-events-none">
            {/* Subtle aesthetic wave or gradient line representation */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-orange-300/30 to-transparent absolute top-1/2 -translate-y-1/2 rotate-3" />
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm border border-orange-100 shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-lg lg:text-xl font-bold text-slate-900 leading-tight">Your future is not written.</p>
              <p className="text-lg lg:text-xl font-bold text-orange-500 leading-tight">You build it.</p>
            </div>
          </div>
          
          <div className="text-center md:text-right relative z-10 max-w-sm">
            <p className="text-sm font-medium text-slate-500">Take the first step today and join the DevPhoeniX builder ecosystem.</p>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="w-full bg-[#FFF9F5] pt-24 pb-8 border-t border-slate-200/50">
        <div className="max-w-[1400px] mx-auto px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
            
            {/* Brand Column */}
            <div className="lg:col-span-4 flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/30">
                   D
                 </div>
                 <span className="font-extrabold text-2xl tracking-wide text-slate-900">DEVPHOENIX</span>
               </div>
               <p className="text-slate-600 leading-relaxed mb-8 max-w-sm">
                 Building intelligent digital ecosystems for the next generation of builders, creators, and developers.
               </p>
               
               {/* Newsletter Input */}
               <div className="w-full max-w-sm">
                 <h4 className="font-bold text-slate-900 mb-2">Stay Updated</h4>
                 <p className="text-xs text-slate-500 mb-4">Insights, launches, workshops, and future-ready learning updates.</p>
                 <div className="relative flex items-center">
                   <div className="absolute left-4 text-slate-400">
                     <Mail className="w-4 h-4" />
                   </div>
                   <input 
                     type="email" 
                     placeholder="Enter your email" 
                     className="w-full py-3.5 pl-11 pr-14 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
                   />
                   <button className="absolute right-2 w-10 h-10 bg-orange-50 hover:bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center transition-colors">
                     <Send className="w-4 h-4" />
                   </button>
                 </div>
               </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
               
               {/* Column 1 */}
               <div className="flex flex-col">
                 <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Learning Paths</h4>
                 <ul className="flex flex-col gap-4">
                   {footerLinks.learningPaths.map((link, idx) => (
                     <li key={idx}>
                       <a href={link.href} className="text-sm text-slate-500 hover:text-orange-500 font-medium transition-colors">{link.label}</a>
                     </li>
                   ))}
                 </ul>
               </div>

               {/* Column 2 */}
               <div className="flex flex-col">
                 <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Ecosystem</h4>
                 <ul className="flex flex-col gap-4">
                   {footerLinks.ecosystem.map((link, idx) => (
                     <li key={idx}>
                       <a href={link.href} className="text-sm text-slate-500 hover:text-orange-500 font-medium transition-colors">{link.label}</a>
                     </li>
                   ))}
                 </ul>
               </div>

               {/* Column 3 */}
               <div className="flex flex-col">
                 <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Company</h4>
                 <ul className="flex flex-col gap-4">
                   {footerLinks.company.map((link, idx) => (
                     <li key={idx}>
                       <a href={link.href} className="text-sm text-slate-500 hover:text-orange-500 font-medium transition-colors">{link.label}</a>
                     </li>
                   ))}
                 </ul>
               </div>

               {/* Column 4 */}
               <div className="flex flex-col">
                 <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Socials</h4>
                 <ul className="flex flex-col gap-4">
                   {footerLinks.socials.map((link, idx) => (
                     <li key={idx}>
                       <a href={link.href} className="text-sm text-slate-500 hover:text-orange-500 font-medium transition-colors">{link.label}</a>
                     </li>
                   ))}
                 </ul>
               </div>

            </div>
          </div>

          {/* Bottom Footer Strip */}
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
             
             <p className="text-xs text-slate-400 font-medium">
               © {new Date().getFullYear()} DEVPHOENIX. All rights reserved.
             </p>
             
             <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
               Built with ambition by <span className="text-orange-500">DEVPHOENIX</span>
             </p>

             <div className="flex items-center gap-6">
               <a href="#" className="text-xs text-slate-400 hover:text-slate-900 font-medium transition-colors">Privacy Policy</a>
               <a href="#" className="text-xs text-slate-400 hover:text-slate-900 font-medium transition-colors">Terms of Service</a>
             </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
