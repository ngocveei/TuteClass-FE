import {
  BookOutlined,
  CopyOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { DatePicker, Select, message } from "antd";
import dayjs from "dayjs";
import type {
  ClassInvitation,
  CreateClassEditableField,
  CreateClassFormValues,
  CreateClassOptions,
} from "@/features/classes/types/classCreate.types";

interface ClassPreviewCardProps {
  values: CreateClassFormValues;
  options: CreateClassOptions | null;
  imagePreviewUrl: string | null;
  createdInvitation?: ClassInvitation | null;
  onFieldChange?: <K extends CreateClassEditableField>(
    field: K,
    value: CreateClassFormValues[K],
  ) => void;
  disabled?: boolean;
  teacherName?: string;
}

export function ClassPreviewCard({
  values,
  options,
  imagePreviewUrl,
  createdInvitation,
  onFieldChange,
  disabled,
  teacherName = "Giáo viên",
}: ClassPreviewCardProps) {
  const subjectName = options?.subjects.find(
    (subject) => subject.subjectId === values.subjectId,
  )?.subjectName;
  const gradeName = options?.gradeLevels.find(
    (grade) => grade.value === values.gradeLevel,
  )?.displayLabel;
  const hasInfo = Boolean(
    values.className.trim() || values.subjectId || values.gradeLevel,
  );
  const className = values.className.trim() || "Tên lớp học";
  const description =
    values.description.trim() || "Mô tả lớp sẽ hiển thị tại đây.";

  const copyToClipboard = async (text: string | null, label: string) => {
    if (!text || text === "---------") {
      void message.info("Mã/link mời sẽ được sinh sau khi tạo lớp thành công.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      void message.success(`Đã sao chép ${label}!`);
    } catch {
      void message.error(`Không thể sao chép ${label}.`);
    }
  };

  return (
    <aside
      className="create-class-sidebar"
      aria-label="Xem trước và cấu hình mã mời"
    >
      {/* Top Card: Xem trước lớp học */}
      <div className="create-class-preview-card">
        <h3 className="create-class-preview-card__title">Xem trước lớp học</h3>
        <div className="create-class-preview-card__box">
          <div className="create-class-preview-card__top">
            <div className="create-class-preview-card__icon-box">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Xem trước ảnh lớp"
                  className="create-class-preview-card__img"
                />
              ) : (
                <BookOutlined className="create-class-preview-card__icon" />
              )}
            </div>
            <span
              className={`create-class-preview-card__badge ${hasInfo ? "is-filled" : ""}`}
            >
              {hasInfo ? "LỚP MỚI" : "CHƯA CÓ THÔNG TIN"}
            </span>
          </div>

          <h4 className="create-class-preview-card__name">{className}</h4>

          <div className="create-class-preview-card__tags">
            <span className="preview-tag">{subjectName || "Môn học"}</span>
            <span className="preview-tag-dot">•</span>
            <span className="preview-tag">{gradeName || "Khối lớp"}</span>
          </div>

          <p className="create-class-preview-card__desc">{description}</p>

          <div className="create-class-preview-card__footer">
            <span className="create-class-preview-card__teacher-label">
              <UserOutlined /> Giáo viên
            </span>
            <strong className="create-class-preview-card__teacher-name">
              {teacherName}
            </strong>
          </div>
        </div>
      </div>

      {/* Bottom Card: Tạo mã mời học sinh (tùy chọn) */}
      <div className="create-class-invite-card">
        <div className="create-class-invite-card__header">
          <h3>Tạo mã mời học sinh (tùy chọn)</h3>
          <p>Tạo mã hoặc link để học sinh dễ dàng tham gia lớp.</p>
        </div>

        <div className="create-class-invite-card__form">
          <div className="create-class-invite-card__field">
            <label htmlFor="create-class-max-uses">Số lượt tối đa</label>
            <Select
              id="create-class-max-uses"
              aria-label="Số lượt tối đa"
              value={
                values.maxUses === null ? "unlimited" : String(values.maxUses)
              }
              disabled={disabled}
              placeholder="Để trống nếu không giới hạn"
              onChange={(value) => {
                const maxUsesVal =
                  value === "unlimited" ? null : Number.parseInt(value, 10);
                onFieldChange?.("maxUses", maxUsesVal);
              }}
              options={[
                { value: "unlimited", label: "Để trống nếu không giới hạn" },
                { value: "5", label: "5 lượt" },
                { value: "10", label: "10 lượt (Tối đa 10 học sinh)" },
                { value: "20", label: "20 lượt" },
                { value: "50", label: "50 lượt" },
                { value: "100", label: "100 lượt" },
              ]}
            />
            <span className="create-class-invite-card__hint">
              Ví dụ: 10 (tối đa 10 học sinh dùng được)
            </span>
          </div>

          <div className="create-class-invite-card__field">
            <label htmlFor="create-class-expires-at">Hạn sử dụng</label>
            <DatePicker
              id="create-class-expires-at"
              aria-label="Hạn sử dụng"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày hết hạn"
              disabled={disabled}
              value={values.expiresAt ? dayjs(values.expiresAt) : null}
              disabledDate={(current) =>
                current && current.isBefore(dayjs().startOf("day"))
              }
              onChange={(date) => {
                onFieldChange?.(
                  "expiresAt",
                  date ? date.endOf("day").toISOString() : null,
                );
              }}
              style={{ width: "100%" }}
            />
            <span className="create-class-invite-card__hint">
              Để trống nếu không hết hạn
            </span>
          </div>
        </div>

        {/* Box xem trước mã mời */}
        <div className="create-class-invite-preview">
          <div className="create-class-invite-preview__header">
            <span>Xem trước mã mời (sẽ sinh sau khi tạo lớp)</span>
          </div>

          <div className="create-class-invite-preview__grid">
            <div className="create-class-invite-preview__col">
              <span className="create-class-invite-preview__label">Mã mời</span>
              <div className="create-class-invite-preview__value-row">
                <span className="create-class-invite-preview__code">
                  {createdInvitation?.inviteCode ?? "---------"}
                </span>
                <button
                  type="button"
                  aria-label="Sao chép mã mời"
                  className="create-class-invite-preview__copy-btn"
                  onClick={() =>
                    void copyToClipboard(
                      createdInvitation?.inviteCode ?? null,
                      "mã mời",
                    )
                  }
                >
                  <CopyOutlined />
                </button>
              </div>
            </div>

            <div className="create-class-invite-preview__col">
              <span className="create-class-invite-preview__label">
                Link mời
              </span>
              <div className="create-class-invite-preview__value-row">
                <span className="create-class-invite-preview__link">
                  {createdInvitation?.inviteLink ?? "---------"}
                </span>
                <button
                  type="button"
                  aria-label="Sao chép link mời"
                  className="create-class-invite-preview__copy-btn"
                  onClick={() =>
                    void copyToClipboard(
                      createdInvitation?.inviteLink ?? null,
                      "link mời",
                    )
                  }
                >
                  <CopyOutlined />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="create-class-sidebar__lock-hint">
        <LockOutlined /> Chỉ giáo viên mới có thể tạo mã mời và quản lý lớp học.
      </p>
    </aside>
  );
}
