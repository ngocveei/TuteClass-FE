# TuteClass Frontend – Quy tắc tổ chức cấu trúc bên trong Feature

Tài liệu này quy định cách tổ chức thư mục bên trong `src/features/*` để áp dụng thống nhất cho tất cả business feature của TuteClass Frontend.

Mục tiêu:

- Giữ cấu trúc feature gọn, dễ đọc trong VS Code Explorer.
- Nhìn vào feature vẫn nhận biết rõ các nhóm nghiệp vụ bên trong.
- Giữ đúng luồng phụ thuộc của project.
- Tránh tạo quá nhiều mini-feature lồng nhau làm cây thư mục bị phồng.
- Giúp developer dễ xác định file cần sửa khi phát triển một chức năng.

---

## 1. Nguyên tắc cốt lõi

Mỗi thư mục trực tiếp bên trong `src/features/` là một **business feature/domain**.

Ví dụ:

```text
src/features/
├── auth/
├── classes/
├── enrollments/
├── profile/
├── assignments/
├── attendance/
├── grading/
├── materials/
├── notifications/
├── schedules/
├── tuition/
└── administration/
```

Bên trong mỗi feature, ưu tiên chia code theo **trách nhiệm kỹ thuật**:

```text
features/<feature-name>/
├── api/
├── components/
├── hooks/
├── pages/
├── services/
├── types/
└── utils/
```

Không phải feature nào cũng cần đủ tất cả thư mục. Chỉ tạo thư mục khi thực sự có code sử dụng.

---

## 2. Quy tắc tổ chức bắt buộc

Thứ tự tổ chức được ưu tiên:

```text
Business Feature
      ↓
Technical Responsibility
      ↓
Business Function nhỏ nếu cần
```

Ví dụ đúng:

```text
features/classes/
├── api/
├── components/
│   ├── overview/
│   ├── class-list/
│   ├── students/
│   ├── settings/
│   └── approvals/
├── hooks/
├── pages/
├── services/
├── types/
└── utils/
```

Ở đây:

- `classes` là business feature.
- `components`, `hooks`, `api`, `pages`... là nhóm trách nhiệm kỹ thuật.
- `settings`, `approvals`, `students`... chỉ là nhóm chức năng nhỏ bên trong feature `classes`.

Không ưu tiên tổ chức ngược lại như sau:

```text
features/classes/
├── class-settings/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── class-approvals/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   └── types/
├── teacher-overview/
├── teacher-students/
├── api/
├── components/
├── hooks/
└── types/
```

Cách trên tạo nhiều mini-feature cùng cấp, làm `classes/` bị phồng và khó phân biệt đâu là cấu trúc chuẩn của feature, đâu là chức năng con.

---

## 3. Cấu trúc chuẩn của một feature

Cấu trúc cơ bản:

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

Ví dụ với `assignments`:

```text
features/assignments/
├── api/
│   ├── assignments.api.ts
│   └── submissions.api.ts
├── components/
│   ├── assignment-list/
│   │   ├── AssignmentCard.tsx
│   │   └── AssignmentTable.tsx
│   ├── assignment-form/
│   │   └── AssignmentForm.tsx
│   └── submission-review/
│       └── SubmissionReviewPanel.tsx
├── hooks/
│   ├── useAssignments.ts
│   ├── useCreateAssignment.ts
│   └── useSubmissions.ts
├── pages/
│   ├── AssignmentListPage.tsx
│   ├── AssignmentDetailPage.tsx
│   └── CreateAssignmentPage.tsx
├── services/
│   └── assignmentMapper.ts
├── types/
│   ├── assignment.types.ts
│   └── submission.types.ts
└── utils/
    └── assignment.utils.ts
```

---

## 4. Khi nào được tạo thư mục con bên trong `components`

`components/` thường là nơi có nhiều file nhất nên có thể chia tiếp theo nhóm chức năng.

Ví dụ:

```text
components/
├── overview/
├── settings/
├── students/
├── approvals/
└── class-list/
```

Chỉ nên tạo thư mục con khi:

