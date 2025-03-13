"use client";

import { useState } from "react";
import ReactPlayer from "react-player";

type VideoPlayerProps = {
  url: string;
  className?: string;
};

export default function FileVideoPlayer({ url, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full max-w-full aspect-video">
      <ReactPlayer
        url={url}
        volume={0.25}
        playing={isPlaying}
        controls
        width="100%"
        height="100%"
        className={className}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
