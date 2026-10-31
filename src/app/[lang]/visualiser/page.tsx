import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import Visualiser from "@/components/visualiser/visualiser";
import type { RoomId } from "@/components/visualiser/room-scene";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/visualiser">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return pageMetadata(lang, "/visualiser", meta.visualiser);
}

export default async function VisualiserPage({ params, searchParams }: PageProps<"/[lang]/visualiser">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, query] = await Promise.all([getDictionary(lang), searchParams]);
  const surface = (key: string) => typeof query[key] === "string" ? query[key] as string : null;
  const room: RoomId = query.room === "bathroom" || query.room === "living" ? query.room : "kitchen";
  return <main id="main">
    <PageHero number="03" label={dict.visualiser.label} title={dict.visualiser.title} copy={dict.visualiser.copy} />
    <Visualiser initial={{ room, surfaces: { counter: surface("counter") ?? "QJ711", floor: surface("floor"), wall: surface("wall") } }} t={dict.visualiser} />
  </main>;
}
