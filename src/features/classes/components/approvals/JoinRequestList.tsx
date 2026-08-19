import { InboxOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { JoinRequestCard } from "@/features/classes/components/approvals/JoinRequestCard";
import type { JoinRequestRow } from "@/features/classes/types/classApproval.types";

interface JoinRequestListProps {
  items: JoinRequestRow[];
  isLoading: boolean;
  processingStudentIds: Set<string>;
  onApprove: (studentId: string, fullName: string) => Promise<void>;
  onReject: (studentId: string, fullName: string) => Promise<void>;
}

export function JoinRequestList({
  items,
  isLoading,
  processingStudentIds,
  onApprove,
  onReject,
}: JoinRequestListProps) {
  if (isLoading) {
    return (
      <div className="teacher-approvals-empty">
        <Spin size="large" />
        <p>Đang tải danh sách yêu cầu...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="teacher-approvals-empty">
        <InboxOutlined className="teacher-approvals-empty-icon" />
        <h3>Không có yêu cầu tham gia nào</h3>
      </div>
    );
  }

  return (
    <div className="teacher-approvals-table-wrap">
      <table className="teacher-approvals-table">
        <thead>
          <tr>
            <th>Học sinh</th>
            <th>Email</th>
            <th>Thời gian yêu cầu</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <JoinRequestCard
              key={item.studentId}
              item={item}
              isProcessing={processingStudentIds.has(item.studentId)}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
