"use client";
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  as?: ElementType;
  /** Where the block arrives from. Sections alternate left and right; small things come up. */
  variant?: "left" | "right" | "up" | "pop";
  delay?: number;
  className?: string;
  children?: ReactNode;
  id?: string;
  style?: CSSProperties;
};

/** Fires once when the element's top is ~88% down the viewport. The hidden state only exists under html.js. */
export default function Reveal({ as: Tag = "div", variant = "up", delay = 0, className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} data-reveal={variant} className={className} style={{ "--d": `${delay}ms`, ...rest.style } as CSSProperties} {...(rest.id ? { id: rest.id } : {})}>
      {children}
    </Tag>
  );
}
