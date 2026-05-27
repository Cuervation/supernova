import type { HTMLAttributes, ReactNode } from "react";

type BrandCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function BrandCard({ children, className = "", ...props }: BrandCardProps) {
  return (
    <article className={`brand-card ${className}`.trim()} {...props}>
      {children}
    </article>
  );
}