- Có từ hai component trở lên cùng phục vụ một nhóm chức năng.
- Nhóm component có ý nghĩa nghiệp vụ rõ ràng.
- Việc gom nhóm giúp Explorer dễ đọc hơn.

Không nên tạo:

```text
components/
└── settings/
    └── ClassSettingsForm.tsx
```

nếu `settings/` chỉ có đúng một file và không có khả năng phát triển thêm rõ ràng.

Trong trường hợp đó có thể để:

```text
components/
└── ClassSettingsForm.tsx
```

---

## 5. `api`, `hooks`, `types`, `services`, `utils` ưu tiên để phẳng

Các thư mục này thường có ít file hơn `components`, vì vậy ưu tiên giữ cấu trúc phẳng.

Ví dụ:

```text
api/
├── classes.api.ts
├── classSettings.api.ts
├── classApprovals.api.ts
└── classStudents.api.ts
```

Ưu tiên cách trên thay vì:

```text
api/
├── settings/
│   └── classSettings.api.ts
├── approvals/
│   └── classApprovals.api.ts
└── students/
    └── classStudents.api.ts
```

Chỉ chia thư mục con khi số lượng file thực sự lớn và mỗi nhóm có nhiều file liên quan.

Ví dụ có thể chấp nhận:

```text
api/
├── assignments/
│   ├── assignmentQueries.api.ts
│   └── assignmentCommands.api.ts
└── submissions/
    ├── submissionQueries.api.ts
    └── submissionCommands.api.ts
```

---

## 6. Quy tắc cho `pages`

`pages/` chứa route-level component của feature.

Ưu tiên giữ phẳng:

```text
pages/
├── TeacherOverviewPage.tsx
├── ClassDetailPage.tsx
├── ClassSettingsPage.tsx
├── ClassStudentsPage.tsx
└── ClassJoinRequestsPage.tsx
```

Không tạo thêm folder chỉ để chứa một page:

```text
pages/
├── settings/
│   └── ClassSettingsPage.tsx
└── approvals/
    └── ClassJoinRequestsPage.tsx
```

Chỉ chia folder khi một nhóm route có số lượng page lớn và thực sự cần gom lại.

---

## 7. Quy tắc cho `hooks`

Hook phải mô tả rõ chức năng đang điều phối.

Ví dụ:

```text
hooks/
├── useTeacherClasses.ts
├── useTeacherOverview.ts
├── useClassSettings.ts
├── useClassApprovals.ts
└── useClassStudents.ts
```

Hook:

- Gọi hàm trong `api/`.
- Quản lý `useQuery`, `useMutation`.
- Quản lý query key.
- Invalidate hoặc cập nhật cache khi mutation thành công.
- Có thể điều phối UI flow dùng lại.

Không đặt endpoint URL trực tiếp trong hook.

---

## 8. Quy tắc cho `api`

`api/` là nơi duy nhất bên trong feature chứa URL endpoint và request HTTP.

Ví dụ:

```text
features/classes/api/
├── classes.api.ts
├── classSettings.api.ts
├── classApprovals.api.ts
└── classStudents.api.ts
```

Mọi request phải sử dụng:

```text
src/services/api/apiClient.ts
```

Không:

- Tạo Axios instance riêng.
- Gọi API trực tiếp trong page.
- Gọi API trực tiếp trong component.
- Đặt endpoint string trong JSX.
- Đặt endpoint string trong hook.

---

## 9. Quy tắc cho `types`

`types/` chứa:

- DTO.
- Request type.
- Response type.
- UI model.
- Union type của feature.

Ví dụ:

```text
types/
├── class.types.ts
├── classSettings.types.ts
├── classApproval.types.ts
└── classStudent.types.ts
```

Nếu một type chỉ dùng cho một component nhỏ thì có thể đặt cạnh component.

Nếu type được dùng ở nhiều file trong cùng feature thì đưa vào `types/`.

---

## 10. Quy tắc cho `services`

Chỉ tạo `services/` khi thực sự có:

