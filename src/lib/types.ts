export type CollectionId = "nature" | "premium" | "designers";

export type Product = {
  code: string; slug: string; name: string; collection: CollectionId; tone: string; description: string;
  colours: string[]; pattern: string; finishes: string[]; thicknesses: number[]; slabSizes: string[]; applications: string[];
  swatch: string;
};

export type Article = { id: string; slug: string; title: string; excerpt: string; body: string; category: string; image: string; imageAlt: string; date: string };

export type Project = { id: string; slug: string; title: string; location: string; category: string; application: string; summary: string; designs: string[]; images: string[]; sample: boolean };

export type Resource = { id: string; title: string; description: string; audiences: string[]; type: string; file: string; format: string };

export type InquiryKind = "contact" | "quotation" | "sample" | "consultation" | "distributor" | "after-sales";
