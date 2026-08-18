import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/features/profile/api/profile.api";

export const profileKeys = {
  me: ["profile", "me"] as const,
};

export function useProfileDetails() {
  return useQuery({ queryKey: profileKeys.me, queryFn: getMyProfile });
}
