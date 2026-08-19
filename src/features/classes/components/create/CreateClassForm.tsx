import { Alert, Button, Input, Select, Switch } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import type {
  CreateClassEditableField,
  CreateClassFormValues,
  CreateClassOptions,
  CreateClassStep,
  CreateClassValidationErrors,
} from "@/features/classes/types/classCreate.types";

const { TextArea } = Input;

interface CreateClassFormProps {
  step: CreateClassStep;
  values: CreateClassFormValues;
  options: CreateClassOptions | null;
  errors: CreateClassValidationErrors;
  generalError: string | null;
  traceId: string | null;
  imagePreviewUrl: string | null;
  isImageValidating: boolean;
  isOptionsLoading: boolean;
  isOptionsError: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  onFieldChange: <K extends CreateClassEditableField>(
    field: K,
    value: CreateClassFormValues[K],
  ) => void;
  onImageChange: (file: File | null) => Promise<void>;
  onClearInvalidImageSelection: () => void;
  onNext: () => void;
  onBack: () => void;
  onRetryOptions: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function CreateClassForm({
  step,
  values,
  options,
  errors,
  generalError,
  traceId,
  imagePreviewUrl,
  isImageValidating,
  isOptionsLoading,
  isOptionsError,
  isSubmitting,
  isUploading,
  onFieldChange,
  onImageChange,
  onClearInvalidImageSelection,
  onNext,
  onBack,
  onRetryOptions,
  onSubmit,
  onCancel,
}: CreateClassFormProps) {
  return (
    <section
      className="create-class-form-card"
      aria-labelledby="create-class-form-title"
    >
      <div
        className="create-class-form-card__stepper"
        aria-label={`Bước ${step} trên 2`}
      >
        <div
          className={`create-class-form-card__step-item ${step >= 1 ? "is-active" : ""}`}
        >
          <span className="create-class-form-card__step-num">1</span>
          <span className="create-class-form-card__step-label">
            Thông tin lớp
          </span>
        </div>
        <div
          className={`create-class-form-card__step-line ${step === 2 ? "is-active" : ""}`}
        />
        <div
          className={`create-class-form-card__step-item ${step === 2 ? "is-active" : ""}`}
        >
          <span className="create-class-form-card__step-num">2</span>
          <span className="create-class-form-card__step-label">
            Cài đặt & Mời học sinh
          </span>
        </div>
      </div>

      <div className="create-class-form-card__intro">
        <h2 id="create-class-form-title">
          {step === 1 ? "Thông tin cơ bản" : "Cài đặt lớp học"}
        </h2>
        <p>
          {step === 1
            ? "Nhập thông tin cơ bản cho lớp học của bạn."
            : "Thiết lập quyền hoạt động và tương tác của học sinh trong lớp."}
        </p>
      </div>

      {generalError && (
        <Alert
          className="create-class-form-card__alert"
          type="error"
          showIcon
          title="Chưa thể tạo lớp"
          description={generalError}
        />
      )}
      {!generalError && traceId && (
        <p className="create-class-trace">Mã tra cứu: {traceId}</p>
      )}

      {isOptionsError && step === 1 && (
        <Alert
          className="create-class-form-card__alert"
          type="error"
          showIcon
          title="Không thể tải danh mục tạo lớp"
          description={
            <Button size="small" onClick={onRetryOptions}>
              Thử lại
            </Button>
          }
        />
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (step === 1) onNext();
          else onSubmit();
        }}
        noValidate
      >
        {step === 1 ? (
          <>
            <div className="create-class-field">
              <label htmlFor="create-class-name">
                Tên lớp{" "}
                <span aria-hidden="true" className="required-star">
                  *
                </span>
              </label>
              <Input
                id="create-class-name"
                value={values.className}
                status={errors.className ? "error" : undefined}
                aria-invalid={Boolean(errors.className)}
                aria-describedby={
                  errors.className ? "create-class-name-error" : undefined
                }
                maxLength={255}
                showCount
                placeholder="Ví dụ: Toán 12A1"
                disabled={isSubmitting}
                onChange={(event) =>
                  onFieldChange("className", event.target.value)
                }
              />
              {errors.className && (
                <p
                  id="create-class-name-error"
                  className="create-class-field__error"
                >
                  {errors.className}
                </p>
              )}
            </div>

            <div className="create-class-fields-row">
              <div className="create-class-field">
                <label htmlFor="create-class-subject">
                  Môn học{" "}
                  <span aria-hidden="true" className="required-star">
                    *
                  </span>
                </label>
                <Select
                  id="create-class-subject"
                  value={values.subjectId || undefined}
                  status={errors.subjectId ? "error" : undefined}
                  aria-invalid={Boolean(errors.subjectId)}
                  aria-describedby={
                    errors.subjectId ? "create-class-subject-error" : undefined
                  }
                  placeholder="Chọn môn học"
                  loading={isOptionsLoading}
                  disabled={isSubmitting || isOptionsLoading || isOptionsError}
                  options={(options?.subjects ?? []).map((subject) => ({
                    value: subject.subjectId,
                    label: subject.subjectName,
                  }))}
                  onChange={(value) => onFieldChange("subjectId", value)}
                />
                {errors.subjectId && (
                  <p
                    id="create-class-subject-error"
                    className="create-class-field__error"
                  >
                    {errors.subjectId}
                  </p>
                )}
              </div>

              <div className="create-class-field">
                <label htmlFor="create-class-grade">
                  Khối lớp{" "}
                  <span aria-hidden="true" className="required-star">
                    *
                  </span>
                </label>
                <Select
                  id="create-class-grade"
                  value={values.gradeLevel || undefined}
                  status={errors.gradeLevel ? "error" : undefined}
                  aria-invalid={Boolean(errors.gradeLevel)}
                  aria-describedby={
                    errors.gradeLevel ? "create-class-grade-error" : undefined
                  }
                  placeholder="Chọn khối lớp"
                  loading={isOptionsLoading}
                  disabled={isSubmitting || isOptionsLoading || isOptionsError}
                  options={(options?.gradeLevels ?? []).map((grade) => ({
                    value: grade.value,
                    label: grade.displayLabel,
                  }))}
                  onChange={(value) => onFieldChange("gradeLevel", value)}
                />
                {errors.gradeLevel && (
                  <p
                    id="create-class-grade-error"
                    className="create-class-field__error"
                  >
                    {errors.gradeLevel}
                  </p>
                )}
              </div>
            </div>

            <div className="create-class-field">
              <label htmlFor="create-class-image">
                Ảnh lớp{" "}
                <span className="create-class-field__optional">
                  (không bắt buộc)
                </span>
              </label>
              <div className="create-class-dropzone">
                {imagePreviewUrl ? (
                  <div className="create-class-dropzone__preview">
                    <img src={imagePreviewUrl} alt="Ảnh lớp đã chọn" />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => void onImageChange(null)}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="create-class-image"
                    className="create-class-dropzone__content"
                  >
                    <UploadOutlined className="create-class-dropzone__icon" />
                    <span className="create-class-dropzone__text">
                      Kéo thả ảnh vào đây
                    </span>
                    <span className="create-class-dropzone__subtext">
                      {" "}
                      hoặc{" "}
                    </span>
                    <span className="create-class-dropzone__btn">Chọn ảnh</span>
                  </label>
                )}
                <input
                  id="create-class-image"
                  className="create-class-image-field__input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isSubmitting}
                  onChange={(event) => {
                    void onImageChange(event.target.files?.[0] ?? null);
                    event.target.value = "";
                  }}
                />
              </div>
              {errors.imageFile && (
                <div className="create-class-field__error">
                  <p>{errors.imageFile}</p>
                  {!values.imageFile && (
                    <Button
                      type="link"
                      size="small"
                      onClick={onClearInvalidImageSelection}
                    >
                      Bỏ ảnh lỗi
                    </Button>
                  )}
                </div>
              )}
              <span className="create-class-field__hint">
                JPG, PNG hoặc WebP; từ 10 KB đến 5 MB.
              </span>
              {isImageValidating && (
                <span className="create-class-field__hint" role="status">
                  Đang kiểm tra ảnh...
                </span>
              )}
            </div>

            <div className="create-class-field">
              <div className="create-class-field__label-row">
                <label htmlFor="create-class-description">Mô tả lớp</label>
              </div>
              <TextArea
                id="create-class-description"
                value={values.description}
                status={errors.description ? "error" : undefined}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description
                    ? "create-class-description-error"
                    : undefined
                }
                rows={4}
                maxLength={2000}
                showCount
                placeholder="Mục tiêu, nội dung chính hoặc ghi chú cho lớp học..."
                disabled={isSubmitting}
                onChange={(event) =>
                  onFieldChange("description", event.target.value)
                }
              />
              {errors.description && (
                <p
                  id="create-class-description-error"
                  className="create-class-field__error"
                >
                  {errors.description}
                </p>
              )}
            </div>

            <div className="create-class-form-card__actions">
              <Button size="large" disabled={isSubmitting} onClick={onCancel}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                disabled={isSubmitting}
              >
                Tiếp tục
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="create-class-settings" aria-label="Cài đặt lớp học">
              <SettingRow
                label="Yêu cầu phê duyệt học sinh"
                description="Giáo viên duyệt trước khi học sinh vào lớp."
                checked={values.requireStudentApproval}
                disabled={isSubmitting}
                onChange={(checked) =>
                  onFieldChange("requireStudentApproval", checked)
                }
              />
              <SettingRow
                label="Chặn học sinh tự rời lớp"
                description="Học sinh cần liên hệ giáo viên để rời lớp."
                checked={values.preventStudentLeave}
                disabled={isSubmitting}
                onChange={(checked) =>
                  onFieldChange("preventStudentLeave", checked)
                }
              />
              <SettingRow
                label="Cho phép học sinh xem bảng điểm"
                description="Học sinh có thể xem kết quả học tập của mình."
                checked={values.allowStudentViewGrades}
                disabled={isSubmitting}
                onChange={(checked) =>
                  onFieldChange("allowStudentViewGrades", checked)
                }
              />
              <SettingRow
                label="Tắt hoạt động bảng tin"
                description="Không cho đăng hoạt động mới lên bảng tin lớp."
                checked={values.disableFeed}
                disabled={isSubmitting}
                onChange={(checked) => onFieldChange("disableFeed", checked)}
              />
            </div>

            <div className="create-class-form-card__actions">
              <Button size="large" disabled={isSubmitting} onClick={onBack}>
                Quay lại
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                disabled={
                  isSubmitting || isOptionsLoading || isOptionsError || !options
                }
                aria-label={
                  isSubmitting
                    ? isUploading
                      ? "Đang tải ảnh…"
                      : "Đang tạo lớp…"
                    : "Tạo lớp học"
                }
              >
                {isUploading
                  ? "Đang tải ảnh…"
                  : isSubmitting
                    ? "Đang tạo lớp…"
                    : "Tạo lớp học"}
              </Button>
            </div>
          </>
        )}
      </form>
    </section>
  );
}

function SettingRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="create-class-setting-row">
      <div>
        <strong>{label}</strong>
        <span>{description}</span>
      </div>
      <Switch
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
}