- Mapping dữ liệu.
- Orchestration.
- SDK.
- Nghiệp vụ phía client phức tạp hơn một API function.

Ví dụ:

```text
services/
└── classMapper.ts
```

Không tạo service chỉ để bọc lại API:

```ts
// Không nên
export const getClasses = () => classesApi.getClasses();
```

nếu service không bổ sung mapping hoặc nghiệp vụ nào.

---

## 11. Quy tắc cho `utils`

`utils/` chỉ chứa hàm thuần của feature.

Ví dụ:

```text
utils/
├── class.utils.ts
└── assignment.utils.ts
```

Utility:

- Không gọi API.
- Không dùng React state.
- Không chứa JSX.
- Không chứa side effect.

Utility chỉ thuộc một domain phải nằm trong feature đó.

Utility thực sự dùng cho nhiều domain độc lập mới được đưa vào:

```text
src/shared/utils/
```

---

## 12. Không tạo `shared/` bên trong mỗi feature chỉ để gom file

Không mặc định tạo:

```text
features/classes/shared/
```

chỉ để chứa các file dùng chung trong `classes`.

Nếu một component, hook, type hoặc utility được nhiều chức năng nhỏ bên trong `classes` sử dụng nhưng vẫn chỉ thuộc domain lớp học, hãy để tại technical folder tương ứng.

Ví dụ:

```text
features/classes/components/ClassStatusBadge.tsx
features/classes/types/class.types.ts
features/classes/utils/class.utils.ts
```

Không cần:

```text
features/classes/shared/components/ClassStatusBadge.tsx
```

`src/shared` chỉ dành cho code dùng lại giữa ít nhất hai domain độc lập hoặc hạ tầng UI toàn ứng dụng.

---

## 13. Ví dụ chuẩn – `classes`

```text
features/classes/
├── api/
│   ├── classes.api.ts
│   ├── classSettings.api.ts
│   ├── classApprovals.api.ts
│   └── classStudents.api.ts
│
├── components/
│   ├── overview/
│   │   ├── TeacherOverviewScreen.tsx
│   │   ├── TeacherClassSelector.tsx
│   │   └── ClassSummaryCard.tsx
│   │
│   ├── class-list/
│   │   ├── ClassCard.tsx
│   │   └── ClassList.tsx
│   │
│   ├── students/
│   │   ├── StudentTable.tsx
│   │   └── StudentCard.tsx
│   │
│   ├── settings/
│   │   ├── ClassSettingsForm.tsx
│   │   └── ClassDangerZone.tsx
│   │
│   └── approvals/
│       ├── JoinRequestCard.tsx
│       └── JoinRequestList.tsx
│
├── hooks/
│   ├── useTeacherClasses.ts
│   ├── useTeacherOverview.ts
│   ├── useClassSettings.ts
│   ├── useClassApprovals.ts
│   └── useClassStudents.ts
│
├── pages/
│   ├── TeacherOverviewPage.tsx
│   ├── TeacherClassesPage.tsx
│   ├── ClassDetailPage.tsx
│   ├── ClassSettingsPage.tsx
│   ├── ClassStudentsPage.tsx
│   └── ClassJoinRequestsPage.tsx
│
├── services/
│   └── classMapper.ts
│
├── types/
│   ├── class.types.ts
│   ├── classSettings.types.ts
│   ├── classApproval.types.ts
│   └── classStudent.types.ts
│
└── utils/
    └── class.utils.ts
```

---

## 14. Ví dụ chuẩn – `attendance`

```text
features/attendance/
├── api/
│   ├── attendance.api.ts
│   └── attendanceReports.api.ts
├── components/
│   ├── attendance-taking/
│   │   ├── AttendanceTable.tsx
│   │   └── AttendanceStatusSelect.tsx
│   └── reports/
│       ├── AttendanceSummary.tsx
│       └── AttendanceHistory.tsx
├── hooks/
│   ├── useAttendance.ts
│   ├── useUpdateAttendance.ts
│   └── useAttendanceReport.ts
├── pages/
│   ├── AttendancePage.tsx
│   └── AttendanceReportPage.tsx
├── types/
│   ├── attendance.types.ts
│   └── attendanceReport.types.ts
└── utils/
    └── attendance.utils.ts
```

