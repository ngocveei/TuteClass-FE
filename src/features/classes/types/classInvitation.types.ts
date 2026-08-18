export interface ClassInvitationDto {
  invitationId: string;
  classId: string;
  inviteCode: string;
  inviteToken: string;
  inviteLink: string;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdByUserId: string;
  createdAt: string;
}

export interface ClassInvitationsListDto {
  classId: string;
  className: string;
  items: ClassInvitationDto[];
}

export interface CreateInvitationRequest {
  maxUses?: number | null;
  expiresAt?: string | null;
}

export interface UpdateInvitationRequest {
  maxUses?: number | null;
  expiresAt?: string | null;
  isActive: boolean;
}

export type InvitationStatusType = 'Active' | 'MaxUsesReached' | 'Expired' | 'Inactive';

export interface InvitationFlowController {
  classId: string;
  invitations: ClassInvitationDto[];
  isLoading: boolean;
  isError: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  newMaxUses: string;
  setNewMaxUses: (val: string) => void;
  newExpiresAt: string | null;
  setNewExpiresAt: (val: string | null) => void;
  isEditModalOpen: boolean;
  editingInvitation: ClassInvitationDto | null;
  editMaxUses: string;
  setEditMaxUses: (val: string) => void;
  editExpiresAt: string | null;
  setEditExpiresAt: (val: string | null) => void;
  editIsActive: boolean;
  setEditIsActive: (val: boolean) => void;
  messageContextHolder: React.ReactNode;
  handleCreateInvitation: (e: React.FormEvent) => void;
  openEditModal: (invitation: ClassInvitationDto) => void;
  closeEditModal: () => void;
  handleUpdateInvitation: () => void;
  toggleActive: (invitation: ClassInvitationDto) => void;
  copyCode: (code: string) => void;
  copyLink: (link: string) => void;
  refetch: () => void;
}

