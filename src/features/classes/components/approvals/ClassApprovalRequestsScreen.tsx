import {
  ArrowLeftOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Dropdown,
  Input,
  Pagination,
  Select,
  type MenuProps,
} from "antd";
import { JoinRequestList } from "@/features/classes/components/approvals/JoinRequestList";
import type { JoinRequestsFlowController } from "@/features/classes/types/classApproval.types";
import "./classApprovalRequestsScreen.css";

interface ClassApprovalRequestsScreenProps {
  flow: JoinRequestsFlowController;
}

function resultSummary(
  page: number,
  pageSize: number,
  totalCount: number,
): string {
  if (totalCount <= 0) return "0 yêu cầu";
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize + 1;
  const end = Math.min(safePage * safePageSize, totalCount);
  return `Hiển thị ${start}-${end} / ${totalCount} yêu cầu`;
}

export function ClassApprovalRequestsScreen({
  flow,
}: ClassApprovalRequestsScreenProps) {
  const menuItems: MenuProps["items"] = flow.classList.map((cls) => ({
    key: cls.id,
    label: cls.name,
    onClick: () => flow.selectClass(cls.id, cls.name),
  }));

  return (
    <main
      className="teacher-approvals-page"
      aria-label="Quản lý yêu cầu tham gia lớp học"
    >
      {flow.messageContextHolder}
      <div className="teacher-approvals-container">
        {/* Header */}
        <header className="teacher-approvals-header">
          <div className="teacher-approvals-header-left">
            <h1 className="teacher-approvals-title">
              <span>Quản lý yêu cầu theo lớp</span>
              <Dropdown
                menu={{
                  items: menuItems,
                  selectedKeys: [flow.classId],
                }}
                trigger={["click"]}
                overlayClassName="student-class-dropdown-menu"
              >
                <span className="student-page-title-class-trigger">
                  <span className="student-class-name-orange">
                    {flow.className}
                  </span>
                  <span className="student-title-chev-box">
                    <DownOutlined className="student-title-chev" />
                  </span>
                </span>
              </Dropdown>
            </h1>
          </div>

          <button
            type="button"
            className="teacher-approvals-back-btn"
            onClick={flow.goBack}
          >
            <ArrowLeftOutlined /> Quay lại tổng quan lớp
          </button>
        </header>

        {/* Error Alert */}
        {flow.isError && flow.errorMessage && (
          <Alert
            type="error"
            message="Không thể tải yêu cầu tham gia"
            description={flow.errorMessage}
            showIcon
            className="teacher-approvals-error"
            action={
              <button
                type="button"
                className="teacher-approvals-btn-approve"
                onClick={flow.handleRefetch}
              >
                Thử lại
              </button>
            }
          />
        )}

        {/* Card Content */}
        <section className="teacher-approvals-card">
          <div className="teacher-approvals-card-head">
            <div className="teacher-approvals-filter-group">
              <Input
                className="teacher-approvals-search-input"
                placeholder="Tìm học sinh, email..."
                prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                value={flow.searchTerm}
                onChange={(e) => flow.setSearchTerm(e.target.value)}
                allowClear
              />
              <div className="teacher-approvals-status-filter">
                <span className="teacher-approvals-filter-label">
                  Trạng thái
                </span>
                <Select
                  className="teacher-approvals-filter-select"
                  aria-label="Trạng thái"
                  value={flow.statusFilter}
                  onChange={flow.setStatusFilter}
                  options={[
                    { value: "all", label: "Tất cả trạng thái" },
                    { value: "pending", label: "Chờ duyệt" },
                    { value: "approved", label: "Đã duyệt" },
                    { value: "rejected", label: "Đã từ chối" },
                  ]}
                />
              </div>
              <div className="teacher-approvals-sort-filter">
                <span className="teacher-approvals-filter-label">Sắp xếp</span>
                <Select
                  className="teacher-approvals-sort-select"
                  aria-label="Sắp xếp"
                  value={flow.sortOption}
                  onChange={flow.setSortOption}
                  options={[
                    { value: "newest", label: "Mới nhất trước" },
                    { value: "oldest", label: "Cũ nhất trước" },
                  ]}
                />
              </div>
            </div>
          </div>

          <JoinRequestList
            items={flow.items}
            isLoading={flow.isLoading}
            processingStudentIds={flow.processingStudentIds}
            onApprove={flow.handleApprove}
            onReject={flow.handleReject}
          />

          {/* Pagination */}
          <div className="teacher-approvals-list-footer">
            <span className="teacher-approvals-result-summary">
              {resultSummary(flow.page, flow.pageSize, flow.totalCount)}
            </span>
            {flow.totalCount > flow.pageSize && (
              <Pagination
                current={flow.page}
                pageSize={flow.pageSize}
                total={flow.totalCount}
                onChange={flow.setPage}
                showSizeChanger={false}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