---

## 15. Ví dụ chuẩn – `schedules`

```text
features/schedules/
├── api/
│   ├── schedules.api.ts
│   └── recurringSchedules.api.ts
├── components/
│   ├── calendar/
│   │   ├── ScheduleCalendar.tsx
│   │   └── ScheduleEvent.tsx
│   └── schedule-form/
│       ├── ScheduleForm.tsx
│       └── RecurrenceFields.tsx
├── hooks/
│   ├── useSchedules.ts
│   ├── useCreateSchedule.ts
│   └── useRecurringSchedule.ts
├── pages/
│   ├── SchedulePage.tsx
│   └── CreateSchedulePage.tsx
├── types/
│   └── schedule.types.ts
└── utils/
    └── schedule.utils.ts
```

---

## 16. Luồng phụ thuộc bắt buộc

Cấu trúc thư mục phải hỗ trợ luồng:

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

Ví dụ:

```text
ClassSettingsPage.tsx
        ↓
ClassSettingsForm.tsx
        ↓
useClassSettings.ts
        ↓
classSettings.api.ts
        ↓
apiClient.ts
        ↓
Backend
```

Không đảo ngược hướng phụ thuộc.

---

## 17. Import được phép

Feature có thể import:

```text
feature → shared
feature → services
feature → config
feature → assets
```

Bên trong cùng feature:

```text
pages → components
pages → hooks
hooks → api
hooks → types
api → types
api → services/api
components → types
components → utils
```

---

## 18. Import bị cấm

```text
shared   → features/*
services → features/*
api      → pages
api      → components
types    → component có side effect
feature A → internals của feature B
```

Không tạo vòng phụ thuộc giữa các feature.

Nếu hai feature cần một primitive thực sự trung lập, đưa primitive đó vào `src/shared`.

---

## 19. Khi nào một chức năng phải trở thành feature riêng?

Một chức năng nên trở thành feature riêng trong `src/features/` khi nó là một domain nghiệp vụ độc lập.

Ví dụ:

```text
assignments
attendance
grading
materials
schedules
tuition
```

Không đưa `attendance` vào:

```text
features/classes/attendance/
```

nếu hệ thống đã xác định Attendance là một domain riêng.

Ngược lại, các chức năng như:

```text
class settings
class approvals
teacher overview
class students
```

vẫn thuộc domain `classes`, vì vậy không cần biến mỗi chức năng thành một feature độc lập.

---

## 20. Quy tắc quyết định nhanh

Khi thêm code mới, hỏi theo thứ tự:

### Câu 1: Code thuộc domain nào?

Ví dụ:

```text
Tạo bài tập       → assignments
Điểm danh         → attendance
Cài đặt lớp       → classes
Duyệt vào lớp     → classes
Học phí           → tuition
Tài liệu          → materials
```

### Câu 2: File có trách nhiệm gì?

```text
HTTP request       → api
UI                 → components
React Query/flow   → hooks
Route-level screen → pages
DTO/model          → types
Mapping/orchestration → services
Pure function      → utils
```

### Câu 3: Technical folder có quá nhiều file không?

Nếu không:

```text
components/
├── ClassCard.tsx
├── ClassSelector.tsx
└── ClassSettingsForm.tsx
```

Nếu có nhiều nhóm rõ ràng:

```text
components/
├── overview/
├── settings/
├── students/
└── approvals/
```

### Câu 4: Folder con có thực sự cần không?

Nếu folder chỉ chứa một file và không có lý do rõ ràng để mở rộng, không tạo folder con.

---

## 21. Anti-pattern cần tránh

### 21.1. Mini-feature lồng nhau quá nhiều

Không nên:

```text
classes/
├── class-settings/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   └── types/
├── class-approvals/
│   ├── api/
│   ├── components/
│   └── hooks/
└── teacher-students/
    ├── components/
    └── hooks/
```

