import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  readPendingVerification,
  requestEmailVerification,
  verifyEmail,
} from "@/features/auth/api/auth.api";
import { getApiErrorMessage } from "@/services/api/getApiErrorMessage";

const secondsUntil = (value: string | undefined, now: number) =>
  value ? Math.max(0, Math.ceil((Date.parse(value) - now) / 1000)) : 0;

export function useCheckEmail() {
  const [context, setContext] = useState(readPendingVerification);
  const [now, setNow] = useState(Date.now());
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const resendSeconds = useMemo(
    () => secondsUntil(context?.resendAvailableAt, now),
    [context?.resendAvailableAt, now],
  );
  const mutation = useMutation({
    mutationFn: requestEmailVerification,
    onSuccess: () => {
      setContext(readPendingVerification());
      setNotice("Đã gửi lại email xác minh.");
    },
  });

  const resend = () => {
    if (!context?.email || resendSeconds > 0) return;
    setNotice(undefined);
    mutation.mutate(context.email);
  };

  const requestForEmail = (email: string) => {
    setNotice(undefined);
    mutation.mutate(email);
  };

  return {
    context,
    resendSeconds,
    pending: mutation.isPending,
    error: mutation.error ? getApiErrorMessage(mutation.error) : undefined,
    notice,
    requestForEmail,
    resend,
  };
}

export function useVerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token")?.trim() ?? "";
  const startedToken = useRef<string | undefined>(undefined);
  const mutation = useMutation({ mutationFn: verifyEmail });

  useEffect(() => {
    if (!token || startedToken.current === token) return;
    startedToken.current = token;
    mutation.mutate(token);
  }, [mutation, token]);

  if (!token) {
    return {
      state: "error" as const,
      error: "Link xác minh không hợp lệ hoặc bị thiếu token.",
    };
  }

  return {
    state: mutation.isSuccess
      ? ("success" as const)
      : mutation.isError
        ? ("error" as const)
        : ("loading" as const),
    error: mutation.error ? getApiErrorMessage(mutation.error) : undefined,
  };
}
