import {
  CheckCircleFilled,
  CheckOutlined,
  ClockCircleOutlined,
  CloseCircleFilled,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import type { JoinRequestRow } from "@/features/classes/types/classApproval.types";
import { formatClassDateTime } from "@/features/classes/utils/class.utils";

function avatarToneClass(initials: string) {
  const toneMap: Record<string, string> = {
    NA: "teacher-approvals-avatar--na",
    TL: "teacher-approvals-avatar--tl",
    KL: "teacher-approvals-avatar--kl",
    MH: "teacher-approvals-avatar--mh",
    PT: "teacher-approvals-avatar--pt",
    QD: "teacher-approvals-avatar--qd",
    HN: "teacher-approvals-avatar--hn",
  };
  return toneMap[initials] || "";
}

interface JoinRequestCardProps {
  item: JoinRequestRow;
  isProcessing: boolean;
  onApprove: (studentId: string, fullName: string) => Promise<void>;
  onReject: (studentId: string, fullName: string) => Promise<void>;
}

export function JoinRequestCard({
  item,
  isProcessing,
  onApprove,
  onReject,
}: JoinRequestCardProps) {
  return (
    <tr>
      <td>
        <div className="teacher-approvals-student">
          <div
            className={`teacher-approvals-avatar ${avatarToneClass(item.initials)}`}
          >
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt={item.fullName} />
            ) : (
              item.initials
            )}
          </div>
          <span className="teacher-approvals-student-name">
            {item.fullName}
          </span>
        </div>
      </td>
      <td>{item.email}</td>
      <td>{formatClassDateTime(item.requestedAt)}</td>
      <td>
        {item.status === "Pending" ? (
          <span className="teacher-approvals-status-badge teacher-approvals-status-badge--pending">
            <ClockCircleOutlined /> Chờ duyệt
          </span>
        ) : item.status === "Active" ? (
          <span className="teacher-approvals-status-badge teacher-approvals-status-badge--active">
            <CheckCircleFilled /> Đã duyệt
          </span>
        ) : (
          <span className="teacher-approvals-status-badge teacher-approvals-status-badge--rejected">
            <CloseCircleFilled /> Đã từ chối
          </span>
        )}
      </td>
      <td>
        {item.status === "Pending" ? (
          <div className="teacher-approvals-actions">
            <button
              type="button"
              className="teacher-approvals-btn-approve"
              disabled={isProcessing}
              onClick={() => void onApprove(item.studentId, item.fullName)}
            >
              {isProcessing ? <Spin size="small" /> : <CheckOutlined />} Duyệt
            </button>
            <button
              type="button"
              className="teacher-approvals-btn-reject"
              disabled={isProcessing}
              onClick={() => void onReject(item.studentId, item.fullName)}
            >
              {isProcessing ? <Spin size="small" /> : <CloseOutlined />} Từ chối
            </button>
          </div>
        ) : item.actionResult ? (
          <div className="teacher-approvals-audit">
            <strong>
              {item.actionResult.status === "Active"
                ? "Duyệt bởi bạn"
                : "Từ chối bởi bạn"}
            </strong>
            <span>{formatClassDateTime(item.actionResult.updatedAt)}</span>
          </div>
        ) : (
          <span className="teacher-approvals-processed">
            <UserOutlined /> Đã xử lý
          </span>
        )}
      </td>
    </tr>
  );
}
