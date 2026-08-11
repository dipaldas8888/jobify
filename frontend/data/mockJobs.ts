export type JobType = "Full-time" | "Part-time" | "Contract" | "Remote" | "Internship";
export type ExperienceLevel = "Entry Level" | "Mid Level" | "Senior Level" | "Lead" | "Director";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string; // emoji or initials
  companyColor: string; // gradient colors
  location: string;
  type: JobType;
  salary: string;
  experience: ExperienceLevel;
  tags: string[];
  description: string;
  postedAt: string;
  applicants: number;
  featured?: boolean;
}

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Stripe",
    companyLogo: "S",
    companyColor: "linear-gradient(135deg, #635bff, #4f46e5)",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$150k – $200k",
    experience: "Senior Level",
    tags: ["React", "TypeScript", "GraphQL", "Next.js"],
    description:
      "Join Stripe's world-class payments infrastructure team to build the future of online payments. You'll work on systems that process billions of dollars daily.",
    postedAt: "2 hours ago",
    applicants: 48,
    featured: true,
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "Vercel",
    companyLogo: "V",
    companyColor: "linear-gradient(135deg, #000000, #333333)",
    location: "Remote",
    type: "Remote",
    salary: "$130k – $170k",
    experience: "Mid Level",
    tags: ["Node.js", "React", "PostgreSQL", "Docker"],
    description:
      "Build the infrastructure that powers millions of developers. Work on the platform that deploys frontend applications globally.",
    postedAt: "5 hours ago",
    applicants: 92,
    featured: true,
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "Notion",
    companyLogo: "N",
    companyColor: "linear-gradient(135deg, #1a1a1a, #4a4a4a)",
    location: "New York, NY",
    type: "Full-time",
    salary: "$140k – $180k",
    experience: "Mid Level",
    tags: ["Go", "gRPC", "Kubernetes", "Redis"],
    description:
      "Scale the backend infrastructure at Notion, one of the fastest growing productivity tools. Help millions of users organize their work and life.",
    postedAt: "1 day ago",
    applicants: 67,
    featured: false,
  },
  {
    id: "4",
    title: "AI/ML Engineer",
    company: "Anthropic",
    companyLogo: "A",
    companyColor: "linear-gradient(135deg, #ff6b35, #f7931e)",
    location: "Remote",
    type: "Remote",
    salary: "$200k – $300k",
    experience: "Senior Level",
    tags: ["Python", "PyTorch", "LLMs", "CUDA"],
    description:
      "Work on cutting-edge AI safety research at Anthropic. Help build AI systems that are safe, reliable, and interpretable.",
    postedAt: "1 day ago",
    applicants: 234,
    featured: true,
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "GitHub",
    companyLogo: "G",
    companyColor: "linear-gradient(135deg, #24292e, #586069)",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$120k – $160k",
    experience: "Mid Level",
    tags: ["AWS", "Terraform", "Kubernetes", "CI/CD"],
    description:
      "Join GitHub's infrastructure team to build reliable, scalable systems used by over 100 million developers around the world.",
    postedAt: "2 days ago",
    applicants: 41,
    featured: false,
  },
  {
    id: "6",
    title: "Product Designer",
    company: "Figma",
    companyLogo: "F",
    companyColor: "linear-gradient(135deg, #f24e1e, #ff7262)",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$130k – $170k",
    experience: "Senior Level",
    tags: ["Figma", "Prototyping", "User Research", "Design Systems"],
    description:
      "Design the future of collaborative design tools. Work alongside world-class designers and engineers to shape how people create.",
    postedAt: "2 days ago",
    applicants: 118,
    featured: false,
  },
  {
    id: "7",
    title: "iOS Developer",
    company: "Spotify",
    companyLogo: "Sp",
    companyColor: "linear-gradient(135deg, #1db954, #1aa34a)",
    location: "Stockholm, Sweden",
    type: "Full-time",
    salary: "€90k – €130k",
    experience: "Mid Level",
    tags: ["Swift", "SwiftUI", "Objective-C", "XCode"],
    description:
      "Build the iOS app used by hundreds of millions of music lovers. Work on features that connect artists with fans around the world.",
    postedAt: "3 days ago",
    applicants: 73,
    featured: false,
  },
  {
    id: "8",
    title: "Data Engineer",
    company: "Airbnb",
    companyLogo: "Ab",
    companyColor: "linear-gradient(135deg, #ff5a5f, #ff385c)",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$140k – $185k",
    experience: "Senior Level",
    tags: ["Spark", "Kafka", "Python", "dbt", "Snowflake"],
    description:
      "Build the data infrastructure that powers Airbnb's marketplace. Work on large-scale data processing systems that analyze millions of trips.",
    postedAt: "3 days ago",
    applicants: 55,
    featured: false,
  },
  {
    id: "9",
    title: "Security Engineer",
    company: "Cloudflare",
    companyLogo: "Cf",
    companyColor: "linear-gradient(135deg, #f48120, #f6821f)",
    location: "Remote",
    type: "Remote",
    salary: "$160k – $210k",
    experience: "Senior Level",
    tags: ["Security", "Cryptography", "Rust", "Zero-Trust"],
    description:
      "Help protect millions of websites and APIs from attacks. Work on Cloudflare's global network that handles 20% of internet traffic.",
    postedAt: "4 days ago",
    applicants: 29,
    featured: false,
  },
  {
    id: "10",
    title: "Frontend Intern",
    company: "Linear",
    companyLogo: "L",
    companyColor: "linear-gradient(135deg, #5e6ad2, #4c54c0)",
    location: "Remote",
    type: "Internship",
    salary: "$8k – $10k/month",
    experience: "Entry Level",
    tags: ["React", "TypeScript", "CSS", "GraphQL"],
    description:
      "Join Linear's small but mighty team to build the issue tracking tool loved by top engineering teams. Great opportunity for recent grads.",
    postedAt: "5 days ago",
    applicants: 312,
    featured: false,
  },
  {
    id: "11",
    title: "Engineering Manager",
    company: "Slack",
    companyLogo: "Sl",
    companyColor: "linear-gradient(135deg, #4a154b, #611f69)",
    location: "New York, NY",
    type: "Full-time",
    salary: "$200k – $250k",
    experience: "Lead",
    tags: ["Leadership", "Distributed Systems", "Java", "Agile"],
    description:
      "Lead a high-performing team of engineers building the next generation of workplace communication tools used by millions of teams.",
    postedAt: "1 week ago",
    applicants: 88,
    featured: false,
  },
  {
    id: "12",
    title: "Blockchain Developer",
    company: "Coinbase",
    companyLogo: "Cb",
    companyColor: "linear-gradient(135deg, #0052ff, #1652f0)",
    location: "Remote",
    type: "Remote",
    salary: "$180k – $240k",
    experience: "Senior Level",
    tags: ["Solidity", "Web3.js", "Ethereum", "TypeScript"],
    description:
      "Build the financial infrastructure of the internet at Coinbase. Work on smart contracts and decentralized applications that handle billions in crypto.",
    postedAt: "1 week ago",
    applicants: 147,
    featured: false,
  },
];

export const jobCategories = [
  { label: "Engineering", count: 1240, icon: "⚙️" },
  { label: "Design", count: 380, icon: "🎨" },
  { label: "Product", count: 290, icon: "📦" },
  { label: "Marketing", count: 420, icon: "📣" },
  { label: "Data Science", count: 310, icon: "📊" },
  { label: "DevOps", count: 180, icon: "🚀" },
];
