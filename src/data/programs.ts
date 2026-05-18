import { Code, Cloud, Database, BarChart, Users, Terminal, Zap, LineChart } from "lucide-react";

export const programsData = [
  // PREMIUM CATEGORY
  { 
    id: "full-stack-development",
    title: "Full Stack Development", 
    description: "Build dynamic web applications using modern front-end and back-end technologies.", 
    category: "Development",
    level: "Beginner to Advanced",
    duration: "4-6 Months",
    type: "Premium",
    price: "₹4999",
    practicalHours: "100+ Hours",
    tags: ["Next.js", "React", "Node.js"], 
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
    outcomes: ["Build full-stack web applications", "Deploy scalable servers", "Master modern frameworks"],
    projects: 15,
    icon: Code,
    curriculum: [
      { title: "Core Concepts", topics: ["Introduction & Setup", "Best Practices", "Core Fundamentals"] },
      { title: "Advanced Techniques", topics: ["Architecture", "System Design", "Optimization"] }
    ],
    faqs: [
      { q: "Any prerequisites?", a: "No prior experience required." },
      { q: "Will I get placement support?", a: "Yes, we provide resume building and interview prep." }
    ]
  },
  { 
    id: "cloud-aws",
    title: "Cloud Computing (AWS)", 
    description: "Learn cloud services, architecture and deployment on AWS platform.", 
    category: "Cloud",
    level: "Intermediate",
    duration: "4-6 Months",
    type: "Premium",
    price: "₹4999",
    practicalHours: "100+ Hours",
    tags: ["AWS", "EC2", "CloudOps"], 
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    outcomes: ["Design cloud architectures", "Deploy applications to AWS", "Implement CI/CD pipelines"],
    projects: 12,
    icon: Cloud,
    curriculum: [
      { title: "Core Concepts", topics: ["Introduction & Setup", "Best Practices", "Core Fundamentals"] },
      { title: "Advanced Techniques", topics: ["Architecture", "System Design", "Optimization"] }
    ],
    faqs: [
      { q: "Any prerequisites?", a: "No prior experience required." },
      { q: "Will I get placement support?", a: "Yes, we provide resume building and interview prep." }
    ]
  },
  { 
    id: "data-analytics",
    title: "Data Analytics", 
    description: "Master Python, SQL, and PowerBI to extract actionable business insights.", 
    category: "Data",
    level: "Intermediate",
    duration: "4-6 Months",
    type: "Premium",
    price: "₹4999",
    practicalHours: "100+ Hours",
    tags: ["Python", "SQL", "PowerBI"], 
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    outcomes: ["Extract actionable insights", "Build interactive dashboards", "Perform statistical modeling"],
    projects: 10,
    icon: BarChart,
    curriculum: [
      { title: "Core Concepts", topics: ["Introduction & Setup", "Best Practices", "Core Fundamentals"] },
      { title: "Advanced Techniques", topics: ["Architecture", "System Design", "Optimization"] }
    ],
    faqs: [
      { q: "Any prerequisites?", a: "No prior experience required." },
      { q: "Will I get placement support?", a: "Yes, we provide resume building and interview prep." }
    ]
  },
  { 
    id: "dsa-industry",
    title: "DSA (Industry Ready)", 
    description: "Crack top tech interviews with deep algorithmic problem-solving skills.", 
    category: "Development",
    level: "Advanced",
    duration: "4-6 Months",
    type: "Premium",
    price: "₹4999",
    practicalHours: "100+ Hours",
    tags: ["C++", "Java", "Algorithms"], 
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop",
    outcomes: ["Master dynamic programming", "Crack top product interviews", "Write optimized code"],
    projects: 50,
    icon: Terminal,
    curriculum: [
      { title: "Core Concepts", topics: ["Introduction & Setup", "Best Practices", "Core Fundamentals"] },
      { title: "Advanced Techniques", topics: ["Architecture", "System Design", "Optimization"] }
    ],
    faqs: [
      { q: "Any prerequisites?", a: "No prior experience required." },
      { q: "Will I get placement support?", a: "Yes, we provide resume building and interview prep." }
    ]
  },

  // INDUSTRIAL CATEGORY
  { 
    id: "ai-automation",
    title: "AI Automation", 
    description: "Automate workflows using AI tools and no-code/low-code automation platforms.", 
    category: "AI",
    level: "Beginner",
    duration: "2-3 Months",
    type: "Industrial",
    price: "₹2999",
    practicalHours: "30+ Hours",
    tags: ["Make", "n8n", "AI Agents"], 
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop",
    outcomes: ["Automate business processes", "Deploy AI agents", "Reduce operational overhead"],
    projects: 10,
    icon: Zap,
    curriculum: [
      { title: "Core Concepts", topics: ["Introduction & Setup", "Best Practices", "Core Fundamentals"] },
      { title: "Advanced Techniques", topics: ["Architecture", "System Design", "Optimization"] }
    ],
    faqs: [
      { q: "Any prerequisites?", a: "No prior experience required." },
      { q: "Will I get placement support?", a: "Yes, we provide resume building and interview prep." }
    ]
  },
  { 
    id: "digital-marketing",
    title: "Digital Marketing", 
    description: "Learn modern performance marketing, SEO, and paid ad strategies.", 
    category: "Business",
    level: "Beginner",
    duration: "2-3 Months",
    type: "Industrial",
    price: "₹2999",
    practicalHours: "30+ Hours",
    tags: ["SEO", "Meta Ads", "Google Ads"], 
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    outcomes: ["Run profitable ad campaigns", "Optimize organic reach", "Analyze marketing funnels"],
    projects: 8,
    icon: LineChart,
    curriculum: [
      { title: "Core Concepts", topics: ["Introduction & Setup", "Best Practices", "Core Fundamentals"] },
      { title: "Advanced Techniques", topics: ["Architecture", "System Design", "Optimization"] }
    ],
    faqs: [
      { q: "Any prerequisites?", a: "No prior experience required." },
      { q: "Will I get placement support?", a: "Yes, we provide resume building and interview prep." }
    ]
  },
  { 
    id: "advanced-excel",
    title: "Advanced Excel", 
    description: "Master financial modeling, macros, and complex data manipulation.", 
    category: "Business",
    level: "Intermediate",
    duration: "2-3 Months",
    type: "Industrial",
    price: "₹2999",
    practicalHours: "30+ Hours",
    tags: ["Macros", "VBA", "Pivot Tables"], 
    image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=2070&auto=format&fit=crop",
    outcomes: ["Automate report generation", "Build complex financial models", "Master data structuring"],
    projects: 6,
    icon: Database,
    curriculum: [
      { title: "Core Concepts", topics: ["Introduction & Setup", "Best Practices", "Core Fundamentals"] },
      { title: "Advanced Techniques", topics: ["Architecture", "System Design", "Optimization"] }
    ]
  },
  { 
    id: "entrepreneurship",
    title: "Entrepreneurship", 
    description: "From idea to MVP. Learn how to build, launch, and scale a startup.", 
    category: "Business",
    level: "Beginner",
    duration: "2-3 Months",
    type: "Industrial",
    price: "₹2999",
    practicalHours: "30+ Hours",
    tags: ["MVP", "GTM", "Fundraising"], 
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1932&auto=format&fit=crop",
    outcomes: ["Launch your first MVP", "Understand unit economics", "Pitch to investors"],
    projects: 2,
    icon: Users,
    curriculum: [
      { title: "Core Concepts", topics: ["Introduction & Setup", "Best Practices", "Core Fundamentals"] },
      { title: "Advanced Techniques", topics: ["Architecture", "System Design", "Optimization"] }
    ]
  }
];

export const valueFeatures = [
  "Live Projects",
  "Industry-Focused Curriculum",
  "Certificate of Completion",
  "Portfolio Building",
  "Mentor Guidance",
  "Real-world Assignments",
  "Community Access",
  "Recorded Resources",
  "Resume & LinkedIn Guidance"
];
