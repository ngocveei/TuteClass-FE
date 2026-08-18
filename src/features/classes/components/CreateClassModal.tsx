import { Form, Input, Modal, Select, message } from 'antd'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCreateClassOptions } from '@/features/classes/api/class.api'
import { useCreateClass } from '@/features/classes/hooks/useCreateClass'
import type { CreateClassRequest } from '@/features/classes/types/class.types'
import { getApiErrorMessage } from '@/services/api/getApiErrorMessage'

interface CreateClassModalProps {
  open: boolean
  onClose: () => void
}

export function CreateClassModal({ open, onClose }: CreateClassModalProps) {
  const [form] = Form.useForm<CreateClassRequest>()
  const createClassMutation = useCreateClass()
  const optionsQuery = useQuery({
    queryKey: ['classes', 'create-options'],
    queryFn: getCreateClassOptions,
    enabled: open,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (!open) form.resetFields()
  }, [form, open])

  const handleSubmit = async () => {
    if (createClassMutation.isPending) return

    try {
      const values = await form.validateFields()
      await createClassMutation.mutateAsync({
        className: values.className.trim(),
        subjectId: values.subjectId,
        gradeLevel: values.gradeLevel,
        description: values.description?.trim() || undefined,
      })
      message.success('Tạo lớp học thành công.')
      form.resetFields()
      onClose()
    } catch (error: unknown) {
      const isValidationError =
        typeof error === 'object' && error !== null && 'errorFields' in error
      if (!isValidationError) message.error(getApiErrorMessage(error))
    }
  }

  return (
    <Modal
      open={open}
      title="Tạo lớp học"
      okText="Tạo lớp"
      cancelText="Hủy"
      confirmLoading={createClassMutation.isPending}
      okButtonProps={{ disabled: createClassMutation.isPending }}
      closable={!createClassMutation.isPending}
      maskClosable={!createClassMutation.isPending}
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          name="className"
          label="Tên lớp"
          rules={[
            { required: true, whitespace: true, message: 'Vui lòng nhập tên lớp.' },
            { max: 100, message: 'Tên lớp không được vượt quá 100 ký tự.' },
          ]}
        >
          <Input placeholder="Ví dụ: Toán 12A1" autoFocus maxLength={100} />
        </Form.Item>
        <Form.Item name="subjectId" label="Môn học" rules={[{ required: true, message: 'Vui lòng chọn môn học.' }]}>
          <Select
            loading={optionsQuery.isLoading}
            placeholder="Chọn môn học"
            options={optionsQuery.data?.subjects.map((subject) => ({ value: subject.subjectId, label: subject.subjectName }))}
          />
        </Form.Item>
        <Form.Item name="gradeLevel" label="Khối lớp" rules={[{ required: true, message: 'Vui lòng chọn khối lớp.' }]}>
          <Select
            loading={optionsQuery.isLoading}
            placeholder="Chọn khối lớp"
            options={optionsQuery.data?.gradeLevels.map((grade) => ({ value: grade.value, label: grade.label }))}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ max: 500, message: 'Mô tả không được vượt quá 500 ký tự.' }]}
        >
          <Input.TextArea placeholder="Thông tin ngắn về lớp học" rows={4} showCount maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
