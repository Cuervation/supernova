import type { CSSProperties } from "react";

type GlowOrbTone = "magenta" | "violet" | "soft";

type GlowOrbProps = {
  tone: GlowOrbTone;
  size: string;
  blur?: string;
  opacity?: number;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

type GlowOrbStyle = CSSProperties & {
  "--glow-orb-size": string;
  "--glow-orb-blur": string;
  "--glow-orb-opacity": number;
  "--glow-orb-top": string;
  "--glow-orb-right": string;
  "--glow-orb-bottom": string;
  "--glow-orb-left": string;
};

export function GlowOrb({
  tone,
  size,
  blur = "0.2rem",
  opacity = 1,
  top = "auto",
  right = "auto",
  bottom = "auto",
  left = "auto",
}: GlowOrbProps) {
  const style: GlowOrbStyle = {
    "--glow-orb-size": size,
    "--glow-orb-blur": blur,
    "--glow-orb-opacity": opacity,
    "--glow-orb-top": top,
    "--glow-orb-right": right,
    "--glow-orb-bottom": bottom,
    "--glow-orb-left": left,
  };

  return <span aria-hidden="true" className={`glow-orb glow-orb--${tone}`} style={style} />;
}
