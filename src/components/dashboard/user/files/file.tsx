"use client";

import FileExtensionIcon from "@/components/file-icon";
import FileVideoPlayer from "@/components/file/video-player";
import SimpleTooltip from "@/components/simple-tooltip";
import { Button } from "@/components/ui/button";
import { InlineCodeBlock } from "@/components/ui/code-block";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Loader from "@/components/ui/loader";
import { ScreenSize, useIsScreenSize } from "@/hooks/use-mobile";
import { FileType } from "@/lib/db/schemas/file";
import { env } from "@/lib/env";
import request from "@/lib/request";
import { getFileName } from "@/lib/utils/file";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { formatBytes } from "@/lib/utils/utils";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { format, formatDistance } from "date-fns";
import { DownloadIcon, LinkIcon, PlayIcon, TrashIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const ReactPlayer = dynamic(() => import("react-player"));

type UserFileProps = {
	fileMeta: FileType;
	refetch: () => Promise<void>;
};

export default function UserFile({ fileMeta, refetch }: UserFileProps) {
	const isMobile = useIsScreenSize(ScreenSize.Small);
	const hasThumbnail =
		fileMeta.mimeType.startsWith("video") ||
		fileMeta.mimeType.startsWith("image");

	const currentDate = new Date();
	const uploadedDate = new Date(fileMeta.createdAt);
	const difference = currentDate.getTime() - uploadedDate.getTime();

	const exactDate: string = format(fileMeta.createdAt, "dd/MM/yyyy - HH:mm a");
	const formattedDate =
		difference > 86400000 // 24 hours in milliseconds
			? format(uploadedDate, "MM/dd/yyyy HH:mm a")
			: formatDistance(uploadedDate, currentDate) + " ago";

	function copyUrl() {
		navigator.clipboard.writeText(
			`${env.NEXT_PUBLIC_WEBSITE_URL}/${getFileName(fileMeta)}`
		);

		toast(`Copied the url for ${getFileName(fileMeta)} to your clipboard`);
	}

	return (
		<div className="bg-card h-full flex flex-col items-center rounded-md">
			<div className="h-full p-2 flex flex-col gap-1">
				<div className="flex flex-col items-center select-none">
					{/* File Name */}
					<span>{getFileName(fileMeta)}</span>

					{/* Upload Date */}
					<SimpleTooltip content={`Uploaded on ${exactDate}`}>
						<span className="text-sm text-muted-foreground">
							{formattedDate}
						</span>
					</SimpleTooltip>
				</div>

				{/* Preview */}
				<div className="flex-1 flex items-center w-full justify-center">
					{hasThumbnail ? (
						<FilePreview fileMeta={fileMeta} />
					) : (
						<div className="flex justify-center items-center">
							<div className="w-16">
								<FileExtensionIcon extension={fileMeta.extension} />
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Stats */}
			<div className="flex gap-2 items-center justify-between w-full px-1.5 bg-zinc-800/65 py-1 rounded-bl-md rounded-br-md">
				<span className="text-sm text-muted-foreground">
					{formatBytes(fileMeta.size)}
				</span>

				<div className="flex gap-2 items-center">
					<SimpleTooltip content="Copy URL">
						<button className="cursor-pointer" onClick={() => copyUrl()}>
							<LinkIcon className="size-4.5 hover:opacity-80 transition-all transform-gpu" />
						</button>
					</SimpleTooltip>

					{/* Download File */}
					<SimpleTooltip content="Download File">
						<Link
							href={`/${getFileName(fileMeta)}?incrementviews=false&download=true`}
							prefetch={false}
							draggable={false}
						>
							<DownloadIcon className="size-4.5 hover:opacity-80 transition-all transform-gpu" />
						</Link>
					</SimpleTooltip>

					{!isMobile && <FileInfo fileMeta={fileMeta} />}

					{/* Delete File Button */}
					<DeleteFileDialog fileMeta={fileMeta} refetch={refetch} />
				</div>
			</div>
		</div>
	);
}

function FilePreview({ fileMeta }: { fileMeta: FileType }) {
	const url = `/${getFileName(fileMeta)}`;
	const isImage = fileMeta.mimeType.startsWith("image");
	const isVideo = fileMeta.mimeType.startsWith("video");

	const [loading, setLoading] = useState<boolean>(
		isVideo || isImage ? true : false
	);

	return (
		<Dialog>
			<DialogTrigger className="relative cursor-pointer w-full flex items-center justify-center">
				<img
					src={fileMeta.hasThumbnail ? `/thumbnails/${fileMeta.id}.webp` : url}
					alt="Recent File Image Preview"
					className="transparent max-h-36"
					onLoad={() => setLoading(false)}
					draggable={false}
				/>
				{loading && (
					<div className="w-full flex justify-center">
						<Loader />
					</div>
				)}
				{fileMeta.mimeType.startsWith("video") && !loading && (
					<PlayIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-10" />
				)}
			</DialogTrigger>
			<DialogContent className="flex flex-col items-center w-full sm:w-fit lg:max-w-4xl">
				<DialogHeader>
					<DialogTitle>{getFileName(fileMeta)}</DialogTitle>
				</DialogHeader>
				{isImage && (
					<img
						src={url}
						alt={`Image for ${getFileName(fileMeta)}`}
						className="max-h-[70vh]"
					/>
				)}

				{isVideo && <FileVideoPlayer url={url} className="max-h-[70vh]" />}
			</DialogContent>
		</Dialog>
	);
}

function DeleteFileDialog({ fileMeta, refetch }: UserFileProps) {
	const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

	/**
	 * Deletes a file
	 *
	 * @param fileMeta the file to delete
	 */
	async function deleteFile(fileMeta: FileType) {
		try {
			await request.get(`/api/user/file/delete/${fileMeta.deleteKey}`, {
				throwOnError: true,
				withCredentials: true, // use cookies
			});
			await refetch();
			toast(`Successfully deleted ${getFileName(fileMeta)}!`);
		} catch {
			toast(`Failed to delete ${getFileName(fileMeta)}`);
		}
		setDeleteConfirm(false);
	}

	return (
		<Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
			<DialogTrigger>
				<SimpleTooltip className="bg-destructive" content="Delete File">
					<TrashIcon className="size-4 text-red-400 hover:opacity-80 cursor-pointer transition-all transform-gpu" />
				</SimpleTooltip>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This will delete the file{" "}
						<InlineCodeBlock>{getFileName(fileMeta)}</InlineCodeBlock>, this
						action cannot be undone.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						className="w-fit"
						variant="destructive"
						onClick={() => deleteFile(fileMeta)}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function FileInfo({ fileMeta }: { fileMeta: FileType }) {
	return (
		<Dialog>
			<DialogTrigger>
				<SimpleTooltip content="File Info">
					<InformationCircleIcon className="size-4.5 cursor-pointer hover:opacity-80 transition-all transform-gpu" />
				</SimpleTooltip>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>File Information</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col">
					{/* File Name */}
					<span>
						<span className="font-semibold">Name:</span> {getFileName(fileMeta)}
					</span>

					{/* Original File Name */}
					<span>
						<span className="font-semibold">Original Name:</span>{" "}
						{fileMeta.originalName ?? "Unknown"}
					</span>

					{/* File Size */}
					<span>
						<span className="font-semibold">Size:</span>{" "}
						{formatBytes(fileMeta.size)}
					</span>

					{/* Mime Type */}
					<span>
						<span className="font-semibold">Mimetype:</span> {fileMeta.mimeType}
					</span>

					{/* Views */}
					<span>
						<span className="font-semibold">Views:</span>{" "}
						{formatNumberWithCommas(fileMeta.views)}
					</span>

					{/* Upload Date */}
					<span>
						<span className="font-semibold">Uploaded Date:</span>{" "}
						{format(fileMeta.createdAt, "dd/MM/yyyy - HH:mm a")}
					</span>
				</div>
			</DialogContent>
		</Dialog>
	);
}
