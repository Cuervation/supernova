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
  onSignOut: () => Promise<void>;
  onPlay: () => void;
  onViewTutorial?: () => void;
};

const principleImages = [
  { alt: "", src: coheteIcon },
  { alt: "", src: equipazoIcon },
  { alt: "", src: fanClienteIcon },
  { alt: "", src: huellaIcon },
  { alt: "", src: todoTerrenoIcon },
];

export function HomeScreen({ user, isAuthLoading, authError, playError, onSignIn, onSignOut, onPlay, onViewTutorial }: HomeScreenProps) {
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
          {authError ? <p className="auth-error">{authError}</p> : null}
          {playError ? <p className="auth-error">{playError}</p> : null}
          {user ? (
            <>
              <BrandButton data-testid="play-button" onClick={onPlay}>
                Jugar
              </BrandButton>
              {onViewTutorial ? (
                <BrandButton data-testid="view-tutorial-button" onClick={onViewTutorial} variant="secondary">
                  Ver tutorial
                </BrandButton>
              ) : null}
              <BrandButton data-testid="logout-button" onClick={onSignOut} variant="secondary">
                Cerrar sesión
              </BrandButton>
            </>
          ) : (
            <BrandButton className="home-auth-google-button" data-testid="google-login-button" disabled={isAuthLoading} onClick={onSignIn}>
              <span className="home-auth-google-button__icon" aria-hidden="true">
                <GoogleIcon />
              </span>
              <span className="home-auth-google-button__label">{isAuthLoading ? "Conectando..." : "Iniciar sesión con Google"}</span>
            </BrandButton>
          )}
        </div>
      </div>
    </BrandScreen>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="home-auth-google-button__svg" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 33.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5Z" />
      <path fill="#FF3D00" d="M6.3 14.7 12.9 19.6C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16 4 9 8.5 6.3 14.7Z" />
      <path fill="#4CAF50" d="m24 44c5.3 0 10.2-2 13.9-5.3l-6.4-5.3C29.6 35.2 27 36 24 36c-5.3 0-9.8-3.5-11.5-8.2l-6.6 5.1C8.6 39.8 15.6 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.6-3.7 6.4-7 8.1l.1-.1 6.4 5.3C36.3 41.3 44 36 44 24c0-1.2-.1-2.3-.4-3.5Z" />
    </svg>
  );
}
