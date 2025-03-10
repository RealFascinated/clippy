import UserFiles from "@/components/dashboard/user/files/files";
import { getUser } from "@/lib/helpers/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Files",
};

type FilesPageProps = {
  params: Promise<{ id: string[] }>;
  searchParams: Promise<{ search?: string }>;
};

export default async function FilesPage({
  params,
  searchParams,
}: FilesPageProps) {
  const user = await getUser();
  const id = (await params).id;
  const favoritedOnly = id && id[0] === "favorited";
  const search = (await searchParams).search;

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <UserFiles
        user={user}
        favoritedOnly={favoritedOnly}
        initialSearch={search}
      />
    </div>
  );
}
