# TuteClass Frontend – Kiến trúc và quy chuẩn code bắt buộc

Tài liệu này là quy chuẩn bắt buộc đối với mọi code được thêm hoặc sửa trong `E:\Capstone\TuteClassFrontend`. Pull request không tuân thủ vị trí file, hướng phụ thuộc và quy trình bên dưới phải được sửa trước khi merge.

Nguyên tắc nền tảng:

```text
UI/UX               = bám theo FE cũ và thiết kế đã duyệt
Architecture/API    = tuân theo TuteClassFrontend
Mỗi file            = chỉ làm đúng một nhóm nhiệm vụ
```

## 1. Công nghệ chính

- React 19 và TypeScript.
- Vite 8 để chạy development server và production build.
- React Router 7 để quản lý route.
- TanStack React Query để quản lý server state, cache và mutation.
- Axios để giao tiếp với backend ASP.NET Core.
- Ant Design và Ant Design Icons cho UI component.
- SignalR client cho chức năng realtime trong tương lai.
- Oxlint để kiểm tra mã nguồn.
- Docker và Nginx để build, triển khai frontend.

## 2. Luồng khởi động ứng dụng

```text
index.html
  └── src/main.tsx
        └── AppProviders
              ├── ThemeProvider
              └── QueryProvider
                    └── App
                          └── BrowserRouter
                                └── AppRouter
```

- `src/main.tsx`: entry point của React.
- `src/app/App.tsx`: khai báo router và fallback khi lazy loading.
- `src/app/providers`: tập trung global providers.
- `src/app/router`: tập trung cấu hình route theo nhóm quyền.

## 3. Cây thư mục tổng quát

```text
TuteClassFrontend/
├── public/                     # Asset phục vụ trực tiếp qua URL
│   ├── assets/                 # Logo, illustration, sticker
│   └── demos/                  # Video/ảnh demo landing page
├── src/
│   ├── app/                    # App composition, providers và router
│   ├── assets/                 # Asset được import từ source code
│   ├── config/                 # Env, React Query và Ant Design theme
│   ├── features/               # Business feature độc lập
│   ├── mocks/                  # Mock handlers/data khi cần
│   ├── services/               # Hạ tầng dùng chung: API, auth, realtime
│   ├── shared/                 # Component, layout, hook, type dùng chung
│   ├── styles/                 # Global CSS và design variables
│   └── main.tsx                # React entry point
├── nginx/
│   └── default.conf            # Nginx SPA fallback và cache policy
├── .env                        # Biến môi trường local, không commit secret
├── .env.example                # Mẫu biến môi trường
├── Dockerfile                  # Multi-stage Node build + Nginx runtime
├── compose.yaml                # Chạy frontend container tại cổng 8081
├── package.json                # Dependencies và npm scripts
├── tsconfig*.json              # TypeScript configuration
└── vite.config.ts              # Vite và alias `@`
```

## 4. `src/app` – tầng ứng dụng

```text
src/app/
├── App.tsx
├── providers/
│   ├── AppProviders.tsx
│   ├── QueryProvider.tsx
│   └── ThemeProvider.tsx
└── router/
    ├── index.tsx
    ├── lazy.pages.ts
    ├── public.routes.tsx
    ├── teacher.routes.tsx
    ├── student.routes.tsx
    └── admin.routes.tsx
```

Quy tắc:

- `lazy.pages.ts` là nơi khai báo lazy import page.
- Route công khai đặt trong `public.routes.tsx`.
- Route yêu cầu role đặt trong file tương ứng `teacher`, `student`, `admin`.
- Không viết business logic trong router.

## 5. `src/features` – business modules

Mỗi feature được tổ chức theo mẫu:

```text
features/<feature-name>/
├── api/          # Hàm gọi endpoint của feature
├── components/   # UI component chỉ thuộc feature
├── hooks/        # React Query hooks và UI flow hooks
├── pages/        # Route-level component
├── services/     # Mapping, SDK hoặc nghiệp vụ client phức tạp
├── types/        # DTO, request, response và UI model
└── utils/        # Hàm thuần chỉ phục vụ feature
```

Không phải feature nào cũng cần đủ tất cả thư mục. Chỉ tạo khi thực sự sử dụng.

