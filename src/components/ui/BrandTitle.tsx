import { BrandSubtitle } from "./BrandSubtitle";

type BrandTitleProps = {
  title: string;
  subtitle?: string;
};

export function BrandTitle({ title, subtitle }: BrandTitleProps) {
  return (
    <header className="brand-title-group">
      <h1 className="brand-title">{title}</h1>
      {subtitle ? <BrandSubtitle>{subtitle}</BrandSubtitle> : null}
    </header>
  );
}
