import { message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { teacherOverviewPath } from "@/shared/constants/routes";
import { ClassSettingsApiError } from "../types/classSettings.errors";
import {
  SESSION_DURATION_LIMITS,
  validateSessionDurationMinutes,
} from "../utils/classSettings.utils";
import type {
  ClassSettings,
  ClassSettingsFlowController,
  ClassStatus,
  FeeType,
  GradeLevel,
  UpdateClassSettingsRequest,
} from "../types/classSettings.types";
import {
  useClassSettingsQuery,
  useDeleteClassMutation,
  useUpdateClassSettingsMutation,
} from "./useClassSettingsQueries";
import { useInvitationFlow } from "./useInvitationFlow";
import { useCreateClassOptions, useUploadClassImage } from "./useCreateClass";

export function useClassSettings(
  classId: string | undefined,
): ClassSettingsFlowController {
  const safeClassId = classId || "";
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const invitationFlow = useInvitationFlow(safeClassId);

  const [activeTab, setActiveTabState] = useState<"settings" | "invitation">(
    location.hash === "#invite-settings" ? "invitation" : "settings",
  );

  useEffect(() => {
    if (location.hash === "#invite-settings") {
      setActiveTabState("invitation");
    } else {
      setActiveTabState("settings");
    }
  }, [location.hash]);

  const setActiveTab = (tab: "settings" | "invitation") => {
    setActiveTabState(tab);
    if (tab === "invitation") {
      navigate(`#invite-settings`, { replace: true });
    } else {
      navigate(`#`, { replace: true });
    }
  };

  const { data, isLoading, isError, error } =
    useClassSettingsQuery(safeClassId);
  const updateMutation = useUpdateClassSettingsMutation();
  const deleteMutation = useDeleteClassMutation();
  const optionsQuery = useCreateClassOptions();
  const uploadImageMutation = useUploadClassImage();

  // Form states
  const [className, setClassName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("Grade9");
  const [description, setDescription] = useState("");
  const [feeType, setFeeTypeState] = useState<FeeType>("Monthly");
  const [feeAmount, setFeeAmount] = useState(500000);
  const [status, setStatus] = useState<ClassStatus>("Active");
  const [settings, setSettings] = useState<ClassSettings>({
    requireStudentApproval: true,
    allowStudentLeave: false,
    allowStudentViewGrades: true,
    allowFeedActivity: true,
    sessionDurationMinutes: SESSION_DURATION_LIMITS.defaultValue,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Sync data from GET query
  useEffect(() => {
    if (data && data.classId === safeClassId) {
      setClassName(data.className);
      setImageUrl(data.imageUrl);
      setPreviewUrl(data.imageUrl);
      setGradeLevel(data.gradeLevel);
      setDescription(data.description || "");
      setFeeTypeState(data.feeType);
      setFeeAmount(data.feeType === "Free" ? 0 : data.feeAmount);
      setStatus(data.status);
      setSettings({
        requireStudentApproval: Boolean(data.settings?.requireStudentApproval),
        allowStudentLeave: Boolean(data.settings?.allowStudentLeave),
        allowStudentViewGrades: Boolean(data.settings?.allowStudentViewGrades),
        allowFeedActivity: Boolean(data.settings?.allowFeedActivity),
        sessionDurationMinutes: data.settings.sessionDurationMinutes,
      });
      setFieldErrors({});
    }
  }, [data, safeClassId]);

  const setFeeType = (newType: FeeType) => {
    setFeeTypeState(newType);
    if (newType === "Free") {
      setFeeAmount(0);
    } else if (feeAmount === 0) {
      setFeeAmount(500000);
    }
  };

  // Kiểm tra ngay khi Teacher nhập để không phải chờ đến lúc bấm lưu mới thấy lỗi.
  const handleSessionDurationChange = (value: number | null) => {
    const sessionDurationMinutes = typeof value === "number" ? value : 0;
    const validationError = validateSessionDurationMinutes(
      sessionDurationMinutes,
    );

    setSettings((current) => ({ ...current, sessionDurationMinutes }));
    setFieldErrors((current) => {
      const otherErrors = { ...current };
      delete otherErrors.sessionDurationMinutes;
      return validationError
        ? { ...otherErrors, sessionDurationMinutes: [validationError] }
        : otherErrors;
    });
  };

  const handleReset = () => {
    if (data) {
      setClassName(data.className);
      setImageUrl(data.imageUrl);
      setPreviewUrl(data.imageUrl);
      setGradeLevel(data.gradeLevel);
      setDescription(data.description || "");
      setFeeTypeState(data.feeType);
      setFeeAmount(data.feeAmount);
      setStatus(data.status);
      setSettings(data.settings);
      setFieldErrors({});
    }
  };

  const handleImageSelect = async (file: File) => {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      messageApi.error(
        "Định dạng ảnh không hợp lệ. Chỉ chấp nhận .jpg, .png, .webp.",
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      messageApi.error("Dung lượng ảnh vượt quá 5 MB.");
      return;
    }

    try {
      const newUrl = await uploadImageMutation.mutateAsync(file);
      setImageUrl(newUrl);
      setPreviewUrl(newUrl);
      messageApi.success("Tải ảnh đại diện lớp thành công!");
    } catch (err) {
      messageApi.error(
        err instanceof Error ? err.message : "Không thể tải ảnh lên.",
      );
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setPreviewUrl(null);
    messageApi.info("Đã bỏ ảnh đại diện lớp.");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFieldErrors({});

    const trimmedName = className.trim();
    const errors: Record<string, string[]> = {};

    if (!trimmedName) {
      errors.className = ["Vui lòng nhập tên lớp."];
    }
    if (feeType !== "Free" && feeAmount <= 0) {
      errors.feeAmount = [
        "Số tiền học phí phải lớn hơn 0 khi chọn Theo tháng hoặc Theo buổi.",
      ];
    }
    const sessionDurationError = validateSessionDurationMinutes(
      settings.sessionDurationMinutes,
    );
    if (sessionDurationError)
      errors.sessionDurationMinutes = [sessionDurationError];

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      messageApi.error("Vui lòng kiểm tra lại thông tin đã nhập.");
      return;
    }

    const payload: UpdateClassSettingsRequest = {
      className: trimmedName,
      imageUrl,
      gradeLevel,
      description: description.trim() || null,
      feeType,
      feeAmount: feeType === "Free" ? 0 : feeAmount,
      status,
      settings,
    };

    try {
      await updateMutation.mutateAsync({
        classId: safeClassId,
        request: payload,
      });
      messageApi.success("Cập nhật cài đặt lớp thành công!");
    } catch (err) {
      if (err instanceof ClassSettingsApiError) {
        if (err.status === 409) {
          setFieldErrors({ className: ["Bạn đã có một lớp với tên này."] });
          messageApi.error("Tên lớp đã bị trùng lặp.");
        } else if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
          messageApi.error("Dữ liệu không hợp lệ.");
        } else {
          messageApi.error(err.message);
        }
      } else {
        messageApi.error(
          err instanceof Error
            ? err.message
            : "Không thể cập nhật cài đặt lớp.",
        );
      }
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(safeClassId);
      messageApi.success("Đã xóa lớp học thành công.");
      setIsDeleteModalOpen(false);
      navigate("/classes", { replace: true });
    } catch (err) {
      messageApi.error(
        err instanceof Error ? err.message : "Không thể xóa lớp học.",
      );
    }
  };

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Không thể tải thông tin cài đặt lớp."
    : null;

  return {
    classId: safeClassId,
    activeTab,
    setActiveTab,
    invitationFlow,
    isLoading,
    isError,
    errorMessage,
    data,
    gradeLevelOptions: optionsQuery.data?.gradeLevels ?? [],

    className,
    setClassName,
    imageUrl,
    previewUrl,
    gradeLevel,
    setGradeLevel,
    description,
    setDescription,
    feeType,
    setFeeType,
    feeAmount,
    setFeeAmount,
    status,
    setStatus,
    settings,
    setSettings,
    handleSessionDurationChange,

    isUploadingImage: uploadImageMutation.isPending,
    handleImageSelect,
    handleRemoveImage,
    fieldErrors,

    isSaving: updateMutation.isPending,
    handleSubmit,
    handleReset,

    isDeleteModalOpen,
    openDeleteModal: () => setIsDeleteModalOpen(true),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    isDeleting: deleteMutation.isPending,
    handleConfirmDelete,

    messageContextHolder,
    goBack: () => navigate(teacherOverviewPath(safeClassId)),
  };
}
