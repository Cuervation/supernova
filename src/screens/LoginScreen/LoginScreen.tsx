import { useEffect } from "react";
import { BrandScreen } from "../../components/layout/BrandScreen";
import { BrandButton } from "../../components/ui/BrandButton";
import { BrandCard } from "../../components/ui/BrandCard";
import { BrandTitle } from "../../components/ui/BrandTitle";
import { useAuth } from "../../hooks/useAuth";

type LoginScreenProps = {
  onAuthenticated: () => void;
  onBack: () => void;
};

export function LoginScreen({ onAuthenticated, onBack }: LoginScreenProps) {
  const { user, isLoading, error, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      onAuthenticated();
    }
  }, [onAuthenticated, user]);

  return (
    <BrandScreen>
      <BrandTitle title="Ingresá para jugar" subtitle="Guardamos tu tiempo para el ranking." />
      <BrandCard>
        <div className="screen-stack">
          {error ? <p className="auth-error">{error}</p> : null}
          <BrandButton data-testid="google-login-button" disabled={isLoading} onClick={signIn}>
            {isLoading ? "Conectando..." : "Continuar con Google"}
          </BrandButton>
          <BrandButton data-testid="login-back-button" disabled={isLoading} onClick={onBack} variant="secondary">
            Volver
          </BrandButton>
        </div>
      </BrandCard>
    </BrandScreen>
  );
}
