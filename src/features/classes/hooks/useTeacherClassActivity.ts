
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { teacherClassKeys } from '@/features/classes/hooks/teacherClassKeys';
import { teacherClassActivityApi } from '../api/classActivity.api';
import type {
  NoteFormValues,
  TeacherClassActivityController,
  TeacherClassTodo,
  TodoFormValues,
} from '../types/classActivity.types';

export function useTeacherClassActivity(classId: string | null): TeacherClassActivityController {
  const queryClient = useQueryClient();
  const enabled = classId !== null;
  const notesQuery = useQuery({
    queryKey: classId ? teacherClassKeys.notes(classId) : ['teacher-classes', 'none', 'notes'],
    queryFn: () => teacherClassActivityApi.getNotes(classId!),
    enabled,
    retry: (attempt, error) => {
      const status = (error as { response?: { status?: number } }).response?.status;
      return status !== 401 && status !== 403 && status !== 404 && attempt < 1;
    },
  });
  const todosQuery = useQuery({
    queryKey: classId ? teacherClassKeys.todos(classId) : ['teacher-classes', 'none', 'todos'],
    queryFn: () => teacherClassActivityApi.getTodos(classId!),
    enabled,
    retry: (attempt, error) => {
      const status = (error as { response?: { status?: number } }).response?.status;
      return status !== 401 && status !== 403 && status !== 404 && attempt < 1;
    },
  });

  const invalidate = useCallback(async () => {
    if (!classId) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: teacherClassKeys.notes(classId) }),
      queryClient.invalidateQueries({ queryKey: teacherClassKeys.todos(classId) }),
    ]);
  }, [classId, queryClient]);

  const createTodoMutation = useMutation({
    mutationFn: (values: TodoFormValues) => teacherClassActivityApi.createTodo(classId!, values.title.trim(), values.dueAt),
    onSuccess: invalidate,
  });
  const updateTodoMutation = useMutation({
    mutationFn: ({ todo, values }: { todo: TeacherClassTodo; values: TodoFormValues }) =>
      teacherClassActivityApi.updateTodo(classId!, todo.todoId, values.title.trim(), todo.isCompleted, values.dueAt),
    onSuccess: invalidate,
  });
  const toggleTodoMutation = useMutation({
    mutationFn: (todo: TeacherClassTodo) =>
      teacherClassActivityApi.updateTodo(classId!, todo.todoId, todo.title, !todo.isCompleted, todo.dueAt),
    onSuccess: invalidate,
  });
  const deleteTodoMutation = useMutation({
    mutationFn: (todoId: string) => teacherClassActivityApi.deleteTodo(classId!, todoId),
    onSuccess: invalidate,
  });
  const createNoteMutation = useMutation({
    mutationFn: (values: NoteFormValues) => teacherClassActivityApi.createNote(classId!, values.content.trim()),
    onSuccess: invalidate,
  });
  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, values }: { noteId: string; values: NoteFormValues }) =>
      teacherClassActivityApi.updateNote(classId!, noteId, values.content.trim()),
    onSuccess: invalidate,
  });
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: string) => teacherClassActivityApi.deleteNote(classId!, noteId),
    onSuccess: invalidate,
  });

  const mutations = [createTodoMutation, updateTodoMutation, toggleTodoMutation, deleteTodoMutation, createNoteMutation, updateNoteMutation, deleteNoteMutation];
  const mutationError = mutations.find((mutation) => mutation.error instanceof Error)?.error;

  return {
    todos: todosQuery.data ?? [],
    notes: notesQuery.data ?? [],
    isLoading: notesQuery.isLoading || todosQuery.isLoading,
    error: notesQuery.error instanceof Error ? notesQuery.error : todosQuery.error instanceof Error ? todosQuery.error : null,
    mutationError: mutationError instanceof Error ? mutationError : null,
    isMutating: mutations.some((mutation) => mutation.isPending),
    retry: () => { void notesQuery.refetch(); void todosQuery.refetch(); },
    createTodo: async (values) => { await createTodoMutation.mutateAsync(values); },
    updateTodo: async (todo, values) => { await updateTodoMutation.mutateAsync({ todo, values }); },
    toggleTodo: async (todo) => { await toggleTodoMutation.mutateAsync(todo); },
    deleteTodo: async (todoId) => { await deleteTodoMutation.mutateAsync(todoId); },
    createNote: async (values) => { await createNoteMutation.mutateAsync(values); },
    updateNote: async (noteId, values) => { await updateNoteMutation.mutateAsync({ noteId, values }); },
    deleteNote: async (noteId) => { await deleteNoteMutation.mutateAsync(noteId); },
  };
}

