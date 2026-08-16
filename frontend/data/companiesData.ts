export interface Company {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  location: string;
  employees: string;
  openJobsCount: number;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  logo: string;
  logoBg: string;
  description: string;
  perks: string[];
}

export const COMPANIES_DATA: Company[] = [
  {
    id: "acme-corp",
    name: "Acme Corp",
    tagline: "Empowering world-class teams to build next-gen software.",
    industry: "Software & Technology",
    location: "San Francisco, CA",
    employees: "500–1,000",
    openJobsCount: 12,
    rating: 4.8,
    reviewsCount: 340,
    featured: true,
    logo: "A",
    logoBg: "linear-gradient(135deg, #4f46e5, #6366f1)",
    description:
      "Acme Corp is a globally recognized software infrastructure company providing cloud solutions for modern web applications.",
    perks: ["Remote Work", "Health & Dental", "401(k) Matching", "Learning Stipend"],
  },
  {
    id: "tech-innovators",
    name: "TechInnovators",
    tagline: "Pioneering artificial intelligence & machine learning platform.",
    industry: "Artificial Intelligence",
    location: "New York, NY",
    employees: "200–500",
    openJobsCount: 8,
    rating: 4.9,
    reviewsCount: 215,
    featured: true,
    logo: "T",
    logoBg: "linear-gradient(135deg, #059669, #10b981)",
    description:
      "TechInnovators is at the forefront of machine learning and large language models, powering next-generation smart analytics.",
    perks: ["Equity Package", "Unlimited PTO", "Gym Membership", "Home Office Budget"],
  },
  {
    id: "global-solutions",
    name: "Global Solutions",
    tagline: "Enterprise cloud services and scalable IT infrastructure.",
    industry: "Enterprise Software",
    location: "Austin, TX",
    employees: "1,000+",
    openJobsCount: 15,
    rating: 4.6,
    reviewsCount: 520,
    logo: "G",
    logoBg: "linear-gradient(135deg, #0284c7, #38bdf8)",
    description:
      "Global Solutions provides enterprise-grade data security and cloud transformation services for Fortune 500 organizations.",
    perks: ["Flexible Hours", "Parental Leave", "Commuter Benefits", "Performance Bonuses"],
  },
];

export const INDUSTRIES = [
  "All",
  "Software & Technology",
  "Artificial Intelligence",
  "Enterprise Software",
  "Fintech",
];
