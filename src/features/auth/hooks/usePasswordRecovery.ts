import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "@/features/auth/api/auth.api";
import type { PendingPasswordResetContext } from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/services/api/getApiErrorMessage";

function readResetContext(): PendingPasswordResetContext | null {
  try {
    return JSON.parse(
      sessionStorage.getItem("tuteclass.password-reset") ?? "null",
    ) as PendingPasswordResetContext | null;
  } catch {
    return null;
  }
}

const secondsUntil = (value: string | undefined, now: number) =>
  value ? Math.max(0, Math.ceil((Date.parse(value) - now) / 1000)) : 0;

export function useForgotPassword() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => navigate("/reset-password", { replace: true }),
  });

  return {
    submit: (email: string) => mutation.mutate(email),
    isSubmitting: mutation.isPending,
    error: mutation.error ? getApiErrorMessage(mutation.error) : undefined,
  };
}

export function useResetPassword() {
  const [context, setContext] = useState(readResetContext);
  const [digits, setDigits] = useState<string[]>(() => Array(6).fill(""));
  const [validationError, setValidationError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [now, setNow] = useState(Date.now());
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const otpSecondsRemaining = useMemo(
    () => secondsUntil(context?.otpExpiresAt, now),
    [context?.otpExpiresAt, now],
  );
  const resendSecondsRemaining = useMemo(
    () => secondsUntil(context?.resendAvailableAt, now),
    [context?.resendAvailableAt, now],
  );

  const resetMutation = useMutation({
    mutationFn: ({ otp, newPassword }: { otp: string; newPassword: string }) =>
      resetPassword(otp, newPassword),
  });
  const resendMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setContext(readResetContext());
      setDigits(Array(6).fill(""));
      setNow(Date.now());
      setNotice("Đã gửi lại mã OTP.");
    },
  });

  const setDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) =>
      current.map((item, position) => (position === index ? digit : item)),
    );
    if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const pasteOtp = (value: string) => {
    const pastedDigits = value.replace(/\D/g, "").slice(0, 6);
    setDigits(
      Array.from({ length: 6 }, (_, index) => pastedDigits[index] ?? ""),
    );
  };

  const submit = (newPassword: string) => {
    const otp = digits.join("");
    if (!/^\d{6}$/.test(otp)) {
      setValidationError("Mã OTP phải gồm 6 chữ số.");
      return;
    }
    setValidationError(undefined);
    resetMutation.mutate({ otp, newPassword });
  };

  const resend = () => {
    if (!context?.email || resendSecondsRemaining > 0) return;
    setNotice(undefined);
    resendMutation.mutate(context.email);
  };

  const requestError = resetMutation.error ?? resendMutation.error;
  return {
    error:
      validationError ??
      (requestError ? getApiErrorMessage(requestError) : undefined),
    notice,
    success: resetMutation.isSuccess,
    isSubmitting: resetMutation.isPending,
    isResending: resendMutation.isPending,
    otpDigits: digits,
    otpInputRefs,
    pendingReset: context,
    otpSecondsRemaining,
    resendSecondsRemaining,
    setDigit,
    pasteOtp,
    submit,
    resend,
  };
}
