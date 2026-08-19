import {
  ArrowLeftOutlined,
  DeleteOutlined,
  DesktopOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Spin, message } from "antd";
import { Link } from "react-router-dom";
import { useSessions } from "@/features/profile/hooks/useSessions";

const formatSessionDate = (value: string) =>
  new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

interface ActiveSessionsPanelProps {
  profilePath: string;
}

export function ActiveSessionsPanel({ profilePath }: ActiveSessionsPanelProps) {
  const { query, revokeOne, revokeOthers } = useSessions();
  const busy = revokeOne.isPending || revokeOthers.isPending;
  const sessions = query.data ?? [];
  const hasOtherSessions = sessions.some((session) => !session.isCurrent);

  const handleRevokeOne = async (sessionId: string) => {
    try {
      await revokeOne.mutateAsync(sessionId);
      message.success("Đã thu hồi phiên đăng nhập.");
    } catch {
      message.error("Không thể thu hồi phiên đăng nhập.");
    }
  };

  const handleRevokeOthers = async () => {
    try {
      await revokeOthers.mutateAsync();
      message.success("Đã thu hồi các phiên khác.");
    } catch {
      message.error("Không thể thu hồi các phiên khác.");
    }
  };

  let content: React.ReactNode;
  if (query.isLoading) {
    content = (
      <div className="sessions-state">
        <Spin />
      </div>
    );
  } else if (query.isError) {
    content = (
      <div className="sessions-state">
        <p>Không thể tải danh sách phiên đăng nhập.</p>
        <button type="button" onClick={() => void query.refetch()}>
          Thử lại
        </button>
      </div>
    );
  } else if (sessions.length === 0) {
    content = (
      <div className="sessions-state">
        <SafetyCertificateOutlined />
        <p>Không có phiên đăng nhập nào được ghi nhận.</p>
      </div>
    );
  } else {
    content = (
      <ul>
        {sessions.map((session) => (
          <li
            key={session.sessionId}
            className={session.isCurrent ? "current" : ""}
          >
            <span className="sessions-device">
              <DesktopOutlined />
            </span>
            <div>
              <strong>IP {session.createdByIp || "Không xác định"}</strong>
              {session.isCurrent && <em>Phiên hiện tại</em>}
              <p>
                Tạo lúc {formatSessionDate(session.createdAt)} · Hết hạn{" "}
                {formatSessionDate(session.expiresAt)}
              </p>
            </div>
            {!session.isCurrent && (
              <button
                type="button"
                aria-label="Thu hồi phiên"
                disabled={busy}
                onClick={() => void handleRevokeOne(session.sessionId)}
              >
                <DeleteOutlined />
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="sessions-page">
      <header>
        <div>
          <h1>Phiên đăng nhập</h1>
          <p>Quản lý các thiết bị đang đăng nhập vào tài khoản của bạn.</p>
        </div>
        <Link to={profilePath}>
          <ArrowLeftOutlined /> Quay lại
        </Link>
      </header>
      <div className="sessions-toolbar">
        <div>
          <InfoCircleOutlined /> Phiên hiện tại được đánh dấu dựa trên refresh
          token đang dùng trên trình duyệt này.
        </div>
        <button
          type="button"
          disabled={busy || !hasOtherSessions}
          onClick={() => void handleRevokeOthers()}
        >
          {revokeOthers.isPending ? "Đang thu hồi..." : "Thu hồi phiên khác"}
        </button>
      </div>
      {content}
    </section>
  );
}
