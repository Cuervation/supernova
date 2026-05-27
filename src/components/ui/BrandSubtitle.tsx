import type { HTMLAttributes, ReactNode } from "react";

type BrandSubtitleProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
};

export function BrandSubtitle({ children, className = "", ...props }: BrandSubtitleProps) {
  return (
    <p className={`brand-subtitle ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}
