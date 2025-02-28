"use client";

import ReactPlayer from "react-player";

type VideoPlayerProps = {
  url: string;
  className?: string;
};

export default function FileVideoPlayer({ url, className }: VideoPlayerProps) {
  return (
    <ReactPlayer
      url={url}
      volume={0.25}
      playing
      controls
      className={className}
    />
  );
}
