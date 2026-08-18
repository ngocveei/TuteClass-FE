import { apiClient } from "@/services/api/apiClient";
import { setTokens } from "@/services/auth/tokenStorage";
import { getTokens, removeTokens } from "@/services/auth/tokenStorage";
import type {
  AuthResponse,
  EmailVerificationResponse,
  LoginRequest,
  PendingVerificationContext,
  RegisterRequest,
  RegisterResponse,
  RegistrationRole,
} from "@/features/auth/types/auth.types";

const verificationStorageKey = "tuteclass.email-verification";
const resetStorageKey = "tuteclass.password-reset";

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/login", {
    email: request.email.trim().toLowerCase(),
    password: request.password,
  });
  setTokens(data);
  return data;
}

export async function register(
  request: RegisterRequest,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "/api/auth/register",
    {
      fullName: request.fullName.trim().replace(/\s+/g, " "),
      email: request.email.trim().toLowerCase(),
      password: request.password,
      role: request.role === "teacher" ? "Teacher" : "Student",
    },
  );
  const pending: PendingVerificationContext = {
    email: data.email,
    emailVerificationExpiresAt: data.emailVerificationExpiresAt,
    resendAvailableAt: data.resendAvailableAt,
  };
  sessionStorage.setItem(verificationStorageKey, JSON.stringify(pending));
  return data;
}

export async function googleLogin(
  idToken: string,
  role: RegistrationRole,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/api/auth/google", {
    idToken,
    role: role === "teacher" ? "Teacher" : "Student",
  });
  setTokens(data);
  return data;
}

export interface ForgotPasswordResponse {
  otpExpiresInMinutes: number;
  otpExpiresAt: string;
  resendAvailableAt: string;
}
export async function forgotPassword(
  email: string,
): Promise<ForgotPasswordResponse> {
  const normalized = email.trim().toLowerCase();
  const { data } = await apiClient.post<ForgotPasswordResponse>(
    "/api/auth/forgot-password",
    { email: normalized },
  );
  sessionStorage.setItem(
    resetStorageKey,
    JSON.stringify({ email: normalized, ...data }),
  );
  return data;
}

export async function resetPassword(
  otp: string,
  newPassword: string,
): Promise<void> {
  await apiClient.post("/api/auth/reset-password", {
    otp: otp.trim(),
    newPassword,
  });
  sessionStorage.removeItem(resetStorageKey);
}

export async function requestEmailVerification(
  email: string,
): Promise<EmailVerificationResponse> {
  const normalized = email.trim().toLowerCase();
  const { data } = await apiClient.post<EmailVerificationResponse>(
    "/api/auth/email-verification",
    { email: normalized },
  );
  sessionStorage.setItem(
    verificationStorageKey,
    JSON.stringify({
      email: normalized,
      emailVerificationExpiresAt: data.tokenExpiresAt,
      resendAvailableAt: data.resendAvailableAt,
    } satisfies PendingVerificationContext),
  );
  return data;
}

export async function verifyEmail(token: string): Promise<void> {
  await apiClient.post("/api/auth/verify-email", { token: token.trim() });
  sessionStorage.removeItem(verificationStorageKey);
}

export async function logout(): Promise<void> {
  const refreshToken = getTokens()?.refreshToken;
  try {
    if (refreshToken)
      await apiClient.post("/api/auth/logout", { refreshToken });
  } finally {
    removeTokens();
  }
}

export function readPendingVerification(): PendingVerificationContext | null {
  try {
    return JSON.parse(
      sessionStorage.getItem(verificationStorageKey) ?? "null",
    ) as PendingVerificationContext | null;
  } catch {
    return null;
  }
}
