import {
  CameraOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CreditCardOutlined,
  EditOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Form, Input } from "antd";
import type { useProfileFlow } from "@/features/profile/hooks/useProfileFlow";
import type {
  ProfileUpdate,
  TeacherBankUpdate,
  TeachingWindowUpdate,
  UserProfile,
} from "@/features/profile/types/profile.types";

interface ProfileDetailsScreenProps {
  profile: UserProfile;
  flow: ReturnType<typeof useProfileFlow>;
}

const shown = (value?: string | null) => value?.trim() || "Chưa cập nhật";

export function ProfileDetailsScreen({
  profile,
  flow,
}: ProfileDetailsScreenProps) {
  const teacher = profile.roleName === "Teacher";
  const role = teacher ? "Giáo viên" : "Học sinh";
  const profileInitial: ProfileUpdate = {
    fullName: profile.fullName,
    phone: profile.phone ?? "",
    dateOfBirth: profile.studentProfile?.dateOfBirth?.slice(0, 10),
    schoolName: profile.studentProfile?.schoolName ?? "",
    parentName: profile.studentProfile?.parentName ?? "",
    parentPhone: profile.studentProfile?.parentPhone ?? "",
  };
  const bankInitial: TeacherBankUpdate = {
    bankName: profile.teacherBank?.bankName ?? "",
    bankAccountNumber: profile.teacherBank?.bankAccountNumber ?? "",
    bankAccountHolderName: profile.teacherBank?.bankAccountHolderName ?? "",
  };
  const windowInitial: TeachingWindowUpdate = {
    start: profile.teachingWindow?.start ?? "07:00",
    end: profile.teachingWindow?.end ?? "21:00",
  };

  return (
    <main className="profile-match-shell">
      <section className="profile-match-card profile-main-card">
        <header>
          <div>
            <h2>
              Hồ sơ của tôi
              {profile.emailVerified && (
                <span>
                  <CheckCircleFilled /> Đã xác thực email
                </span>
              )}
            </h2>
            <p>Xem và quản lý thông tin cá nhân của bạn.</p>
          </div>
          {!flow.editingProfile && (
            <button
              className="profile-edit-blue"
              type="button"
              onClick={() => flow.setEditingProfile(true)}
            >
              <EditOutlined /> Chỉnh sửa
            </button>
          )}
        </header>
        <div className="profile-match-body">
          <aside>
            <div className="profile-match-avatar">
              <img
                src={profile.avatarUrl || "/assets/lam/orbit-core.png"}
                alt={profile.fullName}
              />
              <input
                ref={flow.avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                hidden
                onChange={flow.uploadSelectedAvatar}
              />
              <button
                type="button"
                aria-label="Đổi ảnh đại diện"
                title="Cập nhật ảnh đại diện"
                disabled={flow.avatar.isPending}
                onClick={flow.selectAvatar}
              >
                <CameraOutlined spin={flow.avatar.isPending} />
              </button>
            </div>
            <h3>{profile.fullName}</h3>
            <b>{role}</b>
            <div className="profile-contact">
              <small>
                <MailOutlined /> {profile.email}
              </small>
              <small>
                <PhoneOutlined /> {shown(profile.phone)}
              </small>
            </div>
          </aside>
          <Form<ProfileUpdate>
            key={`${profile.userId}-${flow.editingProfile}`}
            layout="vertical"
            initialValues={profileInitial}
            onFinish={(values) => flow.save.mutate(values)}
          >
            <div className="profile-info-table">
              <div>
                <label>Họ và tên</label>
                {flow.editingProfile ? (
                  <Form.Item
                    name="fullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên." },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                ) : (
                  <strong>{profile.fullName}</strong>
                )}
              </div>
              <div>
                <label>Email</label>
                <strong>
                  {profile.email}{" "}
                  {profile.emailVerified && (
                    <CheckCircleFilled className="verified" />
                  )}
                </strong>
              </div>
              <div>
                <label>Số điện thoại</label>
                {flow.editingProfile ? (
                  <Form.Item name="phone">
                    <Input />
                  </Form.Item>
                ) : (
                  <strong>{shown(profile.phone)}</strong>
                )}
              </div>
              <div>
                <label>Vai trò</label>
                <strong>{role}</strong>
              </div>
              {!teacher && (
                <>
                  <div>
                    <label>Ngày sinh</label>
                    {flow.editingProfile ? (
                      <Form.Item name="dateOfBirth">
                        <Input type="date" />
                      </Form.Item>
                    ) : (
                      <strong>
                        {shown(
                          profile.studentProfile?.dateOfBirth?.slice(0, 10),
                        )}
                      </strong>
                    )}
                  </div>
                  <div>
                    <label>Trường học</label>
                    {flow.editingProfile ? (
                      <Form.Item name="schoolName">
                        <Input />
                      </Form.Item>
                    ) : (
                      <strong>
                        {shown(profile.studentProfile?.schoolName)}
                      </strong>
                    )}
                  </div>
                </>
              )}
            </div>
            {flow.editingProfile && (
              <footer className="profile-form-actions">
                <button
                  type="button"
                  onClick={() => flow.setEditingProfile(false)}
                >
                  Hủy
                </button>
                <button
                  className="primary"
                  type="submit"
                  disabled={flow.save.isPending}
                >
                  {flow.save.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </footer>
            )}
          </Form>
        </div>
      </section>

      {teacher && (
        <>
          <section className="profile-match-card profile-section-card">
            <header>
              <div>
                <h2>
                  <CreditCardOutlined /> Thông tin tài khoản ngân hàng
                </h2>
                <p>
                  Dùng để nhận thanh toán học phí, hoàn tiền hoặc các giao dịch
                  khác.
                </p>
              </div>
              {!flow.editingBank && (
                <button
                  className="profile-edit-blue"
                  type="button"
                  onClick={() => flow.setEditingBank(true)}
                >
                  <EditOutlined /> Chỉnh sửa
                </button>
              )}
            </header>
            <Form<TeacherBankUpdate>
              key={`bank-${flow.editingBank}`}
              initialValues={bankInitial}
              onFinish={(values) => flow.bank.mutate(values)}
            >
              <div className="profile-three-fields">
                {(
                  [
                    "bankName",
                    "bankAccountNumber",
                    "bankAccountHolderName",
                  ] as const
                ).map((name, index) => (
                  <div key={name}>
                    <label>
                      {["Ngân hàng", "Số tài khoản", "Chủ tài khoản"][index]}
                    </label>
                    {flow.editingBank ? (
                      <Form.Item name={name}>
                        <Input
                          placeholder={
                            [
                              "Ví dụ: Vietcombank",
                              "Nhập số tài khoản",
                              "Họ tên chủ tài khoản",
                            ][index]
                          }
                        />
                      </Form.Item>
                    ) : (
                      <strong>{shown(bankInitial[name])}</strong>
                    )}
                  </div>
                ))}
              </div>
              {flow.editingBank && (
                <footer className="profile-form-actions">
                  <button
                    type="button"
                    onClick={() => flow.setEditingBank(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="primary"
                    type="submit"
                    disabled={flow.bank.isPending}
                  >
                    Lưu thay đổi
                  </button>
                </footer>
              )}
            </Form>
            <div className="bank-note">
              <InfoCircleOutlined /> Mỗi giáo viên chỉ có một bộ thông tin ngân
              hàng để nhận thanh toán.
            </div>
          </section>

          <section className="profile-match-card profile-section-card">
            <header>
              <div>
                <h2>
                  <ClockCircleOutlined /> Khung giờ dạy
                </h2>
                <p>Áp dụng cho tất cả lớp của bạn khi tạo lịch dạy.</p>
              </div>
              {!flow.editingWindow && (
                <button
                  className="profile-edit-blue"
                  type="button"
                  onClick={() => flow.setEditingWindow(true)}
                >
                  <EditOutlined /> Chỉnh sửa
                </button>
              )}
            </header>
            <Form<TeachingWindowUpdate>
              key={`window-${flow.editingWindow}`}
              initialValues={windowInitial}
              onFinish={(values) => flow.teaching.mutate(values)}
            >
              <div className="profile-three-fields profile-window-fields">
                <div>
                  <label>Bắt đầu</label>
                  {flow.editingWindow ? (
                    <Form.Item name="start">
                      <Input type="time" />
                    </Form.Item>
                  ) : (
                    <strong>{windowInitial.start}</strong>
                  )}
                </div>
                <div>
                  <label>Kết thúc</label>
                  {flow.editingWindow ? (
                    <Form.Item name="end">
                      <Input type="time" />
                    </Form.Item>
                  ) : (
                    <strong>{windowInitial.end}</strong>
                  )}
                </div>
              </div>
              {flow.editingWindow && (
                <footer className="profile-form-actions">
                  <button
                    type="button"
                    onClick={() => flow.setEditingWindow(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="primary"
                    type="submit"
                    disabled={flow.teaching.isPending}
                  >
                    Lưu khung giờ
                  </button>
                </footer>
              )}
            </Form>
          </section>
        </>
      )}

      <div className="profile-match-security">
        <SafetyCertificateOutlined />
        <div>
          <b>Bảo mật thông tin</b>
          <p>
            Chúng tôi cam kết bảo mật thông tin cá nhân và chỉ sử dụng cho mục
            đích vận hành hệ thống.
          </p>
        </div>
      </div>
    </main>
  );
}
