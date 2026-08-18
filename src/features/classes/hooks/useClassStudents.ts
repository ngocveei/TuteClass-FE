import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useSearchParams } from "react-router-dom";
import { createLogger } from "@/services/logger";
import { useTeacherClasses } from "./useTeacherClasses";
import { teacherStudentListApi } from "../api/classStudents.api";
import type {
  StudentListStatusFilter,
  TeacherStudentListController,
  TeacherStudentRow,
} from "../types/classStudent.types";

const logger = createLogger("TeacherStudentList");
const pageSize = 20;

function readPage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function readStatus(value: string | null): StudentListStatusFilter {
  return value === "Active" || value === "Left" || value === "Removed"
    ? value
    : "all";
}

export function useClassStudents(): TeacherStudentListController {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const teacherClasses = useTeacherClasses();
  const requestedClassId = searchParams.get("classId")?.trim() || null;
  const classes = useMemo(
    () => teacherClasses.data ?? [],
    [teacherClasses.data],
  );
  const selectedClass =
    classes.find((item) => item.classId === requestedClassId) ?? null;
  const status = readStatus(searchParams.get("status"));
  const page = readPage(searchParams.get("page"));
  const urlQuery = searchParams.get("q") ?? "";
  const [searchInput, setSearchInputState] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);
  const [isClassDrawerOpen, setIsClassDrawerOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  const [targetStudentForChangeClass, setTargetStudentForChangeClass] =
    useState<TeacherStudentRow | null>(null);

  const [targetStudentForRemove, setTargetStudentForRemove] =
    useState<TeacherStudentRow | null>(null);

  useEffect(() => {
    setSearchInputState(urlQuery);
  }, [urlQuery]);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedQuery(searchInput.trim()),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [searchInput]);
  useEffect(() => {
    if (!teacherClasses.data || requestedClassId) return;
    const firstClassId = classes[0]?.classId;
    if (!firstClassId) return;
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("classId", firstClassId);
      return next;
    }, { replace: true });
  }, [classes, requestedClassId, setSearchParams, teacherClasses.data]);
  useEffect(() => {
    if (!isClassDrawerOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsClassDrawerOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isClassDrawerOpen]);
  useEffect(() => {
    if (!selectedStudentId) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedStudentId(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedStudentId]);
  useEffect(() => {
    if (!targetStudentForChangeClass) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTargetStudentForChangeClass(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [targetStudentForChangeClass]);
  useEffect(() => {
    if (!targetStudentForRemove) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTargetStudentForRemove(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [targetStudentForRemove]);

  const query = useQuery({
    queryKey: [
      "teacher-class-students",
      selectedClass?.classId,
      debouncedQuery,
      status,
      page,
      pageSize,
    ],
    enabled: Boolean(selectedClass),
    retry: (attempt, error) => {
      const statusCode = (error as { status?: number }).status;
      return (
        statusCode !== 401 &&
        statusCode !== 403 &&
        statusCode !== 404 &&
        attempt < 1
      );
    },
    queryFn: () =>
      teacherStudentListApi.getStudents({
        classId: selectedClass!.classId,
        q: debouncedQuery || undefined,
        status: status === "all" ? undefined : status,
        page,
        pageSize,
      }),
  });

  const detailQuery = useQuery({
    queryKey: [
      "teacher-class-student-detail",
      selectedClass?.classId,
      selectedStudentId,
    ],
    enabled: Boolean(selectedClass && selectedStudentId),
    retry: (attempt, error) => {
      const statusCode = (error as { status?: number }).status;
      return (
        statusCode !== 401 &&
        statusCode !== 403 &&
        statusCode !== 404 &&
        attempt < 1
      );
    },
    queryFn: () =>
      teacherStudentListApi.getStudentDetail(
        selectedClass!.classId,
        selectedStudentId!,
      ),
  });

  const changeClassMutation = useMutation({
    mutationFn: ({
      sourceClassId,
      studentId,
      targetClassId,
    }: {
      sourceClassId: string;
      studentId: string;
      targetClassId: string;
    }) =>
      teacherStudentListApi.changeClass(
        sourceClassId,
        studentId,
        targetClassId,
      ),
    onSuccess: (response, variables) => {
      const student = targetStudentForChangeClass;
      void queryClient.invalidateQueries({
        queryKey: ["teacher-class-students", variables.sourceClassId],
      });
      void queryClient.invalidateQueries({ queryKey: ["teacher-classes"] });
      message.success(
        `Đã đổi lớp thành công cho học viên ${student?.fullName ?? ""} sang ${response.targetClassName}.`,
      );
      setTargetStudentForChangeClass(null);
    },
  });

  const removeStudentMutation = useMutation({
    mutationFn: ({
      classId,
      studentId,
    }: {
      classId: string;
      studentId: string;
    }) => teacherStudentListApi.removeStudent(classId, studentId),
    onSuccess: (_response, variables) => {
      const student = targetStudentForRemove;
      void queryClient.invalidateQueries({
        queryKey: ["teacher-class-students", variables.classId],
      });
      void queryClient.invalidateQueries({ queryKey: ["teacher-classes"] });
      message.success(`Đã xóa học viên ${student?.fullName ?? ""} khỏi lớp.`);
      setTargetStudentForRemove(null);
    },
    onError: (error) =>
      message.error(
        error instanceof Error
          ? error.message
          : "Không thể xóa học sinh khỏi lớp.",
      ),
  });

  const updateParams = (changes: Record<string, string | undefined>) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(changes).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      return next;
    });
  };

  const changeStudentClass = async (targetClassId: string) => {
    if (!selectedClass || !targetStudentForChangeClass) return;
    try {
      await changeClassMutation.mutateAsync({
        sourceClassId: selectedClass.classId,
        studentId: targetStudentForChangeClass.studentId,
        targetClassId,
      });
    } catch {
      // Mutation state is exposed to the modal so the user can retry.
    }
  };

  const removeStudent = async (student: TeacherStudentRow) => {
    if (!selectedClass) return;
    try {
      await removeStudentMutation.mutateAsync({
        classId: selectedClass.classId,
        studentId: student.studentId,
      });
    } catch {
      // Mutation state is exposed to the confirmation modal.
    }
  };

  return {
    classId: requestedClassId,
    isClassIdValid: Boolean(selectedClass),
    classes,
    selectedClass,
    isLoadingClasses: teacherClasses.isLoading,
    classesError:
      teacherClasses.error instanceof Error ? teacherClasses.error : null,
    isClassDrawerOpen,
    searchInput,
    status,
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error instanceof Error ? query.error : null,
    selectedStudentId,
    isStudentDetailOpen: Boolean(selectedStudentId),
    studentDetail: detailQuery.data,
    isStudentDetailLoading: detailQuery.isLoading,
    studentDetailError:
      detailQuery.error instanceof Error ? detailQuery.error : null,
    targetStudentForChangeClass,
    isChangeClassModalOpen: Boolean(targetStudentForChangeClass),
    isChangingClass: changeClassMutation.isPending,
    changeClassError:
      changeClassMutation.error instanceof Error
        ? changeClassMutation.error
        : null,
    targetStudentForRemove,
    isRemoveModalOpen: Boolean(targetStudentForRemove),
    isRemovingStudent: removeStudentMutation.isPending,
    removeStudentError:
      removeStudentMutation.error instanceof Error
        ? removeStudentMutation.error
        : null,
    setSearchInput: (value) => {
      setSearchInputState(value);
      updateParams({ q: value.trim() || undefined, page: undefined });
      logger.info("search.changed", {
        classId: requestedClassId,
        hasQuery: Boolean(value.trim()),
      });
    },
    setStatus: (value) => {
      updateParams({
        status: value === "all" ? undefined : value,
        page: undefined,
      });
      logger.info("status.changed", {
        classId: requestedClassId,
        status: value,
      });
    },
    setPage: (nextPage) =>
      updateParams({ page: nextPage === 1 ? undefined : String(nextPage) }),
    retry: () => {
      void query.refetch();
    },
    openClassDrawer: () => setIsClassDrawerOpen(true),
    closeClassDrawer: () => setIsClassDrawerOpen(false),
    selectClass: (classId) => {
      setSearchParams({ classId }, { replace: true });
      setIsClassDrawerOpen(false);
      setSelectedStudentId(null);
    },
    openStudentDetail: (studentId) => setSelectedStudentId(studentId),
    closeStudentDetail: () => setSelectedStudentId(null),
    retryStudentDetail: () => {
      void detailQuery.refetch();
    },
    openChangeClassModal: (student) => {
      setSelectedStudentId(null);
      changeClassMutation.reset();
      setTargetStudentForChangeClass(student);
    },
    closeChangeClassModal: () => {
      setTargetStudentForChangeClass(null);
      changeClassMutation.reset();
    },
    changeStudentClass,
    openRemoveStudentModal: (student) => {
      setSelectedStudentId(null);
      removeStudentMutation.reset();
      setTargetStudentForRemove(student);
    },
    closeRemoveStudentModal: () => {
      setTargetStudentForRemove(null);
      removeStudentMutation.reset();
    },
    removeStudent,
  };
}
