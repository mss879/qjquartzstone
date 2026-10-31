import { notFound } from "next/navigation";

// Unmatched paths render the localized not-found page inside the [lang] root layout.
export default function Missing() {
  notFound();
}
