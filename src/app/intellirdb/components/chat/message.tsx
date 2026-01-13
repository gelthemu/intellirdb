"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Message } from "@/app/contexts/chat";
import { COLOR_CIRCLE } from "./color-circle";
import { FORMAT_TIMESTAMP } from "./timestamp";
import { YouTubeEmbed } from "@next/third-parties/google";
import { cn } from "@/lib/cn";

const Mentions = ({ text }: { text: string }) => {
  const normalizedText = text.replace(/\\n/g, "\n");
  const regex = /(#\w+)|(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]+)|(\n)/gi;

  const parts = normalizedText.split(regex).filter(Boolean);

  const formattedText = parts.map((part, index) => {
    if (!part) return null;

    if (part === "\n") {
      return <br key={`br-${index}`} />;
    }

    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/i;
    const youtubeMatch = part.match(youtubeRegex);

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return (
        <div
          key={`yt-${index}`}
          className="w-full max-w-[360px] relative aspect-auto overflow-hidden grayscale"
        >
          <div className="h-1 p-0"></div>
          <YouTubeEmbed videoid={videoId} params="rel=0" />
        </div>
      );
    }

    if (part.startsWith("#")) {
      return (
        <span key={`hashtag-${index}`} className="text-sky-700">
          {part}
        </span>
      );
    }

    if (part.match(/^https?:\/\//i)) {
      return (
        <a
          key={`url-${index}`}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-700 hover:underline"
        >
          {part}
        </a>
      );
    }

    return <span key={`text-${index}`}>{part}</span>;
  });

  return <span>{formattedText}</span>;
};

const Message = ({ message }: { message: Message }) => {
  const [formattedTime, setFormattedTime] = useState<string>(
    FORMAT_TIMESTAMP(message.timestamp)
  );
  const color = COLOR_CIRCLE(message.code, message.username) || "red";
  const id = message.code.slice(-4);

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedTime(FORMAT_TIMESTAMP(message.timestamp));
    }, 60000);

    return () => clearInterval(interval);
  }, [message.timestamp]);

  return (
    <div className="w-full relative text-sm px-2 py-3 hover:bg-dark/5">
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-row items-center overflow-hidden">
          <div
            className={cn(
              "flex flex-row items-center min-w-0",
              message.username === "ADMIN" ? "uppercase" : "lowercase"
            )}
          >
            {message.username === "ADMIN" ? (
              <Link
                href="https://x.com/intent/user?screen_name=geltaverse"
                target="_blank"
              >
                <span className="font-bold text-sm" style={{ color }}>
                  {message.username}
                </span>
              </Link>
            ) : (
              <>
                <span
                  className="font-bold overflow-hidden whitespace-nowrap text-ellipsis flex-grow"
                  style={{ color }}
                >
                  {message.username}
                </span>
                <span className="text-xs opacity-60 flex-shrink-0 ml-1">
                  ({id})
                </span>
              </>
            )}
          </div>
          <div className="mx-1 font-medium opacity-40 select-none flex-shrink-0">
            •
          </div>
          <div className="flex-shrink-0">
            <span className="text-xs font-light opacity-60">
              {formattedTime}
            </span>
          </div>
        </div>
        {message.text && (
          <div className="text-sm select-text break-words hyphens-manual overflow-hidden">
            <Mentions text={message.text} />
          </div>
        )}
      </div>
    </div>
  );
};

export { Mentions, Message };