### Feature đang có code triển khai

#### `features/auth`

- Đăng nhập, đăng ký.
- Google Identity Services.
- Quên mật khẩu và đặt lại mật khẩu bằng OTP.
- API:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/google`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- Các stylesheet auth được tách theo màn hình để giữ giao diện FE cũ.

#### `features/landing`

- Landing page công khai.
- Các section hero, problem, solution, demo và CTA.
- Hook quản lý scroll section và showcase state.

#### `features/classes`

- Danh sách lớp giáo viên.
- Chi tiết lớp dựa trên danh sách `/api/classes/mine`.
- Lấy tùy chọn tạo lớp và tạo lớp mới.
- React Query keys và hooks của lớp học.

#### `features/profile`

- Profile dùng chung cho giáo viên và học sinh.
- Cập nhật thông tin cá nhân.
- Thông tin ngân hàng và khung giờ dạy của giáo viên.
- Thông tin trường/phụ huynh của học sinh.
- Đổi mật khẩu.
- API:
  - `GET /api/users/me`
  - `PUT /api/users/me`
  - `PUT /api/users/me/bank`
  - `PUT /api/users/me/teaching-window`
  - `POST /api/users/me/change-password`

#### `features/enrollments`

- Chứa student overview và dữ liệu lớp của học sinh.
- API student overview, React Query hook, type và presentation được tách riêng.

#### `features/administration`

- Chứa page quản lý người dùng dành cho admin.
- Hiện là phần khung.

### Feature folders dự phòng

Các thư mục như `assignments`, `attendance`, `grading`, `materials`, `notifications`, `schedules`, `sessions`, `submissions`, `tuition`... đã được dành sẵn theo domain. Code mới của domain tương ứng phải được đặt vào đúng feature thay vì đưa vào `shared`.

## 6. `src/services` – hạ tầng dùng chung

```text
src/services/
├── api/
│   ├── apiClient.ts
│   ├── apiResponse.types.ts
│   └── getApiErrorMessage.ts
├── auth/
│   └── tokenStorage.ts
└── realtime/
    └── signalRClient.ts
```

### API client

`apiClient.ts` chịu trách nhiệm:

- Dùng `VITE_API_BASE_URL` làm base URL.
- Gắn Bearer access token vào request.
- Khi nhận `401`, gọi `/api/auth/refresh` một lần rồi thử lại request.
- Xóa session và chuyển về login nếu refresh thất bại.

Feature không được tạo Axios instance riêng. Mọi request thông thường phải dùng `apiClient`.

### Token storage

`tokenStorage.ts` lưu một object gồm:

```ts
{
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}
```

Không lưu mật khẩu hoặc profile đầy đủ trong local storage.

## 7. `src/shared` – code dùng lại

```text
src/shared/
├── auth/          # RoleGuard, PermissionGuard, đọc JWT claims
├── components/    # Loading, EmptyState, PageHeader, ConfirmDialog
├── constants/     # Routes và roles
├── hooks/         # Hook tổng quát không chứa business logic
├── layouts/       # Public, teacher, student, admin layouts
├── types/         # Type thực sự dùng chung nhiều feature
└── utils/         # Format date, currency, download file
```

### Layout hiện tại

- `AuthLayout`: header công khai cho landing/auth pages.
- `WorkspaceLayout`: header sau đăng nhập, search, navigation, notification button và user dropdown.
- `ClassSidebar`: danh sách lớp của giáo viên.
- `UserDropdown`: profile, đổi mật khẩu, phiên đăng nhập và đăng xuất.
- `TeacherLayout`, `StudentLayout`, `AdminLayout`: adapter layout theo role.

Quy tắc: component chỉ thuộc một domain không được đặt vào `shared`.

## 8. Routes hiện tại

### Public

```text
/
/login
/register
/forgot-password
/reset-password
```

### Teacher

```text
/classes
/classes/:classId
/teacher/profile
/teacher/profile?tab=password
/teacher/profile?tab=sessions
```

### Student

```text
/student/classes
/student/profile
/student/profile?tab=password
/student/profile?tab=sessions
```

### Admin

```text
/admin/users
```

Các route theo role được bảo vệ bởi `RoleGuard`.

## 9. Styling và design system

- `src/styles/variables.css`: màu, font và design tokens toàn cục.
- `src/styles/global.css`: reset và style dùng chung toàn app.
- Feature-specific CSS đặt cạnh feature, ví dụ:
  - `features/auth/register.css`
  - `features/auth/recovery-match.css`
  - `features/profile/profile.css`
  - `features/classes/teacher-dashboard.css`
  - `features/enrollments/student-dashboard.css`
  - `features/landing/components/LandingScreen.css`
- Layout-specific CSS đặt cạnh layout, ví dụ `shared/layouts/AppLayout/workspace.css`.

Font của FE cũ được giữ lại:

- `Inter`: nội dung, input, label và phần lớn UI.
- `Plus Jakarta Sans`: heading và CTA nổi bật.

Màu thương hiệu chính:

```text
Navy:  #0b2f66
Orange:#ff5c00
Paper: #fffaf1
Blue:  #2f7cff
```

## 10. Biến môi trường

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_SIGNALR_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=
FRONTEND_PORT=8081
```

