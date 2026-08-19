import {
  Alert,
  Button,
  Input,
  Modal,
  Pagination,
  Select,
  Spin,
  Tooltip,
} from "antd";
import {
  AppstoreOutlined,
  FileAddOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TeacherClassSelector } from "@/features/classes/components/overview/TeacherClassSelector";
import { TeacherStudentDetailModal } from "./TeacherStudentDetailModal";
import { ChangeStudentClassModal } from "./ChangeStudentClassModal";
import { MetricUnavailable, StudentCard } from "./StudentCard";
import { StudentTable } from "./StudentTable";
import type { TeacherStudentListController } from "@/features/classes/types/classStudent.types";
import "./teacherStudentList.css";

function DisabledAction({
  children,
  icon,
}: {
  children: string;
  icon: React.ReactNode;
}) {
  return (
    <Tooltip title="Đang phát triển">
      <Button disabled icon={icon}>
        {children}
      </Button>
    </Tooltip>
  );
}

function DisabledFilter({ label, value }: { label: string; value: string }) {
  return (
    <Tooltip title="Đang phát triển">
      <span className="teacher-student-list__disabled-filter">
        <Select
          aria-label={label}
          value={value}
          disabled
          options={[{ value, label: value }]}
        />
      </span>
    </Tooltip>
  );
}

