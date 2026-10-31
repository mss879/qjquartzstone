"use client";

import { useEffect, useRef, useState } from "react";
import type { RoomHandle, RoomId, Zone } from "./room-scene";

export type Surfaces = Partial<Record<Zone, string | null>>;

export default function RoomCanvas({ room, surfaces, interactive = true, loading, unsupported }: { room: RoomId; surfaces: Surfaces; interactive?: boolean; loading: string; unsupported: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<RoomHandle | null>(null);
  const latest = useRef(surfaces);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => { latest.current = surfaces; }, [surfaces]);

  useEffect(() => {
    let cancelled = false;
    let room3d: RoomHandle | null = null;
    import("./room-scene").then(async ({ createRoom }) => { // three.js only loads on pages that show a room.
      if (cancelled || !canvas.current) return;
      try {
        room3d = createRoom(canvas.current, room, { interactive });
        handle.current = room3d;
        await Promise.all(Object.entries(latest.current).map(([zone, url]) => room3d?.setSurface(zone as Zone, url ?? null)));
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("failed");
      }
    });
    return () => { cancelled = true; handle.current = null; room3d?.dispose(); };
  }, [room, interactive]);

  useEffect(() => {
    if (status !== "ready") return;
    Object.entries(surfaces).forEach(([zone, url]) => { handle.current?.setSurface(zone as Zone, url ?? null); });
  }, [surfaces, status]);

  return <div className={`room-canvas ${interactive ? "is-interactive" : ""}`}><canvas ref={canvas} aria-hidden="true" key={room} />{status !== "ready" && <p className="room-status">{status === "failed" ? unsupported : loading}</p>}</div>;
}
