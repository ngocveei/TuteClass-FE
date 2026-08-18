import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "@/features/auth/api/auth.api";
import { loadGoogleIdentity } from "@/features/auth/services/googleIdentityService";
import type { RegistrationRole } from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/services/api/getApiErrorMessage";
import { ROUTES } from "@/shared/constants/routes";

interface GoogleAuthOptions {
  mode: "login" | "register";
  role: RegistrationRole;
  disabled?: boolean;
  onError(message: string): void;
}

export function useGoogleAuth({
  mode,
  role,
  disabled,
  onError,
}: GoogleAuthOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef(role);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  roleRef.current = role;

  useEffect(() => {
    if (disabled || !clientId) {
      setLoading(false);
      return;
    }
    let active = true;
    void loadGoogleIdentity()
      .then((api) => {
        if (!active || !containerRef.current) return;
        api.initialize({
          client_id: clientId,
          callback: ({ credential }) => {
            if (!credential) {
              onError("Google không trả về ID token hợp lệ.");
              return;
            }
            void googleLogin(credential, roleRef.current)
              .then((result) => {
                const home: Record<string, string> = {
                  Teacher: ROUTES.teacherClasses,
                  Student: ROUTES.studentClasses,
                  Admin: ROUTES.adminUsers,
                };
                navigate(home[result.user.roleName] || ROUTES.landing, {
                  replace: true,
                });
              })
              .catch((reason) => onError(getApiErrorMessage(reason)));
          },
        });
        containerRef.current.replaceChildren();
        api.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "rectangular",
          text: mode === "register" ? "signup_with" : "signin_with",
          width: containerRef.current.offsetWidth || 360,
          locale: "vi",
        });
        setLoading(false);
      })
      .catch((reason) => {
        if (active) {
          setLoading(false);
          onError(getApiErrorMessage(reason));
        }
      });
    return () => {
      active = false;
    };
  }, [clientId, disabled, mode, navigate, onError]);

  return { containerRef, loading, clientIdMissing: !clientId };
}
