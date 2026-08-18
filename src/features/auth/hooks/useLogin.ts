import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "@/features/auth/api/auth.api";
import type {
  LoginRequest,
  RegistrationRole,
} from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/services/api/getApiErrorMessage";
import { ROUTES } from "@/shared/constants/routes";

export function useLogin() {
  const [googleRole, setGoogleRole] = useState<RegistrationRole>("student");
  const [externalError, setExternalError] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = new URLSearchParams(location.search).get("returnTo");
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      const requested =
        (location.state as { from?: { pathname?: string } } | null)?.from
          ?.pathname ?? returnTo;
      const home: Record<string, string> = {
        Teacher: ROUTES.teacherClasses,
        Student: ROUTES.studentClasses,
        Admin: ROUTES.adminUsers,
      };
      navigate(requested || home[result.user.roleName] || ROUTES.landing, {
        replace: true,
      });
    },
    onError: (reason) => {
      if (axios.isAxiosError(reason) && reason.response?.status === 403) {
        navigate("/register/check-email", { replace: true });
      }
    },
  });
  const submit = async (values: LoginRequest) => {
    setExternalError(undefined);
    try {
      await mutation.mutateAsync(values);
    } catch {
      /* error is exposed by the mutation */
    }
  };
  return {
    error:
      externalError ??
      (mutation.error ? getApiErrorMessage(mutation.error) : undefined),
    googleRole,
    isPending: mutation.isPending,
    returnTo,
    setGoogleRole,
    setExternalError,
    submit,
  };
}
