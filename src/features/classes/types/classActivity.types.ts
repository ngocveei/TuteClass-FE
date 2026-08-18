export interface ClassNoteDto {
  readonly noteId?: string;
  readonly classId?: string;
  readonly content?: string | null;
  readonly createdAt?: string;
  readonly updatedAt?: string | null;
}

export interface ClassTodoDto {
  readonly todoId?: string;
  readonly classId?: string;
  readonly title?: string | null;
  readonly isCompleted?: boolean;
  readonly dueAt?: string | null;
  readonly createdAt?: string;
  readonly updatedAt?: string | null;
}

export interface CreateClassNoteRequestDto { content: string }
export interface UpdateClassNoteRequestDto { content: string }
export interface CreateClassTodoRequestDto { title: string; dueAt: string | null }
export interface UpdateClassTodoRequestDto { title: string; isCompleted: boolean; dueAt: string | null }

export interface TeacherClassNote {
  noteId: string;
  classId: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface TeacherClassTodo {
  todoId: string;
  classId: string;
  title: string;
  isCompleted: boolean;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface TodoFormValues {
  title: string;
  dueAt: string | null;
}

export interface NoteFormValues {
  content: string;
}

export interface TeacherClassActivityController {
  todos: TeacherClassTodo[];
  notes: TeacherClassNote[];
  isLoading: boolean;
  error: Error | null;
  mutationError: Error | null;
  isMutating: boolean;
  retry: () => void;
  createTodo: (values: TodoFormValues) => Promise<void>;
  updateTodo: (todo: TeacherClassTodo, values: TodoFormValues) => Promise<void>;
  toggleTodo: (todo: TeacherClassTodo) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  createNote: (values: NoteFormValues) => Promise<void>;
  updateNote: (noteId: string, values: NoteFormValues) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
}
