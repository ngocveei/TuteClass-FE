# TuteClass Frontend

Frontend cho nền tảng quản lý lớp học TuteClass, được xây dựng để kết nối với ASP.NET Core 8 Web API sử dụng ASP.NET Identity và JWT.

Dự án ưu tiên cấu trúc dễ đọc, trách nhiệm rõ ràng và phù hợp với team khoảng 5 người. Các feature được tách theo nghiệp vụ nhưng không thêm các layer `domain`, `repository`, `use-case` hoặc mapper khi chưa có nhu cầu thực tế.

## Công nghệ

| Nhóm | Công nghệ | Vai trò |
| --- | --- | --- |
| Core | React, TypeScript, Vite | Xây dựng, kiểm tra kiểu và bundle ứng dụng |
| Routing | React Router DOM | Khai báo route, layout và lazy loading page |
| HTTP | Axios | Gửi request đến ASP.NET Core API |
| Server state | TanStack React Query | Cache, refetch và quản lý trạng thái request |
| UI | Ant Design | Component UI và Form validation |
| Calendar | FullCalendar React | Nền tảng cho lịch học và buổi học |
| Chart | Recharts | Nền tảng cho biểu đồ tiến độ và thống kê |
| Realtime | SignalR client | Chuẩn bị kết nối thông báo và dữ liệu realtime |

Dự án không sử dụng Redux hoặc Zod. Form validation sử dụng Ant Design Form rules.

## Bắt đầu

Yêu cầu Node.js 20 trở lên.

```bash
npm install
```

Tạo `.env.local` dựa trên `.env.example`:

```env
VITE_API_URL=https://localhost:7001/api
VITE_SIGNALR_URL=https://localhost:7001/hubs
```

Chạy và kiểm tra dự án:

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Kiến trúc tổng quan

Dependency chỉ đi theo hướng:

```text
app
 ↓
features
 ↓
shared / services / config
```

- `app` điều phối toàn ứng dụng, provider và router.
- `features` chứa code theo từng nghiệp vụ.
- `shared` chứa UI, hook và utility không biết nghiệp vụ cụ thể.
- `services` giao tiếp với hệ thống bên ngoài như HTTP, token storage và SignalR.
- `config` là nơi đọc và export cấu hình dùng chung.

`shared` không được import từ `features`. Một feature cũng không nên import component nội bộ của feature khác. Khi cần chia sẻ business logic giữa nhiều feature, team cần xác định ownership rõ ràng trước khi di chuyển code.

## Cấu trúc thư mục

```text
src/
├─ app/                 # Bootstrap, providers và router
├─ assets/              # Hình ảnh, icon và logo tĩnh
├─ config/              # Environment, React Query và Ant Design theme
├─ services/            # HTTP client, token storage và SignalR
├─ shared/              # Code dùng chung, không chứa business cụ thể
├─ features/            # Các module nghiệp vụ độc lập
├─ mocks/               # Mock handler/data cho test hoặc local development
├─ i18n/                # Tài nguyên đa ngôn ngữ khi được triển khai
├─ styles/              # CSS global và design variables
├─ main.tsx             # Entry point của ứng dụng
└─ vite-env.d.ts        # Type declaration do Vite cung cấp
```

Các folder feature chưa có nghiệp vụ chỉ là vị trí dành sẵn. Không thêm file rỗng hoặc abstraction giả cho đến khi feature được triển khai.

## Trách nhiệm các file nền

### App và providers

| File | Nhiệm vụ |
| --- | --- |
| `src/main.tsx` | Mount React vào DOM, nạp global CSS và bọc ứng dụng bằng `AppProviders` |
| `src/app/App.tsx` | Khởi tạo `BrowserRouter`, `Suspense` và render router |
| `AppProviders.tsx` | Compose tất cả provider cấp ứng dụng tại một nơi |
| `QueryProvider.tsx` | Tạo một `QueryClient` và cung cấp React Query cho toàn app |
| `ThemeProvider.tsx` | Cung cấp Ant Design theme và context cho `message`, `modal` |
| `query.config.ts` | Cấu hình mặc định `staleTime`, retry và refetch-on-focus |
| `theme.config.ts` | Chứa token giao diện dùng chung của Ant Design |

