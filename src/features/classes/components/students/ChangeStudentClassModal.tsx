import { Alert, Button, Modal, Spin } from "antd";
import {
  CheckCircleFilled,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { TeacherOwnedClass } from "@/features/classes/types/class.types";
import type { TeacherStudentRow } from "@/features/classes/types/classStudent.types";
import "./changeStudentClassModal.css";

interface ChangeStudentClassModalProps {
  student: TeacherStudentRow;
  currentClassId: string;
  currentClassName: string;
  classes: TeacherOwnedClass[];
  isSubmitting: boolean;
  error: Error | null;
  onClose: () => void;
  onSubmit: (targetClassId: string) => void;
}

const classStatusLabels: Record<string, string> = {
  Active: "Đang hoạt động",
  Completed: "Đã hoàn thành",
};

function extractSubjectAndGrade(className: string) {
  const normalized = className.trim();
  const subjects = [
    "Toán",
    "Anh",
    "Văn",
    "Lý",
    "Vật Lý",
    "Hóa",
    "Hóa Học",
    "Sinh",
    "Sinh Học",
    "Sử",
    "Lịch Sử",
    "Địa",
    "Địa Lý",
    "Tin",
    "Tin Học",
    "Tiếng Anh",
  ];
  const matchedSubject =
    subjects.find((s) => new RegExp(`\\b${s}\\b`, "i").test(normalized)) ||
    normalized.split(/\s+/)[0] ||
    "";
  const gradeMatch = normalized.match(/(?:grade\s*|khối\s*|lớp\s*)?(\d{1,2})/i);
  const matchedGrade = gradeMatch ? gradeMatch[1] : "";

  return { subject: matchedSubject.toLowerCase(), grade: matchedGrade };
}

function isSameSubjectAndGrade(nameA: string, nameB: string) {
  const metaA = extractSubjectAndGrade(nameA);
  const metaB = extractSubjectAndGrade(nameB);
  if (!metaA.subject || !metaB.subject) return true;
  return metaA.subject === metaB.subject && metaA.grade === metaB.grade;
}

export function ChangeStudentClassModal({
  student,
  currentClassId,
  currentClassName,
  classes,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: ChangeStudentClassModalProps) {
  // Filter out current class
  const availableTargetClasses = classes.filter(
    (item) => item.classId !== currentClassId,
  );
  const compatibleClasses = availableTargetClasses.filter((item) =>
    isSameSubjectAndGrade(currentClassName, item.className),
  );

  const [selectedTargetClassId, setSelectedTargetClassId] = useState<
    string | null
  >(
    compatibleClasses.length > 0
      ? compatibleClasses[0].classId
      : availableTargetClasses.length > 0
        ? availableTargetClasses[0].classId
        : null,
  );

  const selectedTargetClass =
    availableTargetClasses.find(
      (item) => item.classId === selectedTargetClassId,
    ) ?? null;
  const isSelectedCompatible = selectedTargetClass
    ? isSameSubjectAndGrade(currentClassName, selectedTargetClass.className)
    : false;

  const handleConfirm = () => {
    if (selectedTargetClassId && isSelectedCompatible) {
      onSubmit(selectedTargetClassId);
    }
  };

  return (
    <Modal
      open
      centered
      title={
        <div className="change-class-modal__header">
          <span className="change-class-modal__header-icon">
            <SwapOutlined />
          </span>
          <div>
            <h2>Đổi lớp cho học viên</h2>
            <p>Chọn lớp học mới cho học viên trong danh sách lớp của bạn</p>
          </div>
        </div>
      }
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isSubmitting}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SwapOutlined />}
          loading={isSubmitting}
          disabled={
            !selectedTargetClassId ||
            !isSelectedCompatible ||
            availableTargetClasses.length === 0
          }
          onClick={handleConfirm}
          className="change-class-modal__confirm-btn"
        >
          Xác nhận đổi lớp
        </Button>,
      ]}
      width={560}
      className="change-class-modal"
      destroyOnClose
    >
      <div className="change-class-modal__body">
        <div className="change-class-modal__student-card">
          <div className="change-class-modal__student-avatar">
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt="" />
            ) : (
              student.initials || <UserOutlined />
            )}
          </div>
          <div className="change-class-modal__student-info">
            <strong>{student.fullName}</strong>
            <small>{student.email}</small>
          </div>
          <div className="change-class-modal__current-tag">
            <span>Lớp hiện tại:</span>
            <strong>{currentClassName}</strong>
          </div>
        </div>

        {error && (
          <Alert
            type="error"
            showIcon
            message={error.message}
            className="change-class-modal__alert"
          />
        )}

        {selectedTargetClass && !isSelectedCompatible && (
          <Alert
            type="error"
            showIcon
            message="Chỉ có thể chuyển học viên giữa các lớp cùng môn học và cùng khối lớp."
            className="change-class-modal__alert"
          />
        )}

        <div className="change-class-modal__section-title">
          <span>Chọn lớp chuyển đến</span>
          <small>({availableTargetClasses.length} lớp khả dụng)</small>
        </div>

        {availableTargetClasses.length === 0 ? (
          <div className="change-class-modal__empty">
            <p>Bạn không có lớp học nào khác khả dụng để đổi.</p>
          </div>
        ) : (
          <div
            className="change-class-modal__class-list"
            role="radiogroup"
            aria-label="Danh sách lớp đích"
          >
            {availableTargetClasses.map((item) => {
              const isSelected = selectedTargetClassId === item.classId;
              const isCompatible = isSameSubjectAndGrade(
                currentClassName,
                item.className,
              );
              const tone = item.tone || "blue";
              return (
                <button
                  key={item.classId}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedTargetClassId(item.classId)}
                  className={`teacher-overview-class-card teacher-overview-class-card--${tone} ${
                    item.imageUrl
                      ? "teacher-overview-class-card--with-image"
                      : ""
                  } ${isSelected ? "is-selected" : ""} ${!isCompatible ? "is-incompatible" : ""}`}
                >
                  {isSelected && (
                    <CheckCircleFilled className="change-class-modal__selected-check" />
                  )}
                  <div className="teacher-overview-class-card__details">
                    <strong>{item.className}</strong>
                    <small>
                      <TeamOutlined /> {item.studentCount} học sinh
                    </small>
                  </div>
                  <span
                    className={`teacher-overview-class-card__status teacher-overview-class-card__status--${(
                      item.status || "active"
                    ).toLowerCase()}`}
                  >
                    {classStatusLabels[item.status] || "Đang hoạt động"}
                  </span>
                  {item.imageUrl && (
                    <img
                      className="teacher-overview-class-card__image"
                      src={item.imageUrl}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {isSubmitting && (
          <div className="change-class-modal__overlay-loading">
            <Spin size="large" tip="Đang tiến hành đổi lớp..." />
          </div>
        )}
      </div>
    </Modal>
  );
}
