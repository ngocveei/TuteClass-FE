import { Button, Modal } from "antd";
import type { ClassSettingsFlowController } from "@/features/classes/types/classSettings.types";

export function ClassDangerZone({
  flow,
}: {
  flow: ClassSettingsFlowController;
}) {
  return (
    <>
      <div className="settings-footer-actions">
        <div className="footer-left-delete">
          <Button
            danger
            type="default"
            onClick={flow.openDeleteModal}
            className="btn-delete-class"
          >
            Xóa lớp
          </Button>
          <div className="delete-hint-text">
            <span>Xóa lớp sẽ ẩn lớp khỏi danh sách lớp đang hoạt động.</span>
            <span className="warning-red">
              {" "}
              Hành động này không thể hoàn tác.
            </span>
          </div>
        </div>
        <div className="footer-right-buttons">
          <Button
            type="default"
            onClick={flow.handleReset}
            className="btn-cancel"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={flow.isSaving}
            className="btn-save-settings"
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
      <Modal
        title="Xóa lớp học"
        open={flow.isDeleteModalOpen}
        onOk={flow.handleConfirmDelete}
        onCancel={flow.closeDeleteModal}
        okText="Xóa lớp"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: flow.isDeleting }}
      >
        <p>
          Bạn có chắc chắn muốn xóa lớp học này không? Hành động này không thể
          hoàn tác.
        </p>
      </Modal>
    </>
  );
}
