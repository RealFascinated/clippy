import UploadToken from "@/components/dashboard/user/upload-token";
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
    <div className="flex flex-col gap-2 w-full items-center">
      <span>Welcome, {session.user.name}!</span>

      <UploadToken uploadToken={session.user.uploadToken} />
    </div>
  );
}
