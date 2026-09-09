export const INDUSTRIES = [
  "Home Services",
  "Legal Services",
  "Healthcare & Wellness",
  "E-commerce & Retail",
  "Real Estate",
  "Hospitality & Travel",
  "Education",
  "Finance & Insurance",
  "SaaS & Technology",
  "Automotive",
  "Food & Beverage",
  "Manufacturing",
] as const;

export const COUNTRIES = [
  "Sri Lanka",
  "India",
  "United Kingdom",
  "United States",
  "United Arab Emirates",
  "Australia",
  "Singapore",
] as const;

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  "Sri Lanka": ["Colombo", "Kandy", "Galle", "Negombo"],
  India: ["Bengaluru", "Mumbai", "Chennai", "Pune"],
  "United Kingdom": ["London", "Manchester", "Bristol"],
  "United States": ["Austin", "Denver", "Chicago"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  Australia: ["Sydney", "Melbourne"],
  Singapore: ["Singapore"],
};

export const CLIENT_SEEDS = [
  { name: "Northbridge Legal Partners", industry: "Legal Services" },
  { name: "Serene Wellness Clinics", industry: "Healthcare & Wellness" },
  { name: "Kandy Ridge Real Estate", industry: "Real Estate" },
  { name: "Coastal Breeze Resorts", industry: "Hospitality & Travel" },
  { name: "Lanka Auto Traders", industry: "Automotive" },
  { name: "BrightPath Learning Academy", industry: "Education" },
  { name: "Ceylon Organic Foods", industry: "Food & Beverage" },
  { name: "Horizon Finance Group", industry: "Finance & Insurance" },
  { name: "PulseTech Software", industry: "SaaS & Technology" },
  { name: "Emerald Isle Interiors", industry: "Home Services" },
  { name: "Metro Dental Care", industry: "Healthcare & Wellness" },
  { name: "Voyage Travel Collective", industry: "Hospitality & Travel" },
] as const satisfies { name: string; industry: (typeof INDUSTRIES)[number] }[];

export const PERSON_FIRST_NAMES = [
  "Amara",
  "Nadeesha",
  "Kasun",
  "Ishara",
  "Ravindu",
  "Sanduni",
  "Tharindu",
  "Dilani",
  "Chamath",
  "Hansika",
  "Yenuka",
  "Malsha",
] as const;

export const PERSON_LAST_NAMES = [
  "Perera",
  "Fernando",
  "Jayasuriya",
  "Wickramasinghe",
  "Gunaratne",
  "Silva",
  "Rajapaksa",
  "Bandara",
  "Karunaratne",
  "Weerasinghe",
] as const;

export const SEO_TOPIC_MODIFIERS = [
  "near me",
  "in {city}",
  "cost",
  "price",
  "reviews",
  "best",
  "vs",
  "for beginners",
  "guide",
  "services",
  "company",
  "consultant",
] as const;

export const SEO_SERVICE_HEADS_BY_INDUSTRY: Record<string, string[]> = {
  "Home Services": ["plumber", "electrician", "roof repair", "home cleaning", "pest control"],
  "Legal Services": ["divorce lawyer", "immigration attorney", "personal injury lawyer", "corporate lawyer"],
  "Healthcare & Wellness": ["dermatologist", "physiotherapy", "dental implants", "weight loss clinic"],
  "E-commerce & Retail": ["online electronics store", "handmade jewelry", "organic skincare", "furniture store"],
  "Real Estate": ["apartments for sale", "real estate agent", "commercial property", "luxury villas"],
  "Hospitality & Travel": ["beach resort", "boutique hotel", "travel packages", "airport transfer"],
  Education: ["online courses", "IELTS classes", "coding bootcamp", "tuition classes"],
  "Finance & Insurance": ["life insurance", "car insurance", "financial advisor", "personal loan"],
  "SaaS & Technology": ["project management software", "CRM software", "invoicing software", "HR software"],
  Automotive: ["used cars", "car service center", "car rental", "auto parts"],
  "Food & Beverage": ["organic snacks", "meal delivery", "coffee subscription", "catering services"],
  Manufacturing: ["industrial equipment", "packaging solutions", "custom fabrication"],
};

export const COMPETITOR_DOMAIN_SUFFIXES = ["hub", "pro", "expert", "direct", "group", "co"] as const;

export const CONTENT_TITLE_TEMPLATES = [
  "The Complete Guide to {topic}",
  "{topic}: Everything You Need to Know in 2026",
  "How to Choose the Right {topic}",
  "{topic} vs Alternatives: Which Is Best?",
  "10 Tips for {topic}",
  "{topic} for Small Businesses",
  "Why {topic} Matters More Than Ever",
] as const;

export const REVIEW_SNIPPETS = [
  "Excellent service, the team was professional from start to finish.",
  "Very happy with the results, would recommend to anyone in the area.",
  "Quick response time and fair pricing. Will be back again.",
  "Good experience overall, communication could be slightly better.",
  "Outstanding quality and attention to detail throughout the project.",
  "Friendly staff and a smooth, easy process.",
] as const;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function domainFor(clientName: string): string {
  return `${slugify(clientName).replace(/-/g, "")}.com`;
}
