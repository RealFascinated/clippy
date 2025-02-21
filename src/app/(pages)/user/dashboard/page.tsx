import UploadToken from "@/components/user/upload-token";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <span>Welcome, {session?.user.name}!</span>

      <UploadToken />
    </div>
  );
}
