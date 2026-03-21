const profileData = {
  personal: {
    name: "Mohammed Moid Sufiyan",
    email: "mmoidsufiyan4151@gmail.com",
    phone: "",
    location: "Hyderabad, Telangana, India"
  },
  education: [
    {
      degree: "Bachelor of Technology (B.Tech) in CSE (AI & ML)",
      college: "Vardhaman College of Engineering",
      cgpa: 7.8,
      year: "2023 – 2027 (Expected)"
    },
    {
      degree: "Intermediate",
      college: "Narayana Junior College",
      cgpa: 9.64,
      year: ""
    }
  ],
  skills: [
    "JavaScript", "TypeScript", "Python", "Java", "C",
    "React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS",
    "Node.js", "Express.js", "REST APIs",
    "MongoDB", "PostgreSQL", "MySQL",
    "Pandas", "NumPy", "Machine Learning", "NLP", "AI API Integration",
    "Git", "GitHub", "Vercel", "VS Code",
    "Salesforce (LWC, Apex, Flow, Einstein AI)", "Oracle Cloud Infrastructure"
  ],
  projects: [
    {
      name: "WollyWay – E-Commerce Platform",
      description: "Built a full-stack MERN application with authentication, product browsing, cart, wishlist, and payment integration. Designed scalable APIs and responsive UI.",
      techStack: ["React", "Node.js", "Express.js", "MongoDB", "TypeScript", "Tailwind CSS"]
    },
    {
      name: "ELI5 – AI Text Simplification Platform",
      description: "Developed an AI-powered web app that simplifies complex content using LLM APIs with real-time response streaming.",
      techStack: ["Next.js", "TypeScript", "FastAPI", "Python", "Gemini API"]
    },
    {
      name: "Agentforce Club Website",
      description: "Built a responsive platform for managing events and registrations with backend integration.",
      techStack: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"]
    }
  ],
  experience: [
    {
      role: "Salesforce Developer Intern",
      company: "SmartBridge",
      duration: "May 2025 – July 2025",
      description: "Developed CRM automation using LWC, Apex, and Salesforce Flow. Built AI-integrated workflows using Einstein AI. Created custom Lightning applications."
    }
  ],
  achievements: [
    "Salesforce Certified Agentforce Specialist",
    "Salesforce AI Associate",
    "Oracle Cloud Infrastructure Foundations Associate",
    "MongoDB Node.js Developer Path",
    "Essentials of Python Programming and Cyber Security",
    "Full-Stack Web Development Bootcamp (Dr. Angela Yu)"
  ],
  research: [
    "Published paper: 'Enhancing LEACH Protocol Efficiency in Wireless Sensor Networks using Hybrid Grasshopper and Mountain Gazelle Optimization Technique' (IC-CGU 2025)"
  ],
  extra: {
    strengths: [
      "Problem solving mindset",
      "Quick learner",
      "Ability to build end-to-end applications",
      "Consistency and self-learning"
    ],
    weaknesses: [],
    goals: "Short-term: Gain strong experience in full-stack and AI-based systems by working on real-world projects and internships. Long-term: Become a skilled software engineer capable of building scalable systems and working on impactful, AI-driven products.",
    languages: ["English (Fluent)", "Hindi (Fluent)", "Urdu (Fluent)", "Telugu (Fluent)", "French (Basic / Conversational)"]
  }
};

async function seed() {
  try {
    const res = await fetch('http://localhost:5000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Profile seeded successfully!', data.personal.name);
    } else {
      console.log('❌ Error seeding profile. Status:', res.status);
    }
  } catch (err) {
    console.error('❌ Error seeding profile:', err.message);
  }
}

seed();
