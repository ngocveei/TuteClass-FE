import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CopyOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, message } from "antd";
import type { CreateClassFlowController } from "@/features/classes/types/classCreate.types";
import { ClassPreviewCard } from "./ClassPreviewCard";
import { CreateClassForm } from "./CreateClassForm";
import "./CreateClassScreen.css";

export function CreateClassScreen({
  flow,
}: {
  flow: CreateClassFlowController;
}) {
  const {
    step,
    values,
    options,
    createdClass,
    createdInvitation,
    errors,
    generalError,
    traceId,
    imagePreviewUrl,
    isImageValidating,
    isOptionsLoading,
    isOptionsError,
    isSubmitting,
    isUploading,
    modalContextHolder,
    handleFieldChange,
    handleImageChange,
    clearInvalidImageSelection,
    nextStep,
    previousStep,
    handleSubmit,
    handleCancel,
    handleCreateAnother,
    goToCreatedClassOverview,
    goBack,
    refetchOptions,
  } = flow;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      void message.success(`Đã sao chép ${label}!`);
    } catch {
      void message.error(`Không thể sao chép ${label}.`);
    }
  };

  if (createdClass) {
    return (
      <main className="create-class-page">
        {modalContextHolder}
        <section
          className="create-class-success"
          aria-labelledby="create-class-success-title"
        >
          <CheckCircleFilled
            className="create-class-success__icon"
            aria-hidden="true"
          />
          <span className="create-class-success__eyebrow">
            Lớp học đã được lưu
          </span>
          <h1 id="create-class-success-title">Tạo lớp thành công!</h1>
          <p>
            Bạn có thể tiếp tục tạo lớp khác hoặc quay về khu vực tổng quan.
          </p>

          <div className="create-class-success__class">
            <span>{createdClass.subject.subjectName}</span>
            <strong>{createdClass.className}</strong>
            {createdClass.description && <p>{createdClass.description}</p>}
            <small>
              Tạo lúc {new Date(createdClass.createdAt).toLocaleString("vi-VN")}
            </small>
          </div>

          {createdInvitation && (
            <div className="create-class-success__invitation">
              <h3>Mã mời tham gia lớp học</h3>
              <div className="create-class-success__invitation-row">
                <div className="create-class-success__invitation-box">
                  <span>Mã mời</span>
                  <strong>{createdInvitation.inviteCode}</strong>
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() =>
                      void copyToClipboard(
                        createdInvitation.inviteCode,
                        "mã mời",
                      )
                    }
                  >
                    Sao chép mã
                  </Button>
                </div>
                <div className="create-class-success__invitation-box">
                  <span>Link mời</span>
                  <strong
                    className="truncate-link"
                    title={createdInvitation.inviteLink}
                  >
                    {createdInvitation.inviteLink}
                  </strong>
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() =>
                      void copyToClipboard(
                        createdInvitation.inviteLink,
                        "link mời",
                      )
                    }
                  >
                    Sao chép link
                  </Button>
                </div>
              </div>
              <div className="create-class-success__invitation-meta">
                <span>
                  Số lượt sử dụng:{" "}
                  {createdInvitation.maxUses !== null
                    ? `0 / ${createdInvitation.maxUses}`
                    : "Không giới hạn"}
                </span>
                <span>
                  Hạn sử dụng:{" "}
                  {createdInvitation.expiresAt
                    ? new Date(createdInvitation.expiresAt).toLocaleDateString(
                        "vi-VN",
                      )
                    : "Không hết hạn"}
                </span>
              </div>
            </div>
          )}

          <div className="create-class-success__actions">
            <Button size="large" onClick={goToCreatedClassOverview}>
              Về tổng quan
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateAnother}
            >
              Tạo lớp khác
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="create-class-page">
      {modalContextHolder}
      <div className="create-class-page__container">
        <button
          type="button"
          className="create-class-page__back"
          onClick={goBack}
        >
          <ArrowLeftOutlined /> Quay lại tổng quan
        </button>
        <header className="create-class-page__header">
          <h1>Tạo lớp học mới</h1>
          <p>
            Hoàn thành hai bước để thiết lập lớp học và bắt đầu mời học sinh.
          </p>
        </header>

        <div className="create-class-page__grid">
          <CreateClassForm
            step={step}
            values={values}
            options={options}
            errors={errors}
            generalError={generalError}
            traceId={traceId}
            imagePreviewUrl={imagePreviewUrl}
            isImageValidating={isImageValidating}
            isOptionsLoading={isOptionsLoading}
            isOptionsError={isOptionsError}
            isSubmitting={isSubmitting}
            isUploading={isUploading}
            onFieldChange={handleFieldChange}
            onImageChange={handleImageChange}
            onClearInvalidImageSelection={clearInvalidImageSelection}
            onNext={nextStep}
            onBack={previousStep}
            onRetryOptions={refetchOptions}
            onSubmit={() => void handleSubmit()}
            onCancel={handleCancel}
          />
          <ClassPreviewCard
            values={values}
            options={options}
            imagePreviewUrl={imagePreviewUrl}
            createdInvitation={createdInvitation}
            onFieldChange={handleFieldChange}
            disabled={isSubmitting}
            teacherName={flow.teacherName}
          />
        </div>
      </div>
    </main>
  );
}
