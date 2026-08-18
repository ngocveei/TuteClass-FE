# TuteClass UI migration mapping

Mapping giữa giao diện nguồn `E:\Capstone\Project\FrontEnd` và kiến trúc chạy thật tại `E:\Capstone\TuteClassFrontend`.

| Route mới | Nguồn giao diện FE cũ | Đích trong TuteClassFrontend | Logic được giữ |
| --- | --- | --- | --- |
| `/` | `features/landing/components/LandingScreen*` | `features/landing/components` | Landing flow mới |
| `/login` | `LoginPage`, `LoginForm` | `features/auth/pages/LoginViewPage.tsx` | Auth API, token, Google Identity |
| `/register` | `RegisterPage`, `RegisterForm` | `features/auth/pages/RegisterPage.tsx` | Register API và Google register |
| `/forgot-password` | `ForgotPasswordForm` | `features/auth/pages/ForgotPasswordPage.tsx` | Forgot-password API |
| `/reset-password` | `ResetPasswordForm` | `features/auth/pages/ResetPasswordViewPage.tsx` | OTP/reset API |
| `/classes` | teacher workspace, class selector/cards | `features/classes/pages/ClassListPage.tsx` | `useClasses`, React Query, API mới |
| `/classes/:classId` | teacher class overview | `features/classes/pages/ClassDetailPage.tsx` | `useClass`, query keys, API mới |
| `/teacher/profile` | `ProfileScreen` | `features/profile/pages/ProfileViewPage.tsx` | profile/bank/password API |
| `/student/classes` | student overview và empty state | `features/enrollments/pages/StudentClassesPage.tsx` | Không sử dụng mock cũ |
| `/student/profile` | `ProfileScreen` | `features/profile/pages/ProfileViewPage.tsx` | profile/password API |
| `/admin/users` | admin shell | `features/administration/pages/AdminUsersPage.tsx` | Không tạo API client riêng |

`PublicHeader`, `TeacherLayout` và `StudentLayout` được hợp nhất vào `shared/layouts/AuthLayout` và `shared/layouts/AppLayout`. Router trong `src/app/router` là source of truth; không giữ route trùng của FE cũ.
