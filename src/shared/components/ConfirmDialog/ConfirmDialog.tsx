import { Modal } from 'antd'

interface ConfirmDialogProps {
  open: boolean
  title: string
  content: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  content,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      confirmLoading={loading}
      okText="Xác nhận"
      cancelText="Hủy"
      onOk={onConfirm}
      onCancel={onCancel}
    >
      {content}
    </Modal>
  )
}
