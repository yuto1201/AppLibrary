"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 視界に入ったら .reveal に .in を足す。
 *
 * 旧 main.js は className を直接書き換えていたが、React では再レンダリングのたびに
 * className が props の値へ戻されて .in が消えるため、状態として React に持たせる。
 * prefers-reduced-motion の即時表示は standard.css 側のメディアクエリで担保する。
 */
export function useReveal<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  className: string;
} {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return { ref, className: inView ? "reveal in" : "reveal" };
}
