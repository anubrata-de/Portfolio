"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
};
/** The current minute, so the value only changes when the clock does. */
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => 0;

/** The current time in India, with a nod to keeping late hours. */
export function LocalTime() {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
  if (!minute) return <span>GMT +5:30</span>;

  const now = new Date(minute * 60_000);
  const time = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
  const hour = Number(now.toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }));
  const late = hour >= 23 || hour < 5;
  return (
    <span>
      {time} here, GMT +5:30{late && <span className="local-time__note"> (yes, still up)</span>}
    </span>
  );
}
