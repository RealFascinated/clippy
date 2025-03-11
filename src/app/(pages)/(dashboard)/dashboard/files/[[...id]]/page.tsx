import UserFiles from "@/components/dashboard/user/files/files";
import { getUser } from "@/lib/helpers/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Files",
};

type FilesPageProps = {
  params: Promise<{ id: string[] }>;
  searchParams: Promise<{ page: string; search?: string }>;
};

export default async function FilesPage({
  params,
  searchParams,
}: FilesPageProps) {
  const user = await getUser();
  const id = (await params).id;
  const favoritedOnly = id && id[0] === "favorited";
  const { page, search } = await searchParams;

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <UserFiles
        user={user}
        favoritedOnly={favoritedOnly}
        initialSearch={search}
        initialPage={page ? Number(page) : undefined}
      />
    </div>
  );
}
