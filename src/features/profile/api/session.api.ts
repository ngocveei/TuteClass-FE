import { apiClient } from "@/services/api/apiClient";
import { getTokens } from "@/services/auth/tokenStorage";
import type { UserSession } from "@/features/profile/types/session.types";

export async function getSessions() {
  const refreshToken = getTokens()?.refreshToken;
  const response = await apiClient.get<UserSession[]>(
    "/api/users/me/sessions",
    {
      headers: refreshToken ? { "X-Refresh-Token": refreshToken } : undefined,
    },
  );
  return response.data;
}

export async function revokeSession(sessionId: string) {
  await apiClient.delete(
    `/api/users/me/sessions/${encodeURIComponent(sessionId)}`,
  );
}

export async function revokeOtherSessions() {
  const currentRefreshToken = getTokens()?.refreshToken;
  if (!currentRefreshToken) throw new Error("Không tìm thấy phiên hiện tại.");

  await apiClient.post("/api/users/me/sessions/revoke-others", {
    currentRefreshToken,
  });
}
