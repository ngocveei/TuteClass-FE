export interface TeacherClassMineDto {
  readonly classId?: string;
  readonly className?: string | null;
  readonly imageUrl?: string | null;
  readonly pendingApprovalCount?: number;
  readonly status?: string | null;
  readonly studentCount?: number;
}
export type TeacherClassTone = 'amber' | 'blue' | 'rose' | 'violet';
export type ClassStatusFilter = 'All' | 'Active' | 'Completed';
export type TeacherClassStatus = Exclude<ClassStatusFilter, 'All'>;

export interface TeacherOwnedClass {
  classId: string;
  className: string;
  studentCount: number;
  imageUrl: string | null;
  status: TeacherClassStatus;
  tone: TeacherClassTone;
}

export interface TeacherClassFilterController {
  status: ClassStatusFilter;
  classes: TeacherOwnedClass[];
  isLoading: boolean;
  error: Error | null;
  cycleStatus: () => void;
  retry: () => void;
}