Ưu tiên:

```text
classes/
├── api/
├── components/
│   ├── settings/
│   ├── approvals/
│   └── students/
├── hooks/
├── pages/
└── types/
```

### 21.2. Folder một file không cần thiết

Không nên:

```text
hooks/
└── settings/
    └── useClassSettings.ts
```

Ưu tiên:

```text
hooks/
└── useClassSettings.ts
```

### 21.3. Đưa business code vào `shared`

Không:

```text
src/shared/components/ClassSettingsForm.tsx
```

Nếu chỉ Class Management sử dụng thì phải nằm trong:

```text
src/features/classes/components/
```

### 21.4. Tạo folder cho đủ template

Không tạo:

```text
services/
utils/
```

nếu chưa có file thực sự cần đặt trong đó.

---

## 22. Quy tắc đặt tên

Tên file phải thể hiện rõ domain/function.

Nên:

```text
classSettings.api.ts
classApproval.types.ts
useClassApprovals.ts
ClassSettingsPage.tsx
JoinRequestList.tsx
```

Tránh tên chung chung:

```text
api.ts
service.ts
types.ts
data.ts
helper.ts
Page.tsx
Form.tsx
```

Tên thư mục con trong `components` nên mô tả nhóm chức năng:

```text
overview/
settings/
approvals/
students/
assignment-form/
submission-review/
attendance-taking/
```

---

## 23. Quy tắc refactor feature hiện có

Khi một feature hiện tại bị phồng:

1. Xác định đâu là business feature gốc.
2. Xác định các folder con đang đóng vai trò mini-feature.
3. Di chuyển API về `api/`.
4. Di chuyển hook về `hooks/`.
5. Di chuyển page về `pages/`.
6. Di chuyển type về `types/`.
7. Chỉ giữ nhóm nghiệp vụ con bên trong `components/` khi cần.
8. Search toàn bộ import trước khi xóa folder cũ.
9. Sửa lazy imports và router nếu page bị đổi đường dẫn.
10. Chạy:

```powershell
npm run lint
npm run build
```

Không refactor cấu trúc nếu lint hoặc production build chưa đạt.

---

## 24. Checklist review cấu trúc feature

- [ ] Feature nằm đúng domain trong `src/features`.
- [ ] Cấp đầu tiên của feature ưu tiên `api/components/hooks/pages/services/types/utils`.
- [ ] Không tạo mini-feature lồng nhau nếu chức năng vẫn thuộc cùng domain.
- [ ] `components` chỉ chia folder con khi có nhóm UI rõ ràng.
- [ ] `api`, `hooks`, `types`, `pages` ưu tiên giữ phẳng.
- [ ] Không tạo folder chỉ chứa một file nếu không cần thiết.
- [ ] Không tạo folder rỗng chỉ để đủ template.
- [ ] Page không gọi API trực tiếp.
- [ ] Hook không chứa endpoint string.
- [ ] API sử dụng `src/services/api/apiClient.ts`.
- [ ] Business component không nằm trong `src/shared`.
- [ ] Không có dependency vòng giữa các feature.
- [ ] Search import trước khi di chuyển/xóa file.
- [ ] `npm run lint` thành công.
- [ ] `npm run build` thành công.

---

## 25. Công thức ghi nhớ

```text
src/features
    ↓
Business Domain
    ↓
Technical Responsibility
    ↓
Business Function nhỏ khi thực sự cần
```

Ví dụ:

```text
features
└── classes
    └── components
        └── settings
            └── ClassSettingsForm.tsx
```

Không ưu tiên:

```text
features
└── classes
    └── class-settings
        └── components
            └── ClassSettingsForm.tsx
```

Quy tắc ngắn gọn:

> **Domain ở ngoài → trách nhiệm kỹ thuật ở giữa → nhóm chức năng nhỏ ở trong.**

Và:

> **Nếu chưa cần folder thì không tạo. Nếu một file có thể nằm rõ ràng ở cấp hiện tại thì không thêm một cấp thư mục chỉ để phân loại.**
