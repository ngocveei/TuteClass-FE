import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { register } from "@/features/auth/api/auth.api";
import type {
  RegisterRequest,
  RegistrationRole,
} from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/services/api/getApiErrorMessage";

export interface RegisterFormValues extends Omit<RegisterRequest, "role"> {
  confirmPassword: string;
}

export function useRegister() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<RegistrationRole>(
    params.get("role") === "student" ? "student" : "teacher",
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [externalError, setExternalError] = useState<string>();
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => navigate("/register/check-email", { replace: true }),
  });
  const submit = async (values: RegisterFormValues) => {
    setExternalError(undefined);
    try {
      await mutation.mutateAsync({
        ...values,
        role: selectedRole,
        termsAccepted: values.termsAccepted,
      });
    } catch {
      /* error is exposed by the mutation */
    }
  };
  return {
    error:
      externalError ??
      (mutation.error ? getApiErrorMessage(mutation.error) : undefined),
    isPending: mutation.isPending,
    selectedRole,
    termsAccepted,
    setSelectedRole,
    setTermsAccepted,
    setExternalError,
    submit,
  };
}