Vite nhúng biến `VITE_*` tại thời điểm build. Khi chạy Docker, các biến này phải được truyền qua `build.args` trong `compose.yaml`.

## 11. Chạy dự án

### Development

```powershell
cd E:\Capstone\TuteClassFrontend
npm install
npm run dev
```

### Kiểm tra

```powershell
npm run lint
npm run build
```

### Docker

```powershell
docker compose up -d --build
```

Frontend chạy tại `http://localhost:8081` và backend mặc định tại `http://localhost:8080`.

## 12. Quy tắc thêm chức năng mới

Ví dụ thêm feature `assignments`:

```text
features/assignments/
├── api/assignment.api.ts
├── components/AssignmentTable.tsx
├── hooks/useAssignments.ts
├── pages/AssignmentListPage.tsx
├── types/assignment.types.ts
└── assignment.css
```

Luồng triển khai đề xuất:

1. Đọc controller và DTO của backend.
2. Khai báo request/response type trong `types`.
3. Viết endpoint functions trong `api`.
4. Viết React Query hook trong `hooks` nếu cần cache/mutation.
5. Viết UI nhỏ trong `components`.
6. Ghép thành route-level component trong `pages`.
7. Khai báo lazy page và route tại `src/app/router`.
8. Chạy lint, typecheck và production build.

## 13. Trách nhiệm bắt buộc của từng loại file

### `pages/*.tsx`

Chỉ được:

- Ghép feature components và hooks thành một màn hình theo route.
- Đọc route params, search params và điều hướng.
- Xử lý state chỉ liên quan đến bố cục của toàn page.

Không được:

- Tạo `axios` instance hoặc gọi endpoint bằng Axios/fetch trực tiếp.
- Viết DTO/type lớn ngay trong page.
- Chứa component con lớn có thể tách riêng.
- Chứa endpoint string như `/api/...`.
- Chứa hàng trăm dòng CSS inline.

### `components/*.tsx`

Chỉ chứa UI của feature hoặc shared UI. Component nhận dữ liệu và callback qua props khi phù hợp.

Không được gọi API trực tiếp, quản lý token, refresh token hoặc tự điều hướng khi đó không phải trách nhiệm của component.

### `hooks/*.ts` và `hooks/*.tsx`

- Chứa React Query `useQuery`, `useMutation`, query keys và UI flow dùng lại.
- Điều phối cache invalidation và optimistic update.
- Gọi hàm trong `api/`, không viết URL endpoint trong hook.

Hook tổng quát dùng cho nhiều domain mới được đặt trong `src/shared/hooks`.

### `api/*.ts`

- Là nơi duy nhất trong feature chứa URL endpoint và request HTTP.
- Bắt buộc dùng `src/services/api/apiClient.ts`.
- Nhận request type và trả response type rõ ràng.
- Không chứa JSX, toast, modal hoặc state giao diện.
- Không được dùng mock fallback khi request Backend thất bại.

### `services/*.ts`

Chỉ dùng khi có mapping, orchestration hoặc nghiệp vụ client phức tạp vượt quá một API function. Không tạo `service` chỉ để bọc lại một hàm `api` mà không thêm giá trị.

### `types/*.ts`

