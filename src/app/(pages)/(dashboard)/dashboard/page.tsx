import UserFiles from "@/components/dashboard/user/files/files";
import UserStatistics from "@/components/dashboard/user/statistic/statistics";
import WelcomeBanner from "@/components/dashboard/user/welcome-banner";
import { getUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getUser();
  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <WelcomeBanner username={user.name} />

      <UserStatistics />
      <UserFiles />
    </div>
  );
}
