export interface TeacherBank {
  bankAccountNumber?: string | null;
  bankName?: string | null;
  bankAccountHolderName?: string | null;
}

export interface TeachingWindow {
  start: string;
  end: string;
}

export interface StudentProfile {
  dateOfBirth?: string | null;
  schoolName?: string | null;
  parentName?: string | null;
  parentPhone?: string | null;
}

export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  roleName: string;
  emailVerified: boolean;
  provider: string;
  teacherBank?: TeacherBank | null;
  teachingWindow?: TeachingWindow | null;
  studentProfile?: StudentProfile | null;
}

export interface ProfileUpdate {
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  schoolName?: string;
  parentName?: string;
  parentPhone?: string;
}

export interface TeacherBankUpdate {
  bankAccountNumber: string;
  bankName: string;
  bankAccountHolderName: string;
}

export interface TeachingWindowUpdate {
  start: string;
  end: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
