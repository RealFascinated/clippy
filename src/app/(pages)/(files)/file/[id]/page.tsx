import FileVideoPlayer from "@/components/file/video-player";
import { env } from "@/lib/env";
import { getFileById } from "@/lib/helpers/file";
import { getFileName } from "@/lib/utils/file";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type FilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: FilePageProps): Promise<Metadata> {
  const { id } = await params;
  const fileMeta = await getFileById(id);
  if (!fileMeta) {
    return notFound();
  }

  const fileName = getFileName(fileMeta);

  return {
    description: undefined, // remove it for now
    openGraph: {
      title: fileName,
      images: {
        url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${fileName}`,
      },
    },
    twitter: {
      // Large image
      card: "summary_large_image",
    },
  };
}

export default async function FilePage({ params }: FilePageProps) {
  const { id } = await params;
  const fileMeta = await getFileById(id);
  if (!fileMeta) {
    return notFound();
  }

  const url = `/${getFileName(fileMeta)}`;
  const isImage = fileMeta.mimeType.startsWith("image");
  const isVideo = fileMeta.mimeType.startsWith("video");

  return (
    <div className="flex w-full text-center justify-center">
      <div className="bg-secondary/70 p-2 w-full md:w-4xl rounded-md flex flex-col items-center">
        <span className="text-xl font-semibold">{getFileName(fileMeta)}</span>

        {isImage && (
          <img
            src={url}
            alt={`Image for ${getFileName(fileMeta)}`}
            className="max-h-[70dvh]"
          />
        )}

        {isVideo && <FileVideoPlayer url={url} className="max-h-[70dvh]" />}
      </div>
    </div>
  );
}
