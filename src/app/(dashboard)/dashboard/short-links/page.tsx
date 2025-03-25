import UserShortLinks from "@/components/dashboard/user/short-urls/short-urls";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Short Links",
};

type ShortLinksPageProps = {
  searchParams: Promise<{ page: string; search?: string }>;
};

export default async function ShortLinksPage({
  searchParams,
}: ShortLinksPageProps) {
  const { page, search } = await searchParams;

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <UserShortLinks
        initialSearch={search}
        initialPage={page ? Number(page) : undefined}
      />
    </div>
  );
}
