import { ShortenedUrlType } from "@/lib/db/schemas/shortened-urls";
import { formatTimeAgo } from "@/lib/utils/date";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import ShortUrlContextMenu from "./short-url-context-menu";

export type UserShortUrlProps = {
  link: ShortenedUrlType;
  refetch: () => Promise<void>;
  className?: string;
};

export default function UserShortUrl({
  link,
  refetch,
  className,
}: UserShortUrlProps) {
  return (
    <ShortUrlContextMenu link={link} refetch={refetch}>
      <Link href={`/s/${link.id}`}>
        <li
          className={cn(
            "grid",
            className,
            "hover:bg-muted/50 rounded-md group gap-2"
          )}
        >
          <p className="text-sm text-muted-foreground group-hover:text-primary">
            {link.id}
          </p>
          <p className="text-sm text-muted-foreground truncate">{link.url}</p>
          <p className="text-sm text-muted-foreground lg:block hidden">
            {link.clicks}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatTimeAgo(link.createdAt)}
          </p>
        </li>
      </Link>
    </ShortUrlContextMenu>
  );
}