- Chứa DTO, request, response, UI model và union type của feature.
- Không chứa component hoặc side effect.
- Type chỉ dùng trong một component nhỏ có thể đặt cạnh component; type dùng nhiều nơi phải đưa vào `types`.

### `utils/*.ts`

- Chỉ chứa hàm thuần, không dùng React state và không gọi API.
- Utility chỉ thuộc một domain nằm trong feature đó.
- Utility dùng thật sự cho nhiều feature mới được đặt tại `src/shared/utils`.

### File CSS

- Global reset và rule cho `html`, `body`, `#root` chỉ nằm trong `src/styles/global.css`.
- Design token toàn cục chỉ nằm trong `src/styles/variables.css`.
- CSS của feature nằm cạnh feature; CSS layout nằm cạnh layout.
- Không đặt selector toàn cục như `body`, `h1`, `button`, `.container` trong feature CSS nếu chưa scope bằng class gốc của feature.
- Một màn hình không được tạo chuỗi file override kiểu `*-old.css`, `*-new.css`, `*-match.css`, `*-final.css`.
- Khi sửa giao diện hiện tại, chỉnh file CSS chính của feature. Nếu tách file, tên phải mô tả đúng component/màn hình và mỗi file phải có nhiệm vụ độc lập.
- Không dùng `!important` trừ trường hợp override thư viện và phải giới hạn trong class gốc của feature.

### `src/shared`

Chỉ đưa code vào `shared` khi có ít nhất hai domain độc lập sử dụng hoặc đó là hạ tầng giao diện toàn app.

Không đặt `ClassCard`, `StudentOverview`, `TeacherBankForm` hoặc business component tương tự vào `shared`.

### `src/app/router`

- Chỉ khai báo route, guard, layout và lazy import.
- Không gọi API, không viết form, không xử lý business state.
- Không tạo route trùng chỉ để giữ page cũ.
- Mỗi route-level page phải được khai báo tại `lazy.pages.ts`.

### `src/services`

- Chỉ chứa hạ tầng dùng chung toàn ứng dụng.
- Axios instance duy nhất là `src/services/api/apiClient.ts`.
- Token chỉ được đọc/ghi qua `src/services/auth/tokenStorage.ts`.
- SignalR connection dùng `src/services/realtime`.

## 14. Quy tắc đặt code theo domain

| Loại chức năng | Vị trí bắt buộc |
| --- | --- |
| Đăng nhập, đăng ký, Google, OTP | `src/features/auth` |
| Profile, ngân hàng, đổi mật khẩu, phiên đăng nhập | `src/features/profile` |
| Lớp của giáo viên, teacher overview | `src/features/classes` |
| Lớp và overview của học sinh | `src/features/enrollments` |
| Bài tập | `src/features/assignments` |
| Điểm danh | `src/features/attendance` |
| Chấm điểm | `src/features/grading` |
| Tài liệu | `src/features/materials` |
| Thông báo | `src/features/notifications` |
| Lịch học/dạy | `src/features/schedules` |
| Học phí | `src/features/tuition` |
| Quản trị người dùng | `src/features/administration` |
| Header/sidebar/dropdown/layout | `src/shared/layouts` |
| Button/loading/empty dùng nhiều domain | `src/shared/components` |
| API client/token/SignalR | `src/services` |
| Router/providers | `src/app` |

Nếu chưa có folder domain, tạo folder đúng mẫu trong `src/features`; không đặt tạm code business vào `shared`, `app`, `services` hoặc một feature không liên quan.

## 15. Quy tắc phụ thuộc

Hướng phụ thuộc mong muốn:

```text
app/router
   ↓
features/*/pages
   ↓
features/*/components + hooks
   ↓
features/*/api + types
   ↓
services/api
```

- Feature có thể dùng `shared` và `services`.
- `shared` không được import ngược từ business feature, ngoại trừ layout composition có chủ đích.
- Không gọi API trực tiếp trong component trình bày nếu có thể tách vào `api` hoặc hook.
- Không đặt URL endpoint rải rác trong JSX.
- Không sửa code backend từ repository frontend.

Các import bị cấm:

```text
shared  → features/*
services → features/*
feature A → internals của feature B (trừ public contract đã thống nhất)
api → pages/components
types → hooks/pages/components có side effect
```

