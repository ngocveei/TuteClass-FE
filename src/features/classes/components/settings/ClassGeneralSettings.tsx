import {
  BarChartOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CommentOutlined,
  DollarCircleOutlined,
  FlagOutlined,
  HourglassOutlined,
  InfoCircleOutlined,
  LockOutlined,
  PictureOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Input, InputNumber, Radio, Select, Switch } from "antd";
import { useRef } from "react";
import type {
  ClassSettingsFlowController,
  FeeType,
  GradeLevel,
} from "@/features/classes/types/classSettings.types";
import { SESSION_DURATION_LIMITS } from "@/features/classes/utils/classSettings.utils";

function formatVnd(value: number) {
  return value <= 0 ? "0" : new Intl.NumberFormat("vi-VN").format(value);
}

function parseVnd(formattedValue: string) {
  const digits = formattedValue.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

interface ClassGeneralSettingsProps {
  flow: ClassSettingsFlowController;
  subjectName: string;
}

export function ClassGeneralSettings({
  flow,
  subjectName,
}: ClassGeneralSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <section
        className="teacher-class-settings-card"
        aria-label="Thông tin lớp"
      >
        <div className="card-section-title">
          <InfoCircleOutlined className="icon-orange" />
          <span>THÔNG TIN LỚP</span>
        </div>
        <div className="info-grid">
          <div className="image-field-group">
            <label htmlFor="class-image-input">Ảnh lớp</label>
            <div className="image-upload-wrapper">
              <div className="image-preview-box">
                {flow.previewUrl ? (
                  <img
                    src={flow.previewUrl}
                    alt="Ảnh lớp đại diện"
                    className="class-image-img"
                  />
                ) : (
                  <div className="image-placeholder">
                    <PictureOutlined className="image-placeholder-icon" />
                    <span>Chưa có ảnh</span>
                  </div>
                )}
              </div>
              <div className="image-action-buttons">
                <input
                  ref={fileInputRef}
                  id="class-image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="class-image-file-input"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void flow.handleImageSelect(file);
                  }}
                />
                <Button
                  type="default"
                  icon={<UploadOutlined />}
                  loading={flow.isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-change-image"
                >
                  Đổi ảnh
                </Button>
                <Button
                  type="default"
                  danger
                  onClick={flow.handleRemoveImage}
                  disabled={!flow.imageUrl && !flow.previewUrl}
                  className="btn-remove-image"
                >
                  Xóa ảnh
                </Button>
                <p className="image-hint">
                  JPG, PNG, WEBP
                  <br />
                  Tối đa 5 MB
                </p>
              </div>
            </div>
          </div>

          <div className="fields-col">
            <div className="form-item">
              <label htmlFor="class-name-input">
                Tên lớp <span className="req">*</span>
              </label>
              <Input
                id="class-name-input"
                value={flow.className}
                onChange={(event) => flow.setClassName(event.target.value)}
                maxLength={255}
                placeholder="Nhập tên lớp..."
                status={flow.fieldErrors.className ? "error" : ""}
              />
              <div className="field-footer">
                {flow.fieldErrors.className ? (
                  <span className="field-error-msg">
                    {flow.fieldErrors.className[0]}
                  </span>
                ) : (
                  <span />
                )}
                <span className="char-counter">
                  {flow.className.length}/255
                </span>
              </div>
            </div>
            <div className="form-item">
              <label htmlFor="subject-disabled-input">Môn học</label>
              <div className="disabled-input-wrapper">
                <Input
                  id="subject-disabled-input"
                  value={subjectName}
                  disabled
                  className="subject-disabled-input"
                />
                <span className="lock-badge">
                  <LockOutlined /> Không thể sửa
                </span>
              </div>
            </div>
            <div className="form-item">
              <label htmlFor="grade-level-select">
                Khối lớp <span className="req">*</span>
              </label>
              <Select
                id="grade-level-select"
                value={flow.gradeLevel}
                onChange={(value) => flow.setGradeLevel(value as GradeLevel)}
                options={flow.gradeLevelOptions.map((option) => ({
                  value: option.value,
                  label: option.displayLabel || option.label,
                }))}
                className="grade-select"
              />
            </div>
            <div className="form-item">
              <label htmlFor="description-textarea">Mô tả</label>
              <Input.TextArea
                id="description-textarea"
                value={flow.description}
                onChange={(event) => flow.setDescription(event.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="Mô tả chi tiết về nội dung và lộ trình lớp học..."
              />
              <div className="field-footer">
                <span />
                <span className="char-counter">
                  {flow.description.length}/2000
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="settings-three-cards-grid">
        <section className="teacher-class-settings-card" aria-label="Học phí">
          <div className="card-section-title">
            <DollarCircleOutlined className="icon-orange" />
            <span>HỌC PHÍ</span>
          </div>
          <div className="form-item">
            <label>
              Hình thức học phí <span className="req">*</span>
            </label>
            <Radio.Group
              value={flow.feeType}
              onChange={(event) =>
                flow.setFeeType(event.target.value as FeeType)
              }
              className="fee-type-radio-group"
            >
              <Radio value="Free" className="fee-radio-item">
                <div className="radio-label-content">
                  <strong>Miễn phí</strong>
                  <span>Học sinh không cần đóng học phí</span>
                </div>
              </Radio>
              <Radio value="Monthly" className="fee-radio-item">
                <div className="radio-label-content">
                  <strong>Theo tháng</strong>
                  <span>Học sinh đóng học phí định kỳ hàng tháng</span>
                </div>
              </Radio>
              <Radio value="PerSession" className="fee-radio-item">
                <div className="radio-label-content">
                  <strong>Theo buổi</strong>
                  <span>Tính học phí dựa trên từng buổi học</span>
                </div>
              </Radio>
            </Radio.Group>
          </div>
          <div className="form-item">
            <label htmlFor="fee-amount-input">
              Số tiền (VNĐ) <span className="req">*</span>
            </label>
            <Input
              id="fee-amount-input"
              value={flow.feeType === "Free" ? "0" : formatVnd(flow.feeAmount)}
              onChange={(event) =>
                flow.setFeeAmount(parseVnd(event.target.value))
              }
              disabled={flow.feeType === "Free"}
              suffix="VNĐ"
              status={flow.fieldErrors.feeAmount ? "error" : ""}
            />
            <p className="fee-amount-hint">Nhập số tiền lớn hơn 0</p>
            {flow.fieldErrors.feeAmount && (
              <span className="field-error-msg">
                {flow.fieldErrors.feeAmount[0]}
              </span>
            )}
          </div>
        </section>

        <section
          className="teacher-class-settings-card"
          aria-label="Trạng thái lớp"
        >
          <div className="card-section-title">
            <FlagOutlined className="icon-orange" />
            <span>TRẠNG THÁI LỚP</span>
          </div>
          <div className="status-cards-wrapper">
            <button
              type="button"
              className={`status-option-card ${flow.status === "Active" ? "selected" : ""}`}
              onClick={() => flow.setStatus("Active")}
            >
              <div className="card-radio-indicator">
                {flow.status === "Active" && <span className="radio-dot" />}
              </div>
              <div className="status-card-icon-wrapper active">
                <CheckCircleFilled />
              </div>
              <strong className="status-card-title">Hoạt động</strong>
              <span className="status-badge-tag active">Active</span>
              <p className="status-card-desc">
                Lớp đang hoạt động và hiển thị trong danh sách lớp.
              </p>
            </button>
            <button
              type="button"
              className={`status-option-card ${flow.status === "Completed" ? "selected" : ""}`}
              onClick={() => flow.setStatus("Completed")}
            >
              <div className="card-radio-indicator">
                {flow.status === "Completed" && <span className="radio-dot" />}
              </div>
              <div className="status-card-icon-wrapper completed">
                <HourglassOutlined />
              </div>
              <strong className="status-card-title">Hoàn thành</strong>
              <span className="status-badge-tag completed">Completed</span>
              <p className="status-card-desc">
                Lớp đã hoàn thành nhưng vẫn hiển thị trong danh sách lớp.
              </p>
            </button>
          </div>
        </section>

        <section
          className="teacher-class-settings-card"
          aria-label="Thiết lập lớp"
        >
          <div className="card-section-title">
            <SettingOutlined className="icon-orange" />
            <span>THIẾT LẬP LỚP</span>
          </div>
          <div className="toggles-list">
            <div className="session-duration-field">
              <label htmlFor="session-duration-minutes">
                Thời lượng một buổi (phút)
              </label>
              <InputNumber
                id="session-duration-minutes"
                min={SESSION_DURATION_LIMITS.min}
                max={SESSION_DURATION_LIMITS.max}
                step={SESSION_DURATION_LIMITS.step}
                value={flow.settings.sessionDurationMinutes}
                status={flow.fieldErrors.sessionDurationMinutes ? "error" : ""}
                onChange={flow.handleSessionDurationChange}
              />
              <span>Dùng để tạo ô trên lịch dạy.</span>
              {flow.fieldErrors.sessionDurationMinutes && (
                <span
                  className="field-error-msg"
                  role="alert"
                  aria-live="polite"
                >
                  {flow.fieldErrors.sessionDurationMinutes[0]}
                </span>
              )}
            </div>
            <SettingToggle
              tone="green"
              icon={<UserOutlined />}
              title="Yêu cầu duyệt học sinh"
              description="Học sinh cần được giáo viên duyệt trước khi vào lớp"
              checked={flow.settings.requireStudentApproval}
              onChange={(checked) =>
                flow.setSettings((current) => ({
                  ...current,
                  requireStudentApproval: checked,
                }))
              }
            />
            <SettingToggle
              tone="blue"
              icon={<ClockCircleOutlined />}
              title="Cho phép học sinh tự rời lớp"
              description="Học sinh có thể chủ động rời khỏi lớp"
              checked={flow.settings.allowStudentLeave}
              onChange={(checked) =>
                flow.setSettings((current) => ({
                  ...current,
                  allowStudentLeave: checked,
                }))
              }
            />
            <SettingToggle
              tone="purple"
              icon={<BarChartOutlined />}
              title="Cho phép học sinh xem bảng điểm"
              description="Học sinh được xem bảng điểm của mình"
              checked={flow.settings.allowStudentViewGrades}
              onChange={(checked) =>
                flow.setSettings((current) => ({
                  ...current,
                  allowStudentViewGrades: checked,
                }))
              }
            />
            <SettingToggle
              tone="orange"
              icon={<CommentOutlined />}
              title="Cho phép hoạt động bảng tin"
              description="Cho phép hoạt động và tương tác trên bảng tin"
              checked={flow.settings.allowFeedActivity}
              onChange={(checked) =>
                flow.setSettings((current) => ({
                  ...current,
                  allowFeedActivity: checked,
                }))
              }
            />
          </div>
        </section>
      </div>
    </>
  );
}

interface SettingToggleProps {
  tone: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SettingToggle({
  tone,
  icon,
  title,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="toggle-item">
      <div className={`toggle-icon-box ${tone}`}>{icon}</div>
      <div className="toggle-text">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        className="setting-switch"
      />
    </div>
  );
}
