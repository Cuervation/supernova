import { forwardRef, type ReactNode } from "react";
import { BackgroundBlobs } from "./BackgroundBlobs";

type BrandScreenProps = {
  children: ReactNode;
  className?: string;
};

export const BrandScreen = forwardRef<HTMLDivElement, BrandScreenProps>(function BrandScreen(
  { children, className = "" },
  ref,
) {
  return (
    <div className={`brand-screen ${className}`.trim()} ref={ref}>
      <BackgroundBlobs />
      <div className="brand-screen__content">{children}</div>
    </div>
  );
});
