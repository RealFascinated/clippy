"use client";

import { useState } from "react";
import ReactPlayer from "react-player";

type VideoPlayerProps = {
  url: string;
  className?: string;
  onLoad?: () => void;
};

export default function FileVideoPlayer({
  url,
  className,
  onLoad,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="w-full h-full flex items-center justify-center">
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
          onReady={() => {
            setIsReady(true);
            onLoad?.();
          }}
          style={{ opacity: isReady ? 1 : 0 }}
        />
      </div>
    </div>
  );
}
