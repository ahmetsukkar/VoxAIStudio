export type PlanSlug = "start" | "creator" | "pro";

export interface Plan {
  slug: PlanSlug;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight: boolean;
  productId: string;
  image: string;
}

export const PLANS: Plan[] = [
  {
    slug: "start",
    name: "Starter",
    price: "$4.99",
    description: "Perfect for trying Vox AI Studio or small projects.",
    features: [
      "40,000 credits",
      "All voices (Flash + Pro)",
      "Multi-speaker enabled",
      "No character limit per request",
      "Credits never expire",
    ],
    highlight: false,
    productId: "98eca73c-5de0-4a22-9d46-264554e2326c",
    image: "/plans/starter.png",
  },
  {
    slug: "creator",
    name: "Creator",
    price: "$9.99",
    description: "Best value for content creators and educators.",
    features: [
      "125,000 credits",
      "All voices (Flash + Pro)",
      "Multi-speaker enabled",
      "All features included",
      "Credits never expire",
    ],
    highlight: true,
    productId: "c9dac2c1-aa44-4378-90fb-fc845e347493",
    image: "/plans/creator.png",
  },
  {
    slug: "pro",
    name: "Pro",
    price: "$49.99",
    description: "For agencies, teams, and high-volume creators.",
    features: [
      "400,000 credits",
      "All voices (Flash + Pro)",
      "Multi-speaker enabled",
      "All features included",
      "Priority queue",
      "Credits never expire",
    ],
    highlight: false,
    productId: "b0054483-c856-4415-8915-4bda36c3e86d",
    image: "/plans/pro.png",
  },
];

export const getPlanBySlug = (slug: PlanSlug): Plan => {
  const plan = PLANS.find((p) => p.slug === slug);
  if (!plan) throw new Error(`Plan not found: ${slug}`);
  return plan;
};
