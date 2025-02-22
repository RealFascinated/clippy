import UserFiles from "@/components/dashboard/user/files/files";
import UserStatistics from "@/components/dashboard/user/statistic/statistics";
import WelcomeBanner from "@/components/dashboard/user/welcome-banner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // This shouldn't happen
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <WelcomeBanner username={session.user.name} />

      <UserStatistics />
      <UserFiles />
    </div>
  );
}
