import { useParams } from "react-router-dom";
import { ClassApprovalRequestsScreen } from "@/features/classes/components/approvals/ClassApprovalRequestsScreen";
import { useClassApprovals } from "@/features/classes/hooks/useClassApprovals";

export default function ClassJoinRequestsPage() {
  const { classId } = useParams<{ classId: string }>();
  return <ClassApprovalRequestsScreen flow={useClassApprovals(classId)} />;
}
