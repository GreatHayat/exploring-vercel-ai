/**
 * v0 by Vercel.
 * @see https://v0.dev/t/oeBpHEkVce2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type AudioPlayerProps = {
  title: string;
  audioUrl: string;
};

export function AudioPlayer({ title, audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };
  const handleVolumeChange = (value) => {
    setVolume(value);
  };
  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.setAttribute("download", `${title}.mp3`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="bg-background text-foreground rounded-lg shadow-lg p-6 w-full max-w-md">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="text-xl font-bold">{title}</h3>
          {/* <p className="text-muted-foreground">Evolve</p> */}
        </div>
        <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} />
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlay}
            className="text-foreground hover:bg-muted"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </Button>
          <Slider
            value={[currentTime]}
            max={duration}
            onValueChange={handleSeek}
            className="flex-1 mx-4 [&>span:first-child]:h-1 [&>span:first-child]:bg-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleVolumeChange(volume - 0.1)}
              className="text-foreground hover:bg-muted"
            >
              <Volume2Icon className="w-6 h-6" />
            </Button>
            <Slider
              value={[volume * 100]}
              max={100}
              onValueChange={(value) => handleVolumeChange(value / 100)}
              className="w-20 [&>span:first-child]:h-1 [&>span:first-child]:bg-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleVolumeChange(volume + 0.1)}
              className="text-foreground hover:bg-muted"
            >
              <VolumeIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleDownload}
          className="mt-4 w-full"
        >
          Download
        </Button>
      </div>
    </div>
  );
}

function PauseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function PlayIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function Volume2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    </svg>
  );
}