`QueryClient` được tạo ngoài component để không bị tạo lại mỗi lần render.

### Environment và API

| File | Nhiệm vụ |
| --- | --- |
| `env.config.ts` | Đọc và kiểm tra `VITE_API_URL`, `VITE_SIGNALR_URL` |
| `apiClient.ts` | Axios instance dùng chung, timeout và interceptors |
| `apiResponse.types.ts` | Type response phổ biến như pagination và validation error |
| `getApiErrorMessage.ts` | Chuyển Axios/API/validation error thành message cho người dùng |
| `tokenStorage.ts` | Điểm duy nhất đọc, ghi hoặc xóa JWT trong `localStorage` |

Request interceptor của `apiClient` lấy access token từ `tokenStorage` và thêm header:

```http
Authorization: Bearer <access-token>
```

Response interceptor xử lý `401` ở mức cơ bản bằng cách xóa token và chuyển người dùng về `/login`. Refresh token chưa được triển khai vì chưa có contract backend.

Không đọc trực tiếp `import.meta.env` hoặc `localStorage` trong feature.

### Authentication và authorization

| File | Nhiệm vụ |
| --- | --- |
| `authClaims.ts` | Decode JWT payload và đọc role, permission, expiration |
| `RoleGuard.tsx` | Bảo vệ route theo role `Teacher`, `Student`, `Admin` |
| `PermissionGuard.tsx` | Ẩn hoặc hiện UI theo một hay nhiều permission |
| `roles.ts` | Khai báo role tập trung để tránh magic string |

`RoleGuard` hỗ trợ cả claim `role` và URI role claim mặc định của ASP.NET Identity. Frontend authorization chỉ cải thiện UX. Backend vẫn phải dùng `[Authorize]`, role hoặc policy để kiểm tra quyền thật sự cho mọi endpoint.

Form tại `features/auth/pages/LoginPage.tsx` hiện chỉ là UI placeholder. Khi backend có login contract, feature `auth` cần thêm API function và mutation hook, sau đó gọi `setAccessToken()` khi đăng nhập thành công.

### Router và layout

| File | Route quản lý |
| --- | --- |
| `public.routes.tsx` | `/login`, `/forbidden` |
| `teacher.routes.tsx` | `/classes`, `/classes/:classId` |
| `student.routes.tsx` | `/student/classes` |
| `admin.routes.tsx` | `/admin/users` |
| `lazy.pages.ts` | Khai báo lazy import cho các route page |
| `router/index.tsx` | Gộp route và xử lý root/not-found redirect |

`AuthLayout` dùng cho màn hình công khai. `TeacherLayout`, `StudentLayout` và `AdminLayout` cấu hình menu theo role rồi tái sử dụng shell từ `AppLayout`.

## Cấu trúc một feature

```text
feature-name/
├─ api/          # Function gọi backend, không chứa React Query
├─ components/   # UI chỉ thuộc feature hiện tại
├─ hooks/        # Custom hook, useQuery và useMutation
├─ pages/        # Màn hình gắn với route, compose UI và hook
├─ types/        # Request, response và model TypeScript
└─ utils/        # Utility riêng của feature, chỉ tạo khi cần
```

Quy tắc chính:

- GET dùng `useQuery`.
- POST, PUT, PATCH, DELETE dùng `useMutation`.
- Mutation thành công phải invalidate query liên quan.
- API file chỉ gọi backend và trả về dữ liệu.
- Page không chứa trực tiếp Axios hoặc business logic dài.
- Component business-specific luôn nằm trong feature sở hữu nó.

## Feature Classes

| File | Nhiệm vụ |
| --- | --- |
| `types/class.types.ts` | Model `Class`, create/update request và trạng thái lớp |
| `api/class.api.ts` | Các HTTP function cho Classes API |
| `hooks/classKeys.ts` | Query key đơn giản cho list và detail |
| `hooks/useClasses.ts` | Lấy danh sách bằng `useQuery` |
| `hooks/useClass.ts` | Lấy chi tiết lớp theo `classId` |
| `hooks/useCreateClass.ts` | Tạo lớp và invalidate danh sách |
| `hooks/useUpdateClass.ts` | Cập nhật rồi invalidate list và detail |
| `components/ClassTable.tsx` | Hiển thị danh sách lớp dạng bảng |
| `components/ClassCard.tsx` | Phiên bản card để tái sử dụng trong UI Classes |
| `components/CreateClassModal.tsx` | Form tạo lớp, validation và trạng thái submit |
| `pages/ClassListPage.tsx` | Compose header, table, error state và modal |
| `pages/ClassDetailPage.tsx` | Compose màn hình chi tiết theo route parameter |
| `utils/class.utils.ts` | Chuyển status thành label và kiểm tra sức chứa |

