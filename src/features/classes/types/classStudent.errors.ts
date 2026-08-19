export class TeacherStudentListApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'TeacherStudentListApiError';
    this.status = status;
  }
}

