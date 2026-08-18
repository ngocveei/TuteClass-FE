import { message } from 'antd';
import { useMemo, useState } from 'react';
import { useClassInvitationsQuery, useCreateInvitationMutation, useUpdateInvitationMutation } from './useClassInvitations';
import type { ClassInvitationDto } from '../types/classInvitation.types';
import { ClassSettingsApiError } from '../types/classSettings.errors';
import { formatExpiryDateTime, getInvitationStatus } from '../utils/classInvitation.utils';

export { formatExpiryDateTime, getInvitationStatus };

export function toISOWithOffset(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return null;

  // Adjust to UTC+07:00 string
  const tzOffset = 7 * 60; // offset in minutes for +07:00
  const localTime = d.getTime();
  const targetTime = localTime + (tzOffset + d.getTimezoneOffset()) * 60000;
  const targetDate = new Date(targetTime);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = targetDate.getFullYear();
  const month = pad(targetDate.getMonth() + 1);
  const day = pad(targetDate.getDate());
  const hours = pad(targetDate.getHours());
  const minutes = pad(targetDate.getMinutes());
  const seconds = pad(targetDate.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
}

export function useInvitationFlow(classId: string | undefined) {
  const [messageApi, messageContextHolder] = message.useMessage();

  // React Query
  const { data, isLoading, isError, refetch } = useClassInvitationsQuery(classId);
  const createMutation = useCreateInvitationMutation();
  const updateMutation = useUpdateInvitationMutation();

  // Create Form State
  const [newMaxUses, setNewMaxUses] = useState<string>('');
  const [newExpiresAt, setNewExpiresAt] = useState<string | null>(null);

  // Edit Modal State
  const [editingInvitation, setEditingInvitation] = useState<ClassInvitationDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMaxUses, setEditMaxUses] = useState<string>('');
  const [editExpiresAt, setEditExpiresAt] = useState<string | null>(null);
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  // List of invitations ordered newest first
  const invitations = useMemo(() => {
    return data?.items ?? [];
  }, [data]);

  // Handlers for Creating Invitation
  const handleCreateInvitation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!classId) return;

    let parsedMaxUses: number | null = null;
    if (newMaxUses.trim() !== '') {
      const num = parseInt(newMaxUses.trim(), 10);
      if (Number.isNaN(num) || num <= 0) {
        void messageApi.error('Giới hạn lượt dùng phải là một số nguyên lớn hơn 0.');
        return;
      }
      parsedMaxUses = num;
    }

    let parsedExpiresAt: string | null = null;
    if (newExpiresAt) {
      if (Date.parse(newExpiresAt) <= Date.now()) {
        void messageApi.error('Hạn sử dụng phải là một thời điểm ở tương lai.');
        return;
      }
      parsedExpiresAt = toISOWithOffset(newExpiresAt);
    }

    try {
      await createMutation.mutateAsync({
        classId,
        payload: {
          maxUses: parsedMaxUses,
          expiresAt: parsedExpiresAt,
        },
      });
      void messageApi.success('Tạo mã tham gia mới thành công!');
      setNewMaxUses('');
      setNewExpiresAt(null);
    } catch (err) {
      if (err instanceof ClassSettingsApiError) {
        void messageApi.error(err.message);
      } else {
        void messageApi.error('Không thể tạo mã tham gia. Vui lòng thử lại.');
      }
    }
  };

  // Clipboard Copy Actions
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      void messageApi.success(`Đã sao chép mã mời [${code}]!`);
    } catch {
      void messageApi.error('Không thể sao chép mã.');
    }
  };

  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      void messageApi.success('Đã sao chép đường dẫn tham gia!');
    } catch {
      void messageApi.error('Không thể sao chép link.');
    }
  };

  // Edit Modal Handlers
  const openEditModal = (invitation: ClassInvitationDto) => {
    setEditingInvitation(invitation);
    setEditMaxUses(invitation.maxUses !== null ? invitation.maxUses.toString() : '');
    setEditExpiresAt(invitation.expiresAt);
    setEditIsActive(invitation.isActive);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingInvitation(null);
  };

  const handleUpdateInvitation = async () => {
    if (!classId || !editingInvitation) return;

    let parsedMaxUses: number | null = null;
    if (editMaxUses.trim() !== '') {
      const num = parseInt(editMaxUses.trim(), 10);
      if (Number.isNaN(num) || num <= 0) {
        void messageApi.error('Giới hạn lượt dùng phải lớn hơn 0.');
        return;
      }
      if (num < editingInvitation.usedCount) {
        void messageApi.error(
          `Giới hạn lượt dùng (${num}) không được nhỏ hơn số lượt đã dùng (${editingInvitation.usedCount}).`,
        );
        return;
      }
      parsedMaxUses = num;
    }

    let parsedExpiresAt: string | null = null;
    if (editExpiresAt) {
      // Only check future if expiresAt was modified or is non-null
      if (editExpiresAt !== editingInvitation.expiresAt && Date.parse(editExpiresAt) <= Date.now()) {
        void messageApi.error('Hạn sử dụng phải là thời điểm ở tương lai.');
        return;
      }
      parsedExpiresAt = toISOWithOffset(editExpiresAt);
    }

    try {
      await updateMutation.mutateAsync({
        classId,
        invitationId: editingInvitation.invitationId,
        payload: {
          maxUses: parsedMaxUses,
          expiresAt: parsedExpiresAt,
          isActive: editIsActive,
        },
      });
      void messageApi.success('Cập nhật thông tin mã tham gia thành công!');
      closeEditModal();
    } catch (err) {
      if (err instanceof ClassSettingsApiError) {
        void messageApi.error(err.message);
      } else {
        void messageApi.error('Không thể cập nhật mã tham gia. Vui lòng thử lại.');
      }
    }
  };

  // Quick Toggle Active Switch
  const toggleActive = async (invitation: ClassInvitationDto) => {
    if (!classId) return;

    try {
      await updateMutation.mutateAsync({
        classId,
        invitationId: invitation.invitationId,
        payload: {
          maxUses: invitation.maxUses,
          expiresAt: invitation.expiresAt,
          isActive: !invitation.isActive,
        },
      });
      void messageApi.success(
        invitation.isActive ? 'Đã vô hiệu hóa mã tham gia.' : 'Đã kích hoạt lại mã tham gia.',
      );
    } catch (err) {
      if (err instanceof ClassSettingsApiError) {
        void messageApi.error(err.message);
      } else {
        void messageApi.error('Không thể thay đổi trạng thái mã mời.');
      }
    }
  };

  return {
    classId: classId ?? '',
    messageContextHolder,
    invitations,
    isLoading,
    isError,
    refetch,
    // Create form
    newMaxUses,
    setNewMaxUses,
    newExpiresAt,
    setNewExpiresAt,
    isCreating: createMutation.isPending,
    handleCreateInvitation,
    // Clipboard
    copyCode,
    copyLink,
    // Edit Modal
    editingInvitation,
    isEditModalOpen,
    editMaxUses,
    setEditMaxUses,
    editExpiresAt,
    setEditExpiresAt,
    editIsActive,
    setEditIsActive,
    isUpdating: updateMutation.isPending,
    openEditModal,
    closeEditModal,
    handleUpdateInvitation,
    toggleActive,
  };
}


