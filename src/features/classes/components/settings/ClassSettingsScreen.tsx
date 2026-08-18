import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Spin } from "antd";
import { ClassSettingsForm } from "@/features/classes/components/settings/ClassSettingsForm";
import { InvitationSettingsTab } from "@/features/classes/components/settings/InvitationSettingsTab";
import type { ClassSettingsFlowController } from "@/features/classes/types/classSettings.types";
import "./classSettingsScreen.css";

interface ClassSettingsScreenProps {
  flow: ClassSettingsFlowController;
}

export function ClassSettingsScreen({ flow }: ClassSettingsScreenProps) {
  if (flow.isLoading) {
    return (
      <main className="teacher-class-settings-page" aria-label="Cài đặt lớp">
        <div className="teacher-class-settings-loading">
          <Spin size="large" description="Đang tải thông tin cài đặt lớp..." />
        </div>
      </main>
    );
  }

  if (flow.isError) {
    return (
      <main className="teacher-class-settings-page" aria-label="Cài đặt lớp">
        <div className="teacher-class-settings-error">
          <ExclamationCircleOutlined className="error-icon" />
          <h2>Không thể tải thông tin lớp</h2>
          <p>{flow.errorMessage || "Lớp học không tồn tại hoặc đã bị xóa."}</p>
          <Button type="primary" onClick={flow.goBack}>
            Quay lại trang tổng quan
          </Button>
        </div>
      </main>
    );
  }

  const subjectName = flow.data?.subject.subjectName || "Môn học";
  const displayClassName =
    flow.className || flow.data?.className || "Chi tiết lớp";

  return (
    <main className="teacher-class-settings-page" aria-label="Cài đặt lớp">
      {flow.messageContextHolder}
      <div className="teacher-class-settings-container">
        <header className="teacher-class-settings-header">
          <div className="teacher-class-settings-header-content">
            <div>
              <h1 className="teacher-class-settings-title">
                Cài đặt lớp –{" "}
                <span className="title-class-name">{displayClassName}</span>
              </h1>
              <p className="teacher-class-settings-sub">
                Quản lý thông tin lớp học, quyền hoạt động và mã lời mời.
              </p>
            </div>
            <Button icon={<ArrowLeftOutlined />} onClick={flow.goBack}>
              Quay lại tổng quan lớp
            </Button>
          </div>
        </header>

        <div className="teacher-class-settings-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={flow.activeTab === "settings"}
            className={`settings-tab-btn ${flow.activeTab === "settings" ? "active" : ""}`}
            onClick={() => flow.setActiveTab("settings")}
          >
            <SettingOutlined /> Cài đặt lớp
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={flow.activeTab === "invitation"}
            className={`settings-tab-btn ${flow.activeTab === "invitation" ? "active" : ""}`}
            onClick={() => flow.setActiveTab("invitation")}
          >
            <span className="settings-tab-link-icon" aria-hidden="true">
              🔗
            </span>
            Cài đặt mã tham gia
          </button>
        </div>

        {flow.activeTab === "invitation" ? (
          <InvitationSettingsTab
            flow={flow.invitationFlow}
            classId={flow.classId}
          />
        ) : (
          <ClassSettingsForm flow={flow} subjectName={subjectName} />
        )}
      </div>
    </main>
  );
}
