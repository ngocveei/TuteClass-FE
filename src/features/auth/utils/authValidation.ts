export const normalizeEmail = (value: string) => value.trim().toLowerCase();
export const normalizeFullName = (value: string) =>
  value.trim().replace(/\s+/g, " ");
export const validateEmail = (value?: string) => {
  const email = normalizeEmail(value ?? "");
  if (!email) return "Email là bắt buộc.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? undefined
    : "Email không đúng định dạng.";
};
export const validateFullName = (value?: string) => {
  const name = normalizeFullName(value ?? "");
  if (!name) return "Họ và tên là bắt buộc.";
  if (name.length < 2 || name.length > 50)
    return "Họ và tên phải có từ 2 đến 50 ký tự.";
  return undefined;
};
