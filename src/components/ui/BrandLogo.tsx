import supernovaLogo from "../../assets/supernova/supernova.png";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return <img alt="Supernova" className={`brand-logo ${className}`.trim()} draggable={false} src={supernovaLogo} />;
}
