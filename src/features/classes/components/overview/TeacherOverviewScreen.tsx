import {
  CalendarOutlined,
  CheckOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Input, Modal, Popconfirm, QRCode } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ClassSummaryCard, OverviewToneIcon } from "./ClassSummaryCard";
import { TeacherClassSelector } from "./TeacherClassSelector";
import type {
  NoteFormValues,
  TeacherClassNote,
  TeacherClassTodo,
  TodoFormValues,
} from "@/features/classes/types/classActivity.types";
import type { TeacherOverviewFlowController } from "@/features/classes/types/classOverview.types";
import "./teacherOverview.css";

interface TeacherOverviewScreenProps {
  flow: TeacherOverviewFlowController;
}

function formatCurrentDate() {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

type ActivityDialog =
  | { kind: "todo"; todo?: TeacherClassTodo }
  | { kind: "note"; note?: TeacherClassNote }
  | null;

function formatDueLabel(dueAt: string | null): string | null {
  if (!dueAt) return null;
  const due = new Date(dueAt);
  const today = new Date();
  const startToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  const startDue = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate(),
  ).getTime();
  const difference = Math.round((startDue - startToday) / 86_400_000);
  if (difference === 0) return "Hôm nay";
  if (difference === 1) return "Ngày mai";
  if (difference > 1 && difference < 7)
    return new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(due);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(due);
}

function toDateTimeInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function TeacherOverviewScreen({ flow }: TeacherOverviewScreenProps) {
  const [copiedField, setCopiedField] = useState<"code" | "link" | null>(null);
  const [activityDialog, setActivityDialog] = useState<ActivityDialog>(null);
  const [todoValues, setTodoValues] = useState<TodoFormValues>({
    title: "",
    dueAt: null,
  });
  const [noteValues, setNoteValues] = useState<NoteFormValues>({ content: "" });
  const selectedClass = flow.selectedClass;
  if (flow.isLoadingClasses)
    return (
      <main className="teacher-overview teacher-overview--state">
        Đang tải lớp học...
      </main>
    );
  if (flow.classesError)
    return (
      <main className="teacher-overview teacher-overview--state">
        Không thể tải danh sách lớp. Vui lòng thử lại.
      </main>
    );
  if (!selectedClass) {
    const hasUnavailableSelection = flow.classes.length > 0;
    return (
      <main className="teacher-overview teacher-overview--state">
        <h1>
          {hasUnavailableSelection
            ? "Lớp đã chọn không khả dụng"
            : "Chưa có lớp học"}
        </h1>
        <p>
          {hasUnavailableSelection
            ? "Lớp này không thuộc danh sách lớp của bạn hoặc không còn tồn tại."
            : "Hãy tạo lớp đầu tiên để bắt đầu quản lý học viên."}
        </p>
        <Link to={hasUnavailableSelection ? "/classes" : "/classes/new"}>
          {hasUnavailableSelection ? "Về trang tổng quan" : "Tạo lớp"}
        </Link>
      </main>
    );
  }
  const classId = selectedClass.id;
  const kpis = flow.data.kpisByClassId[classId] ?? [];
  const schedules = flow.data.schedulesByClassId[classId] ?? [];
  const { activity } = flow;
  const classSettingsPath = `/classes/${encodeURIComponent(selectedClass.id)}/settings`;
  const inviteSettingsPath = `/classes/${encodeURIComponent(selectedClass.id)}/settings#invite-settings`;
  const approvalsPath = `/classes/${encodeURIComponent(selectedClass.id)}/approval-requests`;
  const copyInviteValue = async (value: string, field: "code" | "link") => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  };
  const inviteContent = (() => {
    if (flow.isInvitationLoading)
      return (
        <p className="teacher-overview-invite__state">Đang tải mã mời...</p>
      );
    if (flow.invitationError) {
      return (
        <div className="teacher-overview-invite__state">
          <p>Không thể tải mã mời của lớp này.</p>
          <button type="button" onClick={flow.retryInvitation}>
            Thử lại
          </button>
        </div>
      );
    }
    if (!flow.invitation) {
      return (
        <div className="teacher-overview-invite__state">
          <p>Chưa có mã mời hoạt động cho lớp này.</p>
          <Link
            to={inviteSettingsPath}
            className="teacher-overview-invite__settings"
          >
            <SettingOutlined /> Cài đặt mã mời
          </Link>
        </div>
      );
    }

    return (
      <>
        <QRCode
          className="teacher-overview-invite__qr"
          value={flow.invitation.inviteLink}
          color="#073d7b"
          bgColor="#ffffff"
          size={120}
          bordered={false}
        />
        <dl>
          <div>
            <dt>Mã mời</dt>
            <dd>
              <span>{flow.invitation.inviteCode}</span>
              <button
                className="teacher-overview-invite__copy"
                type="button"
                onClick={() =>
                  copyInviteValue(flow.invitation!.inviteCode, "code")
                }
                aria-label="Sao chép mã mời"
              >
                <CopyOutlined />
              </button>
            </dd>
          </div>
          <div>
            <dt>Link mời</dt>
            <dd>
              <span>{flow.invitation.inviteLink}</span>
              <button
                className="teacher-overview-invite__copy"
                type="button"
                onClick={() =>
                  copyInviteValue(flow.invitation!.inviteLink, "link")
                }
                aria-label="Sao chép link mời"
              >
                <CopyOutlined />
              </button>
            </dd>
          </div>
        </dl>
        {copiedField && (
          <span className="teacher-overview-invite__copied" role="status">
            Đã sao chép {copiedField === "code" ? "mã mời" : "link mời"}
          </span>
        )}
        <Link
          to={inviteSettingsPath}
          className="teacher-overview-invite__settings"
        >
          <SettingOutlined /> Cài đặt mã mời
        </Link>
      </>
    );
  })();
  const openTodoDialog = (todo?: TeacherClassTodo) => {
    setTodoValues({ title: todo?.title ?? "", dueAt: todo?.dueAt ?? null });
    setActivityDialog({ kind: "todo", todo });
  };
  const openNoteDialog = (note?: TeacherClassNote) => {
    setNoteValues({ content: note?.content ?? "" });
    setActivityDialog({ kind: "note", note });
  };
  const saveActivityDialog = async () => {
    if (!activityDialog) return;
    try {
      if (activityDialog.kind === "todo") {
        if (!todoValues.title.trim() || todoValues.title.trim().length > 500)
          return;
        if (activityDialog.todo)
          await activity.updateTodo(activityDialog.todo, todoValues);
        else await activity.createTodo(todoValues);
      } else {
        if (
          !noteValues.content.trim() ||
          noteValues.content.trim().length > 2000
        )
          return;
        if (activityDialog.note)
          await activity.updateNote(activityDialog.note.noteId, noteValues);
        else await activity.createNote(noteValues);
      }
      setActivityDialog(null);
    } catch {
      // The hook exposes the safe, user-facing mutation error in the panel.
    }
  };
  const activityContent = activity.isLoading ? (
    <div className="teacher-overview-activity-state">
      Đang tải dữ liệu lớp...
    </div>
  ) : activity.error ? (
    <div className="teacher-overview-activity-state">
      <span>Không thể tải dữ liệu lớp.</span>
      <button type="button" onClick={activity.retry}>
        Thử lại
      </button>
    </div>
  ) : flow.activePanelTab === "tasks" ? (
    <ul className="teacher-overview-task-list">
      {activity.todos.length === 0 ? (
        <li className="teacher-overview-activity-empty">
          Chưa có việc cần làm.
        </li>
      ) : (
        activity.todos.map((todo) => (
          <li
            key={todo.todoId}
            className={todo.isCompleted ? "is-completed" : ""}
          >
            <button
              className={`teacher-overview-task-toggle${todo.isCompleted ? " is-completed" : ""}`}
              type="button"
              aria-label={`${todo.isCompleted ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"}: ${todo.title}`}
              disabled={activity.isMutating}
              onClick={() => void activity.toggleTodo(todo)}
            >
              {todo.isCompleted ? <CheckOutlined /> : null}
            </button>
            <span>{todo.title}</span>
            {formatDueLabel(todo.dueAt) ? (
              <em className="teacher-overview-badge teacher-overview-badge--amber">
                {formatDueLabel(todo.dueAt)}
              </em>
            ) : null}
            <div className="teacher-overview-activity-actions">
              <button
                type="button"
                aria-label={`Sửa việc: ${todo.title}`}
                onClick={() => openTodoDialog(todo)}
              >
                <EditOutlined />
              </button>
              <Popconfirm
                title="Xóa việc cần làm này?"
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => activity.deleteTodo(todo.todoId)}
              >
                <button type="button" aria-label={`Xóa việc: ${todo.title}`}>
                  <DeleteOutlined />
                </button>
              </Popconfirm>
            </div>
          </li>
        ))
      )}
    </ul>
  ) : (
    <ol className="teacher-overview-note-list">
      {activity.notes.length === 0 ? (
        <li className="teacher-overview-activity-empty">Chưa có ghi chú.</li>
      ) : (
        activity.notes.map((note) => (
          <li key={note.noteId}>
            <span>{note.content}</span>
            <div className="teacher-overview-activity-actions">
              <button
                type="button"
                aria-label="Sửa ghi chú"
                onClick={() => openNoteDialog(note)}
              >
                <EditOutlined />
              </button>
              <Popconfirm
                title="Xóa ghi chú này?"
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => activity.deleteNote(note.noteId)}
              >
                <button type="button" aria-label="Xóa ghi chú">
                  <DeleteOutlined />
                </button>
              </Popconfirm>
            </div>
          </li>
        ))
      )}
    </ol>
  );

  return (
    <main className="teacher-overview" aria-label="Tổng quan lớp giáo viên">
      <div className="teacher-overview__content">
        <header className="teacher-overview-page-head">
          <div>
            <TeacherClassSelector
              heading="Tổng quan lớp"
              selectedClass={{
                classId: selectedClass.id,
                className: selectedClass.name,
                studentCount: selectedClass.studentCount,
                imageUrl: selectedClass.imageUrl,
                status: selectedClass.status,
                tone: selectedClass.tone,
              }}
              classes={flow.classes.map((item) => ({
                classId: item.id,
                className: item.name,
                studentCount: item.studentCount,
                imageUrl: item.imageUrl,
                status: item.status,
                tone: item.tone,
              }))}
              filter={flow.classFilter}
              isOpen={flow.isClassDrawerOpen}
              onOpen={flow.openClassDrawer}
              onClose={flow.closeClassDrawer}
              onSelect={flow.selectClass}
            />
            <p>
              Chào {selectedClass.teacherName}, đây là tình hình lớp học hôm nay
              👋
            </p>
          </div>
          <div className="teacher-overview-header-actions">
            <Link
              className="teacher-overview-settings-link"
              to={classSettingsPath}
              aria-label="Cài đặt lớp"
            >
              <SettingOutlined />
            </Link>
            <Link
              className="teacher-overview-approval-link"
              to={approvalsPath}
              state={{ className: selectedClass.name }}
              aria-label={
                flow.pendingApprovalCount && flow.pendingApprovalCount > 0
                  ? `Duyệt học sinh vào lớp, ${flow.pendingApprovalCount} yêu cầu chờ duyệt`
                  : "Duyệt học sinh vào lớp"
              }
            >
              <ClockCircleOutlined />
              <span>Duyệt</span>
              {flow.pendingApprovalCount && flow.pendingApprovalCount > 0 ? (
                <b aria-hidden="true">{flow.pendingApprovalCount}</b>
              ) : null}
            </Link>
            <div className="teacher-overview-date-pill">
              <span>{formatCurrentDate()}</span>
              <CalendarOutlined />
            </div>
          </div>
        </header>

        <section className="teacher-overview-kpis" aria-label="Chỉ số lớp học">
          {kpis.map((kpi) => (
            <ClassSummaryCard
              key={kpi.label}
              item={kpi}
              onClick={
                kpi.label === "Mã mời vào lớp"
                  ? flow.openInviteDialog
                  : undefined
              }
            />
          ))}
        </section>

        <section className="teacher-overview-panels">
          <section
            className="teacher-overview-panel"
            aria-labelledby="teacher-schedule-title"
          >
            <div className="teacher-overview-panel-head">
              <div className="teacher-overview-panel-title">
                <OverviewToneIcon tone="violet" />
                <h2 id="teacher-schedule-title">Lịch sắp tới</h2>
              </div>
              <span className="teacher-overview-panel-more">Cả tuần</span>
            </div>
            <div className="teacher-overview-schedule-list">
              {schedules.map((item) => (
                <div
                  className="teacher-overview-schedule"
                  key={`${item.day}-${item.title}`}
                >
                  <div>
                    <strong>{item.day}</strong>
                    <span>{item.weekday}</span>
                  </div>
                  <p>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className="teacher-overview-panel"
            aria-labelledby="teacher-task-note-title"
          >
            <div className="teacher-overview-panel-head">
              <div
                className="teacher-overview-segmented"
                aria-label="Nội dung quản lý lớp"
              >
                <button
                  type="button"
                  className={flow.activePanelTab === "tasks" ? "is-active" : ""}
                  onClick={() => flow.setActivePanelTab("tasks")}
                >
                  <CheckSquareOutlined /> Việc cần làm
                </button>
                <button
                  type="button"
                  className={flow.activePanelTab === "notes" ? "is-active" : ""}
                  onClick={() => flow.setActivePanelTab("notes")}
                >
                  <StarOutlined /> Ghi chú
                </button>
              </div>
              <div className="teacher-overview-activity-head-actions">
                <span
                  id="teacher-task-note-title"
                  className="teacher-overview-panel-more"
                >
                  {flow.activePanelTab === "tasks"
                    ? `${activity.todos.filter((todo) => todo.isCompleted).length}/${activity.todos.length}`
                    : activity.notes.length}
                </span>
                <button
                  type="button"
                  className="teacher-overview-add-activity"
                  aria-label={
                    flow.activePanelTab === "tasks"
                      ? "Thêm việc cần làm"
                      : "Thêm ghi chú"
                  }
                  onClick={() =>
                    flow.activePanelTab === "tasks"
                      ? openTodoDialog()
                      : openNoteDialog()
                  }
                >
                  <PlusOutlined />
                </button>
              </div>
            </div>
            {activityContent}
            {activity.mutationError ? (
              <p className="teacher-overview-activity-error" role="alert">
                Không thể lưu thay đổi. Vui lòng thử lại.
              </p>
            ) : null}
          </section>
        </section>
      </div>

      {flow.isInviteDialogOpen && (
        <div
          className="teacher-overview-invite-overlay"
          role="presentation"
          onMouseDown={flow.closeInviteDialog}
        >
          <section
            className="teacher-overview-invite-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="teacher-invite-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="teacher-overview-invite__close"
              onClick={flow.closeInviteDialog}
              aria-label="Đóng mã mời"
            >
              ×
            </button>
            <h2 id="teacher-invite-title">Mã mời vào lớp</h2>
            <p>
              Chia sẻ mã này để học viên tham gia{" "}
              <strong>{selectedClass.name}</strong>.
            </p>
            {inviteContent}
          </section>
        </div>
      )}
      <Modal
        title={
          activityDialog?.kind === "todo"
            ? activityDialog.todo
              ? "Sửa việc cần làm"
              : "Thêm việc cần làm"
            : activityDialog?.note
              ? "Sửa ghi chú"
              : "Thêm ghi chú"
        }
        open={activityDialog !== null}
        onCancel={() => setActivityDialog(null)}
        onOk={() => void saveActivityDialog()}
        confirmLoading={activity.isMutating}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnHidden
      >
        {activityDialog?.kind === "todo" ? (
          <div className="teacher-overview-form">
            <label htmlFor="teacher-todo-title">Nội dung</label>
            <Input
              id="teacher-todo-title"
              value={todoValues.title}
              maxLength={500}
              status={todoValues.title.trim() ? undefined : "error"}
              onChange={(event) =>
                setTodoValues((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />
            <span className="teacher-overview-form__count" aria-live="polite">
              {todoValues.title.length}/500
            </span>
            <label htmlFor="teacher-todo-due">Hạn hoàn thành</label>
            <input
              id="teacher-todo-due"
              type="datetime-local"
              value={toDateTimeInput(todoValues.dueAt)}
              onChange={(event) =>
                setTodoValues((current) => ({
                  ...current,
                  dueAt: event.target.value
                    ? new Date(event.target.value).toISOString()
                    : null,
                }))
              }
            />
          </div>
        ) : (
          <div className="teacher-overview-form">
            <label htmlFor="teacher-note-content">Nội dung</label>
            <Input.TextArea
              id="teacher-note-content"
              value={noteValues.content}
              maxLength={2000}
              autoSize={{ minRows: 4, maxRows: 8 }}
              status={noteValues.content.trim() ? undefined : "error"}
              onChange={(event) =>
                setNoteValues({ content: event.target.value })
              }
            />
            <span className="teacher-overview-form__count" aria-live="polite">
              {noteValues.content.length}/2000
            </span>
          </div>
        )}
      </Modal>
    </main>
  );
}
