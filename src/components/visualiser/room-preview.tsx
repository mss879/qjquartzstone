"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import RoomCanvas from "./room-canvas";
import type { RoomId } from "./room-scene";

export default function RoomPreview({ code, swatch, labels }: { code: string; swatch: string; labels: Record<RoomId, string> }) {
  const [room, setRoom] = useState<RoomId>("kitchen");
  const [visible, setVisible] = useState(false);
  const holder = useRef<HTMLDivElement>(null);
  const surfaces = useMemo(() => ({ counter: swatch }), [swatch]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { rootMargin: "300px" });
    if (holder.current) observer.observe(holder.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={holder} className="room-preview">
    <div className="room-tabs" role="group" aria-label={code}>{(Object.keys(labels) as RoomId[]).map(id => <button key={id} type="button" aria-pressed={room === id} onClick={() => setRoom(id)}>{labels[id]}</button>)}</div>
    <div className="room-preview-stage">{visible && <RoomCanvas room={room} surfaces={surfaces} interactive={false} loading="" unsupported="" />}</div>
  </div>;
}
