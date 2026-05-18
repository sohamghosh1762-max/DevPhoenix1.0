import { Bot, Settings, Zap, Layers, Code, PieChart, Cloud, PlayCircle, Rocket, Users } from "lucide-react";
import React from "react";

export const learningPathsData = [
  {
    id: "01",
    title: "AI Foundations",
    description: "Learn AI tools, prompting, workflows, and productivity systems to amplify learning and execution.",
    included: ["AI Automation", "AI Productivity Systems", "Prompt Engineering"],
    build: [
      { icon: React.createElement(Bot, { className: "w-4 h-4" }), text: "AI Research Assistant" },
      { icon: React.createElement(Settings, { className: "w-4 h-4" }), text: "Smart Workflow System" }
    ],
    tags: ["AI Tools", "Prompting", "Productivity"],
    image: "/learning-paths/ai-foundations.png"
  },
  {
    id: "02",
    title: "Automation Systems",
    description: "Design automated workflows and AI-powered integrations to save time and scale operations.",
    included: ["AI Automation", "Workflow Automation", "Automation Pipelines"],
    build: [
      { icon: React.createElement(Zap, { className: "w-4 h-4" }), text: "Automation Dashboard" },
      { icon: React.createElement(Layers, { className: "w-4 h-4" }), text: "End-to-End Workflow System" }
    ],
    tags: ["No-Code", "Workflows", "Integrations"],
    image: "/learning-paths/automation-systems.png"
  },
  {
    id: "03",
    title: "Build AI Projects",
    description: "Build real-world AI applications, full stack systems, dashboards, cloud deployments, and portfolio-ready products.",
    included: ["Full Stack Development", "MERN Stack Development", "DSA (Industry Ready)", "Cloud Computing (AWS)"],
    build: [
      { icon: React.createElement(Code, { className: "w-4 h-4" }), text: "AI Web App" },
      { icon: React.createElement(PieChart, { className: "w-4 h-4" }), text: "Data-Powered Dashboard" },
      { icon: React.createElement(Cloud, { className: "w-4 h-4" }), text: "Cloud Deployment Pipeline" }
    ],
    tags: ["MERN", "DSA", "AWS", "AI Apps", "Portfolio"],
    image: "/learning-paths/build-ai-projects.png"
  },
  {
    id: "04",
    title: "Creator & Startup OS",
    description: "Build systems for content, audience growth, business execution, and digital entrepreneurship.",
    included: ["Digital Marketing", "Entrepreneurship", "Creator Growth Systems"],
    build: [
      { icon: React.createElement(PlayCircle, { className: "w-4 h-4" }), text: "Content Engine" },
      { icon: React.createElement(Rocket, { className: "w-4 h-4" }), text: "Startup MVP System" },
      { icon: React.createElement(Users, { className: "w-4 h-4" }), text: "Audience Growth Pipeline" }
    ],
    tags: ["Digital Marketing", "Entrepreneurship", "Growth", "Creator Tools"],
    image: "/learning-paths/startup-os.png"
  }
];
