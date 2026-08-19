const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S+$/

export function validatePassword(value?: string) {
  if (!value) return 'Mật khẩu là bắt buộc.'
  if (value.length < 8 || value.length > 100) return 'Mật khẩu phải có từ 8 đến 100 ký tự.'
  return passwordPattern.test(value) ? undefined : 'Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
}

export function validateConfirmPassword(password?: string, confirmation?: string) {
  if (!confirmation) return 'Hãy xác nhận mật khẩu.'
  return password === confirmation ? undefined : 'Xác nhận mật khẩu không khớp.'
}