### Luồng tải danh sách lớp

```text
ClassListPage
  → useClasses()
  → React Query kiểm tra cache ['classes']
  → getClasses()
  → apiClient.get('/classes')
  → ASP.NET Core API
  → React Query lưu cache
  → ClassTable render dữ liệu
```

Trong lúc chờ, Ant Design Table hiển thị loading. Nếu request lỗi, `getApiErrorMessage()` tạo nội dung cho `Alert` và người dùng có thể bấm thử lại.

### Luồng Create Class

```text
Người dùng bấm "Tạo lớp"
  → ClassListPage mở CreateClassModal
  → Ant Design Form validate name/description
  → useCreateClass().mutateAsync(values)
  → createClass(values)
  → apiClient POST /classes
  → ASP.NET Core API trả về Class
  → invalidate ['classes']
  → useClasses tự refetch
  → ClassTable nhận danh sách mới
  → reset form, đóng modal, message.success
```

Khi mutation đang chạy, nút tạo hiển thị loading và không thể submit nhiều lần. Nếu API lỗi, modal vẫn mở, dữ liệu form được giữ nguyên và Ant Design `message.error` hiển thị message đã chuẩn hóa bởi `getApiErrorMessage()`.

## SignalR

`services/realtime/signalRClient.ts` cung cấp `createSignalRConnection(hubName)`:

- Tạo URL dựa trên `VITE_SIGNALR_URL`.
- Lấy JWT qua `tokenStorage` cho `accessTokenFactory`.
- Bật automatic reconnect.
- Chuẩn bị WebSockets và Long Polling.

Feature cần realtime sẽ tự quản lý vòng đời connection trong hook của feature: start khi mount hoặc đăng nhập, đăng ký event, sau đó unsubscribe và stop khi unmount. Không khởi tạo connection trực tiếp trong nhiều component.

## Shared code

| Nhóm | Nội dung |
| --- | --- |
| `shared/components` | Loading, EmptyState, PageHeader, ConfirmDialog |
| `shared/hooks` | Debounce và pagination state |
| `shared/utils` | Format ngày, tiền tệ và tải file |
| `shared/constants` | Route và role dùng chung |
| `shared/types` | Type kỹ thuật không gắn với nghiệp vụ |

Chỉ chuyển code vào `shared` khi nó có khả năng tái sử dụng rõ ràng và không biết các khái niệm như Class, Assignment, Tuition hoặc Attendance.

## API Classes đang giả định

Backend chưa có trong workspace nên các endpoint sau là placeholder:

| Method | Endpoint | Kết quả giả định |
| --- | --- | --- |
| GET | `/classes` | `Class[]` |
| GET | `/classes/:id` | `Class` |
| POST | `/classes` | Class vừa tạo |
| PUT | `/classes/:id` | Class sau cập nhật |
| DELETE | `/classes/:id` | `204 No Content` |

Response hiện được giả định trả trực tiếp resource JSON, không bọc bằng object `{ data: ... }`. Khi backend chốt contract, chỉ cần điều chỉnh `features/classes/api/class.api.ts`; component và page không cần biết Axios response.

## Quy ước phát triển

- Component dùng PascalCase và file `.tsx` cùng tên component.
- Function và variable dùng camelCase.
- Hook bắt đầu bằng `use`.
- API file có hậu tố `.api.ts`; type file có hậu tố `.types.ts`.
- Import nội bộ dùng alias `@/`, không dùng đường dẫn `../../../../`.
- Không dùng `any` khi có thể mô tả kiểu bằng `unknown`, interface hoặc generic.
- Không đưa API call trực tiếp vào page hoặc component.
- Không thêm Redux, schema layer hoặc abstraction mới nếu bài toán chưa cần.

Trước khi tạo pull request, chạy:

```bash
npm run lint
npm run build
```
