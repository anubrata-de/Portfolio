"use client";

import { useEffect, useState } from "react";

/** The current time in Kolkata, with a nod to keeping late hours. */
export function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return <span className="local-time">GMT +5:30</span>;
  const time = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
  const hour = Number(now.toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }));
  const late = hour >= 23 || hour < 5;
  return (
    <span className="local-time">
      {time} here, GMT +5:30{late && <span className="local-time__note"> (yes, still up)</span>}
    </span>
  );
}
