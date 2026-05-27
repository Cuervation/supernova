import type { ButtonHTMLAttributes } from "react";

type BrandButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  variant?: "primary" | "secondary";
};

export function BrandButton({ className = "", fullWidth = true, variant = "primary", ...props }: BrandButtonProps) {
  const widthClass = fullWidth ? "brand-button--full" : "";
  const variantClass = `brand-button--${variant}`;

  return <button className={`brand-button ${variantClass} ${widthClass} ${className}`.trim()} {...props} />;
}
