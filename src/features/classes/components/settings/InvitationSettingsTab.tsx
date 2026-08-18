import {
  CopyOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Dropdown, Input, Modal, Spin, Switch } from "antd";
import type { MenuProps } from "antd";
import dayjs from "dayjs";
import {
  formatExpiryDateTime,
  getInvitationStatus,
} from "@/features/classes/utils/classInvitation.utils";
import type {
  ClassInvitationDto,
  InvitationFlowController,
  InvitationStatusType,
} from "@/features/classes/types/classInvitation.types";
import "./classSettingsScreen.css";

interface InvitationSettingsTabProps {
  classId?: string;
  flow?: InvitationFlowController;
}

export function InvitationSettingsTab({ flow }: InvitationSettingsTabProps) {
  if (!flow || flow.isLoading) {
    return (
      <div className="teacher-class-settings-card invite-tab-loading">
        <Spin description="Đang tải danh sách mã tham gia..." size="large" />
      </div>
    );
  }

  if (flow.isError) {
    return (
      <div className="teacher-class-settings-card invite-tab-error">
        <p>Không thể tải danh sách mã tham gia.</p>
        <Button icon={<ReloadOutlined />} onClick={() => flow.refetch()}>
          Thử lại
        </Button>
      </div>
    );
  }

  const renderStatusBadge = (status: InvitationStatusType) => {
    switch (status) {
      case "Active":
        return (
          <span className="invite-badge badge-active">Đang hoạt động</span>
        );
      case "MaxUsesReached":
        return (
          <span className="invite-badge badge-max-uses">Hết lượt dùng</span>
        );
      case "Expired":
        return <span className="invite-badge badge-expired">Hết hạn</span>;
      case "Inactive":
        return (
          <span className="invite-badge badge-inactive">Đã vô hiệu hóa</span>
        );
    }
  };

  const getActionMenuItems = (
    invitation: ClassInvitationDto,
  ): MenuProps["items"] => [
    {
      key: "copy-code",
      icon: <CopyOutlined />,
      label: "Sao chép mã",
      onClick: () => flow.copyCode(invitation.inviteCode),
    },
    {
      key: "copy-link",
      icon: <ExportOutlined />,
      label: "Sao chép đường dẫn",
      onClick: () => flow.copyLink(invitation.inviteLink),
    },
    {
      type: "divider",
    },
    {
      key: "toggle-active",
      label: invitation.isActive ? "Vô hiệu hóa mã" : "Kích hoạt mã",
      onClick: () => flow.toggleActive(invitation),
    },
  ];

  return (
    <div id="invite-settings" className="invite-tab-wrapper">
      {flow.messageContextHolder}

      {/* Section 1: Tạo mã mới */}
      <section
        className="teacher-class-settings-card invite-section-create"
        aria-label="Tạo mã mới"
      >
        <div className="invite-section-header">
          <h2 className="invite-section-title">Tạo mã mới</h2>
          <p className="invite-section-sub">
            Tạo mã hoặc link để học sinh tham gia lớp.
          </p>
        </div>

        <form
          onSubmit={flow.handleCreateInvitation}
          className="invite-create-form-grid"
        >
          {/* Field 1: Giới hạn lượt dùng */}
          <div className="invite-form-item">
            <label htmlFor="new-max-uses-input">
              Giới hạn lượt dùng (tùy chọn)
            </label>
            <Input
              id="new-max-uses-input"
              value={flow.newMaxUses}
              onChange={(e) => flow.setNewMaxUses(e.target.value)}
              placeholder="VD: 10"
              className="invite-input"
            />
            <p className="invite-input-caption">
              Để trống nếu không giới hạn lượt dùng
            </p>
          </div>

          {/* Field 2: Hạn sử dụng */}
          <div className="invite-form-item">
            <label htmlFor="new-expires-at-picker">
              Hạn sử dụng (tùy chọn)
            </label>
            <DatePicker
              id="new-expires-at-picker"
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="Chọn ngày giờ"
              value={flow.newExpiresAt ? dayjs(flow.newExpiresAt) : null}
              onChange={(date) =>
                flow.setNewExpiresAt(date ? date.toISOString() : null)
              }
              className="invite-datepicker"
            />
            <p className="invite-input-caption">Để trống nếu không có hạn</p>
          </div>

          {/* Button: + Tạo mã mới */}
          <div className="invite-form-item invite-button-cell">
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={flow.isCreating}
              className="btn-create-invite"
            >
              Tạo mã mới
            </Button>
          </div>
        </form>
      </section>

      {/* Section 2: Danh sách mã lời mời */}
      <section
        className="teacher-class-settings-card invite-section-list"
        aria-label="Danh sách mã lời mời"
      >
        <div className="invite-section-header">
          <h2 className="invite-section-title">Danh sách mã lời mời</h2>
          <p className="invite-section-sub">Mới nhất ở trên.</p>
        </div>

        {flow.invitations.length === 0 ? (
          <div className="invite-empty-state">
            <p>Chưa có mã lời mời nào cho lớp học này.</p>
          </div>
        ) : (
          <div className="invite-table-responsive">
            <table className="invite-table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "22%" }}>
                    Mã mời
                  </th>
                  <th scope="col" style={{ width: "16%" }}>
                    Giới hạn lượt
                  </th>
                  <th scope="col" style={{ width: "12%" }}>
                    Đã dùng
                  </th>
                  <th scope="col" style={{ width: "24%" }}>
                    Hạn sử dụng
                  </th>
                  <th scope="col" style={{ width: "16%" }}>
                    Trạng thái
                  </th>
                  <th scope="col" style={{ width: "10%", textAlign: "center" }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {flow.invitations.map((item) => {
                  const status = getInvitationStatus(item);
                  const isMaxUsesExceeded =
                    item.maxUses !== null && item.usedCount >= item.maxUses;

                  return (
                    <tr key={item.invitationId} className="invite-table-row">
                      {/* Col 1: Mã mời */}
                      <td className="cell-code">
                        <div className="code-main-line">
                          <strong className="invite-code-text">
                            {item.inviteCode}
                          </strong>
                          <button
                            type="button"
                            className="btn-icon-copy"
                            title="Sao chép mã"
                            aria-label={`Sao chép mã ${item.inviteCode}`}
                            onClick={() => flow.copyCode(item.inviteCode)}
                          >
                            <CopyOutlined />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="link-copy-action"
                          onClick={() => flow.copyLink(item.inviteLink)}
                        >
                          Sao chép link{" "}
                          <ExportOutlined style={{ fontSize: 11 }} />
                        </button>
                      </td>

                      {/* Col 2: Giới hạn lượt */}
                      <td className="cell-max-uses">
                        {item.maxUses !== null
                          ? item.maxUses
                          : "Không giới hạn"}
                      </td>

                      {/* Col 3: Đã dùng */}
                      <td className="cell-used-count">
                        <span
                          className={
                            isMaxUsesExceeded ? "used-count-exceeded" : ""
                          }
                        >
                          {item.usedCount}
                        </span>
                      </td>

                      {/* Col 4: Hạn sử dụng */}
                      <td className="cell-expires">
                        {formatExpiryDateTime(item.expiresAt)}
                      </td>

                      {/* Col 5: Trạng thái */}
                      <td className="cell-status">
                        {renderStatusBadge(status)}
                      </td>

                      {/* Col 6: Thao tác */}
                      <td className="cell-actions">
                        <div className="actions-flex">
                          <Button
                            type="default"
                            size="small"
                            onClick={() => flow.openEditModal(item)}
                            className="btn-edit-invite"
                          >
                            Chỉnh sửa
                          </Button>
                          <Dropdown
                            menu={{ items: getActionMenuItems(item) }}
                            trigger={["click"]}
                            placement="bottomRight"
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<MoreOutlined />}
                              aria-label="Thao tác khác"
                              className="btn-more-invite"
                            />
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Info Banner at bottom of card */}
        <div className="invite-info-banner">
          <InfoCircleOutlined className="banner-icon" />
          <span>
            Học sinh chỉ có thể tham gia khi mã mời đang hoạt động, chưa hết hạn
            và chưa vượt quá số lượt dùng.
          </span>
        </div>
      </section>

      {/* Modal Chỉnh Sửa Mã Mời */}
      <Modal
        title="Chỉnh sửa mã mời"
        open={flow.isEditModalOpen}
        onOk={flow.handleUpdateInvitation}
        onCancel={flow.closeEditModal}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={flow.isUpdating}
        okButtonProps={{
          style: { backgroundColor: "#f97316", borderColor: "#f97316" },
        }}
      >
        <div className="edit-invite-modal-body">
          <div className="edit-modal-field">
            <label htmlFor="edit-max-uses-input">Giới hạn lượt dùng</label>
            <Input
              id="edit-max-uses-input"
              value={flow.editMaxUses}
              onChange={(e) => flow.setEditMaxUses(e.target.value)}
              placeholder="Để trống nếu không giới hạn"
            />
            {flow.editingInvitation && (
              <p className="edit-hint">
                Số lượt đã dùng hiện tại:{" "}
                <strong>{flow.editingInvitation.usedCount}</strong>. Số mới
                không được nhỏ hơn số đã dùng.
              </p>
            )}
          </div>

          <div className="edit-modal-field">
            <label htmlFor="edit-expires-at-picker">Hạn sử dụng</label>
            <DatePicker
              id="edit-expires-at-picker"
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder="Để trống nếu không có hạn"
              value={flow.editExpiresAt ? dayjs(flow.editExpiresAt) : null}
              onChange={(date) =>
                flow.setEditExpiresAt(date ? date.toISOString() : null)
              }
              style={{ width: "100%" }}
            />
          </div>

          <div className="edit-modal-field edit-switch-row">
            <label htmlFor="edit-is-active-switch">Trạng thái kích hoạt</label>
            <div className="switch-wrapper">
              <Switch
                id="edit-is-active-switch"
                checked={flow.editIsActive}
                onChange={(checked) => flow.setEditIsActive(checked)}
              />
              <span className="switch-status-label">
                {flow.editIsActive ? "Đang hoạt động" : "Vô hiệu hóa"}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
