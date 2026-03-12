export type PlanSlug = "starter" | "creator" | "pro";

export interface Plan {
  slug: PlanSlug;
  name: string;
  productId: string;
  price: number;
  credits: number;
  description: string;
  features: string[];
  highlight: boolean;
  image: string;
}

export const PLANS: Plan[] = [
  {
    slug: "starter",
    name: "Starter",
    productId: "f7019892-6c9a-45df-9a7e-0e0addd6fea9",
    price: 4.99,
    credits: 40_000,
    highlight: false,
    image: "/plans/starter.png",
    description: "Perfect for trying Vox AI Studio or small projects.",
    features: [
      "40,000 credits",
      "All voices (Flash + Pro)",
      "Multi-speaker enabled",
      "No character limit per request",
      "Credits never expire",
    ],
  },
  {
    slug: "creator",
    name: "Creator",
    productId: "73690d9a-4acf-470b-999b-0f2a44234802",
    price: 9.99,
    credits: 125_000,
    description: "Best value for content creators and educators.",
    highlight: true,
    image: "/plans/creator.png",
    features: [
      "125,000 credits",
      "All voices (Flash + Pro)",
      "Multi-speaker enabled",
      "All features included",
      "Credits never expire",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    productId: "0ec0d4e1-ca61-412e-be6f-f90c8bb62212",
    price: 49.99,
    credits: 400_000,
    description: "For agencies, teams, and high-volume creators.",
    highlight: false,
    image: "/plans/pro.png",
    features: [
      "400,000 credits",
      "All voices (Flash + Pro)",
      "Multi-speaker enabled",
      "All features included",
      "Priority queue",
      "Credits never expire",
    ],
  },
];

export const PLAN_CREDITS: Record<string, number> = Object.fromEntries(
  PLANS.map((p) => [p.productId, p.credits])
);

export const getPlanBySlug = (slug: PlanSlug): Plan => {
  const plan = PLANS.find((p) => p.slug === slug);
  if (!plan) throw new Error(`Plan not found: ${slug}`);
  return plan;
};
