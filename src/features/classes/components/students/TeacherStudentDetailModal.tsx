import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Alert, Modal, Spin, Tabs } from "antd";
import type { TeacherStudentDetail } from "@/features/classes/types/classStudent.types";

export function TeacherStudentDetailModal({
  detail,
  isLoading,
  error,
  onClose,
  onRetry,
}: {
  detail?: TeacherStudentDetail;
  isLoading: boolean;
  error: Error | null;
  onClose(): void;
  onRetry(): void;
}) {
  return (
    <Modal
      open
      title={null}
      footer={null}
      width={900}
      onCancel={onClose}
      className="teacher-student-detail"
    >
      {isLoading && (
        <div className="teacher-student-detail__loading">
          <Spin size="large" />
        </div>
      )}
      {error && (
        <Alert
          type="error"
          showIcon
          message={error.message}
          action={
            <button type="button" onClick={onRetry}>
              Thử lại
            </button>
          }
        />
      )}
      {detail && (
        <>
          <header className="teacher-student-detail__header">
            <div className="teacher-student-detail__avatar">
              {detail.avatarUrl ? (
                <img src={detail.avatarUrl} alt="" />
              ) : (
                detail.initials
              )}
            </div>
            <div>
              <h2>{detail.fullName}</h2>
              <p>
                <MailOutlined /> {detail.email}
              </p>
              <p>
                <PhoneOutlined /> {detail.phone || "Chưa cập nhật"} ·{" "}
                <CalendarOutlined /> Tham gia{" "}
                {new Intl.DateTimeFormat("vi-VN").format(
                  new Date(detail.joinedAt),
                )}
              </p>
              <span
                className={`teacher-student-list__status teacher-student-list__status--${detail.enrollmentStatus.toLowerCase()}`}
              >
                {detail.enrollmentLabel}
              </span>
            </div>
          </header>
          <section className="teacher-student-detail__profile">
            <div>
              <small>Lớp học</small>
              <strong>
                <TeamOutlined /> {detail.className}
              </strong>
            </div>
            <div>
              <small>Khối lớp</small>
              <strong>{detail.gradeLevel}</strong>
            </div>
            <div>
              <small>Trường học</small>
              <strong>{detail.profile.schoolName || "Chưa cập nhật"}</strong>
            </div>
            <div>
              <small>Phụ huynh</small>
              <strong>{detail.profile.parentName || "Chưa cập nhật"}</strong>
            </div>
          </section>
          <Tabs
            items={[
              "Tổng quan",
              "Tiến độ",
              "Bài tập",
              "Trao đổi",
              "Học phí",
              "Ghi chú",
            ].map((label) => ({
              key: label,
              label,
              children: (
                <div className="teacher-student-detail__unavailable">
                  <TeamOutlined />
                  <h3>{label}</h3>
                  <p>Chưa có dữ liệu từ Backend cho nội dung này.</p>
                </div>
              ),
            }))}
          />
        </>
      )}
    </Modal>
  );
}
