import { env } from "@/config/env.config";
import type {
  ChangePasswordRequest,
  ProfileUpdate,
  TeacherBankUpdate,
  TeachingWindowUpdate,
  UploadAvatarResponse,
  UserProfile,
} from "@/features/profile/types/profile.types";
import { apiClient } from "@/services/api/apiClient";
import { getTokens } from "@/services/auth/tokenStorage";

function absoluteApiUrl(value: string) {
  if (/^(?:https?:|data:|blob:)/i.test(value)) return value;
  return `${env.apiUrl}/${value.replace(/^\//, "")}`;
}

function normalizeProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    avatarUrl: profile.avatarUrl
      ? absoluteApiUrl(profile.avatarUrl)
      : profile.avatarUrl,
    teachingWindow: profile.teachingWindow
      ? {
          start: profile.teachingWindow.start.slice(0, 5),
          end: profile.teachingWindow.end.slice(0, 5),
        }
      : profile.teachingWindow,
  };
}

export async function getMyProfile() {
  const response = await apiClient.get<UserProfile>("/api/users/me");
  return normalizeProfile(response.data);
}

export async function updateMyProfile(payload: ProfileUpdate) {
  const response = await apiClient.put<UserProfile>("/api/users/me", {
    ...payload,
    dateOfBirth: payload.dateOfBirth
      ? new Date(payload.dateOfBirth).toISOString()
      : null,
  });
  return normalizeProfile(response.data);
}

export async function updateTeacherBank(payload: TeacherBankUpdate) {
  const response = await apiClient.put<UserProfile>(
    "/api/users/me/bank",
    payload,
  );
  return normalizeProfile(response.data);
}

export async function updateTeachingWindow(payload: TeachingWindowUpdate) {
  const response = await apiClient.put<UserProfile>(
    "/api/users/me/teaching-window",
    payload,
  );
  return normalizeProfile(response.data);
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<UploadAvatarResponse>(
    "/api/users/me/avatar",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return { avatarUrl: absoluteApiUrl(response.data.avatarUrl) };
}

export async function changePassword(payload: ChangePasswordRequest) {
  await apiClient.post("/api/users/me/change-password", {
    ...payload,
    currentRefreshToken: getTokens()?.refreshToken ?? "",
  });
}
