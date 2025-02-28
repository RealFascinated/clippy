import { getUser } from "@/lib/auth";

export default async function UserSettings() {
  const user = await getUser();
  return <div>User settings are not yet a thing.</div>;
}
