import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateMyProfile,
  updateTeacherBank,
  updateTeachingWindow,
  uploadAvatar,
} from "@/features/profile/api/profile.api";
import {
  profileKeys,
  useProfileDetails,
} from "@/features/profile/hooks/useProfileDetails";
import { getApiErrorMessage } from "@/services/api/getApiErrorMessage";

const avatarTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const maximumAvatarBytes = 5 * 1024 * 1024;

export function useProfileFlow() {
  const queryClient = useQueryClient();
  const query = useProfileDetails();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [editingWindow, setEditingWindow] = useState(false);
  const showMutationError = (error: unknown) =>
    message.error(getApiErrorMessage(error));

  const save = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me, data);
      setEditingProfile(false);
      message.success("Đã cập nhật hồ sơ.");
    },
    onError: showMutationError,
  });
  const bank = useMutation({
    mutationFn: updateTeacherBank,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me, data);
      setEditingBank(false);
      message.success("Đã cập nhật thông tin ngân hàng.");
    },
    onError: showMutationError,
  });
  const teaching = useMutation({
    mutationFn: updateTeachingWindow,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me, data);
      setEditingWindow(false);
      message.success("Đã cập nhật khung giờ dạy.");
    },
    onError: showMutationError,
  });
  const avatar = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: ({ avatarUrl }) => {
      queryClient.setQueryData(profileKeys.me, (current: typeof query.data) =>
        current ? { ...current, avatarUrl } : current,
      );
      message.success("Cập nhật ảnh đại diện thành công.");
    },
    onError: showMutationError,
  });

  const selectAvatar = () => avatarInputRef.current?.click();
  const uploadSelectedAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!avatarTypes.has(file.type)) {
      message.error("Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc GIF.");
      return;
    }
    if (file.size > maximumAvatarBytes) {
      message.error("Dung lượng ảnh tối đa là 5MB.");
      return;
    }
    avatar.mutate(file);
  };

  return {
    query,
    save,
    bank,
    teaching,
    avatar,
    avatarInputRef,
    selectAvatar,
    uploadSelectedAvatar,
    editingProfile,
    setEditingProfile,
    editingBank,
    setEditingBank,
    editingWindow,
    setEditingWindow,
  };
}
