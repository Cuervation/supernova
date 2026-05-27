import { GlowOrb } from "./GlowOrb";

export function BackgroundBlobs() {
  return (
    <div aria-hidden="true" className="background-blobs">
      <GlowOrb opacity={0.92} right="-6rem" size="14rem" tone="magenta" top="8%" />
      <GlowOrb bottom="10%" left="-4rem" opacity={0.75} size="9rem" tone="violet" />
      <GlowOrb bottom="38%" opacity={0.5} right="18%" size="6rem" tone="soft" />
    </div>
  );
}