Không tạo vòng phụ thuộc giữa các feature. Nếu hai feature cần cùng một primitive thật sự trung lập, tách primitive đó vào `shared`.

## 16. Quy tắc React Query và API

- GET sử dụng `useQuery`; POST/PUT/PATCH/DELETE sử dụng `useMutation` khi được gọi từ UI.
- Query key phải ổn định và đặt trong hook/query-key module của feature.
- Mutation thành công phải cập nhật cache hoặc invalidate query liên quan.
- Component không tự gọi lại API bằng `useEffect` nếu React Query giải quyết được.
- Không lưu server state trùng lặp vào local state nếu không có lý do rõ ràng.
- Không nuốt lỗi rồi trả mock data. Error phải đi vào error state hoặc được map thành thông báo người dùng.
- Không hardcode base URL, token hoặc credential trong source.

## 17. Quy tắc UI và migration

- FE cũ là nguồn tham chiếu visual: màu, font, spacing, asset, icon, responsive và interaction.
- Không thay UI cũ bằng Ant Design mặc định. Nếu dùng Ant Design phải scope và override để khớp thiết kế.
- Không thay custom SVG/image bằng icon “gần giống” khi asset gốc tồn tại.
- Mọi màn hình phải có loading, error, empty và disabled state phù hợp.
- Không viết mock/fake data để làm màn hình trông đầy đủ khi Backend trả rỗng.
- Không tạo component/file có hậu tố `Old`, `New`, `V2`, `Final`, `Temp` để né việc refactor component hiện tại.
- Trước khi xóa file cũ phải chạy `rg` kiểm tra import, router và lazy page.

## 18. Quy tắc chất lượng và giới hạn file

- TypeScript phải có type rõ ràng; không dùng `any` để bỏ qua lỗi.
- Không tạo page/component 500–1000 dòng. Khi một page có các khối độc lập, tách chúng vào `components`.
- Không over-engineer component 10–20 dòng chỉ dùng một lần nếu việc tách không làm code rõ hơn.
- Không dùng component dạng một dòng rất dài; JSX phải được format để review được.
- Không để code chết, import không dùng, console debug hoặc comment TODO không có issue liên quan.
- Text hiển thị tiếng Việt phải lưu UTF-8, không để lỗi encoding.

## 19. Quy trình bắt buộc trước khi merge

1. Xác định đúng domain và vị trí file theo bảng ở mục 14.
2. Search code hiện có để tái sử dụng thay vì tạo file `V2`, `Old`, `New`.
3. Đọc endpoint/DTO Backend trước khi khai báo type và API.
4. Giữ flow `Page → Hook → Feature API → apiClient`.
5. Kiểm tra desktop, tablet và mobile.
6. Kiểm tra loading, error, empty, disabled, hover, focus và active state.
7. Search import trước khi xóa hoặc đổi tên file.
8. Chạy:

```powershell
npm run lint
npm run build
```

Không merge nếu một trong hai lệnh thất bại.

## 20. Checklist review nhanh

- [ ] Code nằm đúng feature/domain.
- [ ] Page không gọi API trực tiếp.
- [ ] Feature API dùng `apiClient` chung.
- [ ] Endpoint không nằm trong JSX/hook.
- [ ] Không có mock fallback che lỗi Backend.
- [ ] Không có file `old/new/v2/final/temp`.
- [ ] CSS được scope và không khóa `html/body` từ feature.
- [ ] Không có business component trong `shared`.
- [ ] Route được khai báo đúng file theo role.
- [ ] UI bám FE cũ và có responsive/state đầy đủ.
- [ ] Lint và production build đều đạt.

## 21. Trạng thái hiện tại và lưu ý

- Landing, authentication, password recovery, teacher classes và profile đã được nối BE.
- Student overview và phiên đăng nhập đã nối Backend; một số domain khác vẫn là khung chưa triển khai đầy đủ.
- Một số file page cũ vẫn còn để tham chiếu trong quá trình migration; router chỉ dùng các page được khai báo trong `lazy.pages.ts`.
- Khi migration hoàn tất, nên xóa file không còn được router hoặc component khác sử dụng sau khi kiểm tra import references.
