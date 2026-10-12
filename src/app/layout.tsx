import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QJ Quartz Stone — Natural character. Engineered for living.",
  description: "Discover QJ’s quartz surfaces for kitchens, bathrooms and interiors. Explore distinctive finishes, slab designs and material possibilities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
