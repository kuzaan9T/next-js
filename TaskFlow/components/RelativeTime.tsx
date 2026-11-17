"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

function formatRelative(date: string, now: number) {
  const diff = Math.min(0, Math.round((new Date(date).getTime() - now) / 1000));

  if (Math.abs(diff) < 45) {
    return "just now";
  }

  for (const [unit, seconds] of UNITS) {
    if (Math.abs(diff) >= seconds) {
      return formatter.format(Math.trunc(diff / seconds), unit);
    }
  }

  return formatter.format(diff, "second");
}

export default function RelativeTime({ date }: { date: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, [date]);

  return (
    <time dateTime={date} title={new Date(date).toLocaleString()} suppressHydrationWarning>
      {formatRelative(date, now)}
    </time>
  );
}
