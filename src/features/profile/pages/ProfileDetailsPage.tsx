import { Alert, Skeleton } from "antd";
import { useSearchParams } from "react-router-dom";
import { ActiveSessionsPanel } from "@/features/profile/components/ActiveSessionsPanel";
import { ProfileDetailsScreen } from "@/features/profile/components/ProfileDetailsScreen";
import { ProfilePasswordView } from "@/features/profile/components/ProfilePasswordView";
import { useProfileFlow } from "@/features/profile/hooks/useProfileFlow";
import { getApiErrorMessage } from "@/services/api/getApiErrorMessage";
import "@/features/profile/profile.css";

export default function ProfileDetailsPage() {
  const [params] = useSearchParams();
  const flow = useProfileFlow();

  if (flow.query.isLoading)
    return (
      <div className="profile-match-shell">
        <Skeleton active />
      </div>
    );
  if (flow.query.isError || !flow.query.data) {
    return (
      <Alert
        type="error"
        showIcon
        message="Không thể tải hồ sơ"
        description={getApiErrorMessage(flow.query.error)}
      />
    );
  }

  const profilePath =
    flow.query.data.roleName === "Teacher"
      ? "/teacher/profile"
      : "/student/profile";
  if (params.get("tab") === "password") {
    return (
      <div className="profile-match-shell">
        <ProfilePasswordView profilePath={profilePath} />
      </div>
    );
  }
  if (params.get("tab") === "sessions") {
    return (
      <div className="profile-match-shell">
        <ActiveSessionsPanel profilePath={profilePath} />
      </div>
    );
  }

  return <ProfileDetailsScreen profile={flow.query.data} flow={flow} />;
}
