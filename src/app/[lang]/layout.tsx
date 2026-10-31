import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import "../site.css";
import Navigation from "@/components/navigation";
import CompareTray from "@/components/site/compare-tray";
import SiteFooter from "@/components/site/footer";
import { SiteProvider } from "@/components/site/site-provider";
import { allProducts } from "@/lib/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, htmlLang, locales } from "@/lib/i18n";
import { alternates } from "@/lib/seo";

const catalogue = allProducts.map(({ code, slug, name, swatch, collection }) => ({ code, slug, name, swatch, collection }));

export const generateStaticParams = () => locales.map(lang => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return { metadataBase: new URL("https://qjquartzstone.com"), title: meta.title, description: meta.description, alternates: alternates(lang, "") };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <html lang={htmlLang[lang]} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteProvider lang={lang} catalogue={catalogue} labels={{ ...dict.compare, save: dict.catalogue.save, saved: dict.catalogue.saved, compare: dict.catalogue.compare, comparing: dict.catalogue.comparing }}>
          <a className="skip-link" href="#main">{dict.nav.skip}</a>
          <div id="top" />
          <Navigation t={dict.nav} />
          {children}
          <SiteFooter lang={lang} dict={dict} />
          <CompareTray />
        </SiteProvider>
      </body>
    </html>
  );
}
