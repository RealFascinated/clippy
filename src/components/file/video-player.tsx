"use client";

import ReactPlayer from "react-player";

type VideoPlayerProps = {
  url: string;
  className?: string;
};

export default function FileVideoPlayer({ url, className }: VideoPlayerProps) {
  return (
    <div className="w-full max-w-full aspect-video">
      <ReactPlayer
        url={url}
        volume={0.25}
        playing
        controls
        width="100%"
        height="100%"
        className={className}
      />
    </div>
  );
}
