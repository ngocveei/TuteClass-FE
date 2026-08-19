import type { ClassInvitationDto, InvitationStatusType } from '../types/classInvitation.types';

export function getInvitationStatus(invitation: ClassInvitationDto): InvitationStatusType {
  if (!invitation.isActive) return 'Inactive';
  if (invitation.expiresAt !== null && Date.parse(invitation.expiresAt) <= Date.now()) {
    return 'Expired';
  }
  if (invitation.maxUses !== null && invitation.usedCount >= invitation.maxUses) {
    return 'MaxUsesReached';
  }
  return 'Active';
}

export function formatExpiryDateTime(expiresAtUtc: string | null): string {
  if (!expiresAtUtc) return 'Không có hạn';
  try {
    const date = new Date(expiresAtUtc);
    if (Number.isNaN(date.getTime())) return 'Không có hạn';

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };

    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  } catch {
    return 'Không có hạn';
  }
}