export function TeacherStudentListScreen({
  flow,
}: {
  flow: TeacherStudentListController;
}) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  if (flow.isLoadingClasses)
    return (
      <main className="teacher-student-list teacher-student-list--state">
        <Spin size="large" />
      </main>
    );
  if (flow.classesError)
    return (
      <main className="teacher-student-list teacher-student-list--state">
        <Alert type="error" message="Không thể tải danh sách lớp." />
      </main>
    );
  if (!flow.classes.length) {
    return (
      <main className="teacher-student-list teacher-student-list--state">
        <TeamOutlined />
        <h1>Chưa có lớp học</h1>
        <p>Hãy tạo lớp đầu tiên để quản lý học viên.</p>
        <Link to="/classes/new">Tạo lớp</Link>
      </main>
    );
  }
  if (!flow.classId || !flow.isClassIdValid || !flow.selectedClass) {
    return (
      <main className="teacher-student-list teacher-student-list--state">
        <TeamOutlined />
        <h1>Lớp đã chọn không khả dụng</h1>
        <p>Lớp này không thuộc danh sách lớp của bạn hoặc không còn tồn tại.</p>
        <Link to="/classes">Về trang tổng quan</Link>
      </main>
    );
  }

  const data = flow.data;
  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / data.pageSize))
    : 1;
  const isAccessError =
    flow.error &&
    "status" in flow.error &&
    (flow.error.status === 403 || flow.error.status === 404);

  return (
    <main className="teacher-student-list" aria-label="Danh sách học viên lớp">
      <header className="teacher-student-list__header">
        <div>
          <div>
            <TeacherClassSelector
              heading="Học viên lớp"
              selectedClass={flow.selectedClass}
              classes={flow.classes}
              isOpen={flow.isClassDrawerOpen}
              onOpen={flow.openClassDrawer}
              onClose={flow.closeClassDrawer}
              onSelect={flow.selectClass}
            />
            <p>
              Quản lý danh sách học viên của lớp, theo dõi trạng thái tham gia
              và tiến độ.
            </p>
          </div>
        </div>
        <div className="teacher-student-list__actions">
          <DisabledAction icon={<PlusOutlined />}>Thêm học viên</DisabledAction>
          <DisabledAction icon={<FileAddOutlined />}>
            Import Excel
          </DisabledAction>
        </div>
      </header>

      {flow.isLoading ? (
        <div className="teacher-student-list__loading">
          <Spin size="large" />
        </div>
      ) : null}
      {flow.error ? (
        <Alert
          type="error"
          showIcon
          message={flow.error.message}
          action={
            !isAccessError && (
              <Button size="small" onClick={flow.retry}>
                Thử lại
              </Button>
            )
          }
        />
      ) : null}

      {data ? (
        <>
          <section
            className="teacher-student-list__kpis"
            aria-label="Chỉ số học viên"
          >
            <article>
              <span className="teacher-student-list__kpi-icon teacher-student-list__kpi-icon--green">
                <TeamOutlined />
              </span>
              <small>Tổng học viên</small>
              <strong>{data.summary.totalStudents}</strong>
            </article>
            <article>
              <span className="teacher-student-list__kpi-icon teacher-student-list__kpi-icon--blue">
                ✓
              </span>
              <small>Đang học</small>
              <strong>{data.summary.activeCount}</strong>
            </article>
            <article>
              <span className="teacher-student-list__kpi-icon teacher-student-list__kpi-icon--amber">
                −
              </span>
              <small>Không hoạt động</small>
              <strong>{data.summary.inactiveCount}</strong>
            </article>
            <article>
              <span className="teacher-student-list__kpi-icon teacher-student-list__kpi-icon--violet">
                %
              </span>
              <small>Chuyên cần TB</small>
              <MetricUnavailable />
            </article>
            <article>
              <span className="teacher-student-list__kpi-icon teacher-student-list__kpi-icon--rose">
                ★
              </span>
              <small>Điểm TB</small>
              <MetricUnavailable />
            </article>
          </section>

          <section className="teacher-student-list__card">
            <div className="teacher-student-list__toolbar">
              <Input
                value={flow.searchInput}
                onChange={(event) => flow.setSearchInput(event.target.value)}
                prefix={<SearchOutlined />}
                placeholder="Tìm theo tên hoặc mã học viên..."
                allowClear
              />
              <Select
                aria-label="Lọc trạng thái"
                value={flow.status}
                onChange={flow.setStatus}
                options={[
                  { value: "all", label: "Tất cả trạng thái" },
                  { value: "Active", label: "Đang học" },
                  { value: "Left", label: "Đã rời lớp" },
                  { value: "Removed", label: "Đã bị xóa" },
                ]}
              />
              <DisabledFilter label="Nhóm học lực" value="Nhóm học lực" />
              <DisabledFilter label="Sắp xếp" value="Sắp xếp: Mặc định" />
              <div
                className="teacher-student-list__view-toggle"
                role="group"
                aria-label="Chế độ xem danh sách học viên"
              >
                <Tooltip title="Danh sách">
                  <Button
                    type="text"
                    aria-label="Hiển thị dạng danh sách"
                    aria-pressed={viewMode === "list"}
                    className={viewMode === "list" ? "is-active" : ""}
                    icon={<UnorderedListOutlined />}
                    onClick={() => setViewMode("list")}
                  />
                </Tooltip>
                <Tooltip title="Thẻ">
                  <Button
                    type="text"
                    aria-label="Hiển thị dạng thẻ"
                    aria-pressed={viewMode === "grid"}
                    className={viewMode === "grid" ? "is-active" : ""}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode("grid")}
                  />
                </Tooltip>
              </div>
              {flow.isFetching && <Spin size="small" />}
            </div>
            {viewMode === "list" ? (
              <StudentTable
                students={data.items}
                onOpen={flow.openStudentDetail}
                onOpenChangeClass={flow.openChangeClassModal}
                onOpenRemoveStudent={flow.openRemoveStudentModal}
              />
            ) : (
              <div
                className="teacher-student-list__grid"
                role="region"
                aria-label="Danh sách học viên dạng thẻ"
              >
                {data.items.map((student) => (
                  <StudentCard
                    key={student.studentId}
                    student={student}
                    onOpen={flow.openStudentDetail}
                    onOpenChangeClass={flow.openChangeClassModal}
                    onOpenRemoveStudent={flow.openRemoveStudentModal}
                  />
                ))}
                {data.items.length === 0 && (
                  <div className="teacher-student-list__empty">
                    Không có học viên phù hợp với bộ lọc hiện tại.
                  </div>
                )}
              </div>
            )}
            <footer className="teacher-student-list__pagination">
              <span>{data.totalCount} kết quả</span>
              <Pagination
                current={data.page}
                total={data.totalCount}
                pageSize={data.pageSize}
                showSizeChanger={false}
                onChange={flow.setPage}
                disabled={totalPages === 1}
              />
            </footer>
          </section>

          <aside
            className="teacher-student-list__sidebar"
            aria-label="Tóm tắt học viên"
          >
            <section>
              <h2>Học viên cần chú ý</h2>
              <p>
                Chức năng nhận diện học viên cần hỗ trợ đang được phát triển.
              </p>
              <Tooltip title="Đang phát triển">
                <Button disabled>Xem tất cả</Button>
              </Tooltip>
            </section>
            <section>
              <h2>Trợ lý AI</h2>
              <p>
                Gợi ý tiến độ học tập sẽ xuất hiện khi Backend cung cấp dữ liệu
                insight.
              </p>
            </section>
          </aside>
        </>
      ) : null}
      {flow.isStudentDetailOpen ? (
        <TeacherStudentDetailModal
          detail={flow.studentDetail}
          isLoading={flow.isStudentDetailLoading}
          error={flow.studentDetailError}
          onClose={flow.closeStudentDetail}
          onRetry={flow.retryStudentDetail}
        />
      ) : null}
      {flow.targetStudentForChangeClass && flow.selectedClass ? (
        <ChangeStudentClassModal
          student={flow.targetStudentForChangeClass}
          currentClassId={flow.selectedClass.classId}
          currentClassName={flow.selectedClass.className}
          classes={flow.classes}
          isSubmitting={flow.isChangingClass}
          error={flow.changeClassError}
          onClose={flow.closeChangeClassModal}
          onSubmit={flow.changeStudentClass}
        />
      ) : null}

      {flow.targetStudentForRemove ? (
        <Modal
          open={flow.isRemoveModalOpen}
          title="Xóa học sinh khỏi lớp"
          okText="Xóa học sinh"
          cancelText="Hủy"
          centered
          width={500}
          okButtonProps={{ danger: true, loading: flow.isRemovingStudent }}
          onOk={() => flow.removeStudent(flow.targetStudentForRemove!)}
          onCancel={flow.closeRemoveStudentModal}
        >
          <p className="teacher-student-list__remove-copy">
            Bạn có chắc chắn muốn xóa học sinh{" "}
            <strong>{flow.targetStudentForRemove.fullName}</strong> khỏi lớp học
            này không?
          </p>
        </Modal>
      ) : null}
    </main>
  );
}
