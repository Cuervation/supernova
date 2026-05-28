import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BrandScreen } from "../../components/layout/BrandScreen";
import { BrandButton } from "../../components/ui/BrandButton";
import { BrandLogo } from "../../components/ui/BrandLogo";
import type { AuthUser } from "../../core/auth/auth.types";
import coheteIcon from "../../assets/principles/cohete.png";
import equipazoIcon from "../../assets/principles/equipazo.png";
import fanClienteIcon from "../../assets/principles/fancliente.png";
import huellaIcon from "../../assets/principles/huella.png";
import todoTerrenoIcon from "../../assets/principles/todoterreno.png";

type HomeScreenProps = {
  user: AuthUser | null;
  isAuthLoading: boolean;
  authError: string | null;
  playError: string | null;
  onSignIn: () => Promise<void>;
  onPlay: () => void;
};

const principleImages = [
  { alt: "", src: coheteIcon },
  { alt: "", src: equipazoIcon },
  { alt: "", src: fanClienteIcon },
  { alt: "", src: huellaIcon },
  { alt: "", src: todoTerrenoIcon },
];

export function HomeScreen({ user, isAuthLoading, authError, playError, onSignIn, onPlay }: HomeScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!screenRef.current || !heroRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .from(".background-blobs", {
          opacity: 0,
          scale: 1.08,
          duration: 0.8,
        })
        .from(
          "[data-home-title]",
          {
            opacity: 0,
            scale: 0.9,
            y: 18,
            filter: "blur(0.8rem)",
            textShadow: "0 0 0rem var(--color-orb-magenta)",
            duration: 0.9,
          },
          "-=0.35",
        )
        .from(
          "[data-home-subtitle]",
          {
            opacity: 0,
            y: 14,
            duration: 0.55,
          },
          "-=0.35",
        )
        .from(
          "[data-home-cta]",
          {
            opacity: 0,
            y: 18,
            scale: 0.96,
            duration: 0.5,
          },
          "-=0.18",
        );

      gsap.to(".glow-orb", {
        y: "random(-18, 18)",
        x: "random(-10, 10)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "power3.out",
      });

      gsap.to(".home-particle", {
        y: "random(-18, 18)",
        opacity: "random(0.25, 0.7)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
        ease: "sine.inOut",
      });

      gsap.to(".home-principle-image", {
        y: "random(-16, 16)",
        rotate: "random(-8, 8)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        stagger: 0.16,
        ease: "sine.inOut",
      });
    }, screenRef);

    return () => context.revert();
  }, []);

  return (
    <BrandScreen className="home-screen" ref={screenRef}>
      <div aria-hidden="true" className="home-particles">
        <span className="home-particle home-particle--one" />
        <span className="home-particle home-particle--two" />
        <span className="home-particle home-particle--three" />
        <span className="home-particle home-particle--four" />
        <span className="home-particle home-particle--five" />
      </div>
      <div aria-hidden="true" className="home-principle-images">
        {principleImages.map((image, index) => (
          <img
            alt={image.alt}
            className={`home-principle-image home-principle-image--${index + 1}`}
            draggable={false}
            key={image.src}
            src={image.src}
          />
        ))}
      </div>
      <div className="screen-stack" ref={heroRef}>
        <div data-home-title>
          <BrandLogo className="home-logo" />
        </div>
        <p className="brand-subtitle" data-home-subtitle>
          Conectá sin límite
        </p>
        <div className="home-auth-actions" data-home-cta>
          {user ? <p className="home-auth-message">Hola, {user.displayName ?? user.email}. Ya podés jugar.</p> : null}
          {!user ? <p className="home-auth-message">Iniciá sesión con Google para guardar tu tiempo en el ranking.</p> : null}
          {authError ? <p className="auth-error">{authError}</p> : null}
          {playError ? <p className="auth-error">{playError}</p> : null}
          {user ? (
            <BrandButton data-testid="play-button" onClick={onPlay}>
              Jugar
            </BrandButton>
          ) : (
            <BrandButton data-testid="google-login-button" disabled={isAuthLoading} onClick={onSignIn}>
              {isAuthLoading ? "Conectando..." : "Iniciar sesión con Google"}
            </BrandButton>
          )}
        </div>
      </div>
    </BrandScreen>
  );
}
