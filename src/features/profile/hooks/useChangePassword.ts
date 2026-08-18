import { Form, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/features/profile/api/profile.api";
import { getApiErrorMessage } from "@/services/api/getApiErrorMessage";

export interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useChangePassword() {
  const [form] = Form.useForm<ChangePasswordValues>();
  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      message.success("Đổi mật khẩu thành công.");
      form.resetFields();
    },
  });
  return {
    form,
    submit: (values: ChangePasswordValues) => mutation.mutate(values),
    pending: mutation.isPending,
    error: mutation.error ? getApiErrorMessage(mutation.error) : undefined,
  };
}
