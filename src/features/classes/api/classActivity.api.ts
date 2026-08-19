
import axios from 'axios';
import { apiClient } from '@/services/api/apiClient';
import { createLogger, createOperationId } from '@/services/logger';
import { classEndpoints } from '@/features/classes/api/classEndpoints';
import type {
  ClassNoteDto,
  ClassTodoDto,
  CreateClassNoteRequestDto,
  CreateClassTodoRequestDto,
  TeacherClassNote,
  TeacherClassTodo,
  UpdateClassNoteRequestDto,
  UpdateClassTodoRequestDto,
} from '../types/classActivity.types';

const logger = createLogger('TeacherClassActivity');

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Phản hồi máy chủ thiếu trường ${field}.`);
  return value.trim();
}

function requiredDate(value: unknown, field: string): string {
  const date = requiredString(value, field);
  if (Number.isNaN(Date.parse(date))) throw new Error(`Phản hồi máy chủ có ${field} không hợp lệ.`);
  return date;
}

function nullableDate(value: unknown, field: string): string | null {
  if (value === null || value === undefined) return null;
  return requiredDate(value, field);
}

export function normalizeNote(responseDto: ClassNoteDto, index: number): TeacherClassNote {
  return {
    noteId: requiredString(responseDto.noteId, `notes[${index}].noteId`),
    classId: requiredString(responseDto.classId, `notes[${index}].classId`),
    content: requiredString(responseDto.content, `notes[${index}].content`),
    createdAt: requiredDate(responseDto.createdAt, `notes[${index}].createdAt`),
    updatedAt: nullableDate(responseDto.updatedAt, `notes[${index}].updatedAt`),
  };
}

export function normalizeTodo(responseDto: ClassTodoDto, index: number): TeacherClassTodo {
  if (typeof responseDto.isCompleted !== 'boolean') throw new Error(`Phản hồi máy chủ thiếu trường todos[${index}].isCompleted.`);
  return {
    todoId: requiredString(responseDto.todoId, `todos[${index}].todoId`),
    classId: requiredString(responseDto.classId, `todos[${index}].classId`),
    title: requiredString(responseDto.title, `todos[${index}].title`),
    isCompleted: responseDto.isCompleted,
    dueAt: nullableDate(responseDto.dueAt, `todos[${index}].dueAt`),
    createdAt: requiredDate(responseDto.createdAt, `todos[${index}].createdAt`),
    updatedAt: nullableDate(responseDto.updatedAt, `todos[${index}].updatedAt`),
  };
}

async function withActivityLog<T>(action: string, classId: string, itemId: string | undefined, work: () => Promise<T>): Promise<T> {
  const operationId = createOperationId('teacher-class-activity');
  logger.info(`${action}.started`, { classId, itemId }, operationId);
  try {
    const result = await work();
    logger.info(`${action}.succeeded`, { classId, itemId }, operationId);
    return result;
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    logger.error(`${action}.failed`, { classId, itemId, status }, operationId);
    throw error;
  }
}

export const teacherClassActivityApi = {
  async getNotes(classId: string): Promise<TeacherClassNote[]> {
    return withActivityLog('notes.get', classId, undefined, async () => {
      const response = await apiClient.get<readonly ClassNoteDto[]>(classEndpoints.notes(classId));
      if (!Array.isArray(response.data)) throw new Error('Phản hồi danh sách ghi chú không hợp lệ.');
      return response.data.map(normalizeNote);
    });
  },
  async getTodos(classId: string): Promise<TeacherClassTodo[]> {
    return withActivityLog('todos.get', classId, undefined, async () => {
      const response = await apiClient.get<readonly ClassTodoDto[]>(classEndpoints.todos(classId));
      if (!Array.isArray(response.data)) throw new Error('Phản hồi danh sách việc cần làm không hợp lệ.');
      return response.data.map(normalizeTodo);
    });
  },
  async createNote(classId: string, content: string): Promise<TeacherClassNote> {
    return withActivityLog('notes.create', classId, undefined, async () => {
      const requestDto: CreateClassNoteRequestDto = { content };
      const response = await apiClient.post<ClassNoteDto>(classEndpoints.notes(classId), requestDto);
      return normalizeNote(response.data, 0);
    });
  },
  async updateNote(classId: string, noteId: string, content: string): Promise<TeacherClassNote> {
    return withActivityLog('notes.update', classId, noteId, async () => {
      const requestDto: UpdateClassNoteRequestDto = { content };
      const response = await apiClient.put<ClassNoteDto>(classEndpoints.note(classId, noteId), requestDto);
      return normalizeNote(response.data, 0);
    });
  },
  async deleteNote(classId: string, noteId: string): Promise<void> {
    return withActivityLog('notes.delete', classId, noteId, async () => { await apiClient.delete(classEndpoints.note(classId, noteId)); });
  },
  async createTodo(classId: string, title: string, dueAt: string | null): Promise<TeacherClassTodo> {
    return withActivityLog('todos.create', classId, undefined, async () => {
      const requestDto: CreateClassTodoRequestDto = { title, dueAt };
      const response = await apiClient.post<ClassTodoDto>(classEndpoints.todos(classId), requestDto);
      return normalizeTodo(response.data, 0);
    });
  },
  async updateTodo(classId: string, todoId: string, title: string, isCompleted: boolean, dueAt: string | null): Promise<TeacherClassTodo> {
    return withActivityLog('todos.update', classId, todoId, async () => {
      const requestDto: UpdateClassTodoRequestDto = { title, isCompleted, dueAt };
      const response = await apiClient.put<ClassTodoDto>(classEndpoints.todo(classId, todoId), requestDto);
      return normalizeTodo(response.data, 0);
    });
  },
  async deleteTodo(classId: string, todoId: string): Promise<void> {
    return withActivityLog('todos.delete', classId, todoId, async () => { await apiClient.delete(classEndpoints.todo(classId, todoId)); });
  },
};

