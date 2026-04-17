"use client";

import { useEffect, useRef, useState, ReactNode, ElementType } from "react";

type Direction = "up" | "down" | "left" | "right" | "fade";

type Props = {
  children: ReactNode;
  as?: ElementType;
  direction?: Direction;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
};

const TRANSLATE = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  fade: "",
};

export default function ScrollReveal({
  children,
  as: Tag = "div",
  direction = "up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = "",
  once = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // SSR / 브라우저 미지원 폴백: 즉시 표시
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    // 모션 줄이기 선호 사용자 대응
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const translate = !visible
    ? TRANSLATE[direction]
    : "translate-x-0 translate-y-0";
  const opacity = visible ? "opacity-100" : "opacity-0";

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`transition-all ease-out will-change-transform ${opacity} ${translate} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
