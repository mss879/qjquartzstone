import type { InquiryKind } from "./types";

export type FieldError = "required" | "invalidEmail" | "pickProduct";
export type Submission = Record<string, string>;

const requiredFields: Record<InquiryKind, string[]> = {
  contact: ["name", "email", "message"],
  quotation: ["name", "email", "phone"],
  sample: ["name", "email", "phone", "deliveryAddress"],
  consultation: ["name", "email", "phone", "consultationType", "preferredDate", "preferredTime"],
  distributor: ["name", "email", "company", "country", "market", "experience"],
  "after-sales": ["name", "email", "issue"],
};

export function validateSubmission(kind: InquiryKind, fields: Submission, products: string[]) {
  const errors: Record<string, FieldError> = {};
  for (const field of requiredFields[kind]) if (!fields[field]?.trim()) errors[field] = "required";
  if (kind === "consultation" && fields.consultationType === "site" && !fields.siteAddress?.trim()) errors.siteAddress = "required";
  if (fields.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = "invalidEmail";
  if ((kind === "sample" || kind === "quotation") && !products.length) errors.products = "pickProduct";
  return errors;
}
