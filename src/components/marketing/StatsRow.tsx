"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Easing: easeOutCubic */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type StatCardProps = {
  label: string;
  end: number;          // final numeric value
  duration?: number;    // ms
  decimals?: number;    // digits after decimal
  prefix?: string;      // e.g. "Up to "
  suffix?: string;      // e.g. " %", " / 5"
  plus?: boolean;       // show trailing "+"
};

function StatCard({
  label,
  end,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  plus = false,
}: StatCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState<number>(0);
  const hasRun = useRef(false);

  const prefersReduced = useMemo(
    () => (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) || false,
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // If reduced motion, set final value immediately.
    if (prefersReduced || duration <= 0) {
      setValue(end);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !hasRun.current) {
          hasRun.current = true;
          const t0 = performance.now();
          const start = 0;
          const delta = end - start;

          const step = (now: number) => {
            const t = Math.min(1, (now - t0) / duration);
            const eased = easeOut(t);
            const next = start + delta * eased;
            setValue(next);
            if (t < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -15% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [end, duration, prefersReduced]);

  // Safe formatting
  const num = Number.isFinite(value) ? value : 0;
  const formattedCore =
    decimals > 0
      ? num.toFixed(decimals)
      : Math.floor(num).toLocaleString();
  const display = `${prefix}${formattedCore}${suffix}${plus ? "+" : ""}`;

  return (
    <div ref={containerRef} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-[#00FF7F]">
        {display}
      </div>
      <div className="mt-3 text-sm text-gray-300">{label}</div>
    </div>
  );
}

export default function StatsRow() {
  return (
    <section className="py-10 md:py-12">
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                  label="brands served"
                  end={50}
                  decimals={0}
                  plus
                />
        <StatCard
          label="reduction in landed costs"
          end={30}
          prefix="Up to "
          suffix="%"
          decimals={0}
        />
        <StatCard
          label="avg. CCC"
          end={85}
          prefix="↓ "
          suffix=" days"
          decimals={0}
          duration={900}
        />
      </div>
    </section>
  );
}
