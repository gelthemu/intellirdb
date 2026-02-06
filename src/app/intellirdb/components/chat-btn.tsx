"use client";

import { useWindow } from "@/app/contexts/window";
import { useChat } from "@/app/contexts/chat";
import { cn } from "@/lib/cn";

const ChatBtn = () => {
  const {  openFolder } = useWindow();
  const { messages, isChatVisible, toggleChatVisibility } = useChat();

  if (messages.length === 0) return null;

  return (
    <div>
      <div
        className={cn(
          "fixed bottom-10 left-1 right-2 border-none overflow-hidden z-50",
          "flex justify-end bg-transparent pr-5 pb-1.5"
        )}
        role="dialog"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            openFolder("chat");
            if (!isChatVisible && toggleChatVisibility) {
              toggleChatVisibility();
            }
          }}
          aria-label="Open Chat"
          className="relative flex justify-start items-center text-sm bg-gray px-2 py-1 text-dark border-2 border-dark/50 focus:outline-none"
        >
          <span className="flex justify-start items-center">Chat</span>
          <span className="absolute -end-4 top-1/2 -translate-y-1/2 text-nowrap px-1 py-0.5 min-w-5 text-light text-center text-xs bg-dark/90">
            <span className="absolute top-0 start-0 rounded-none -z-10 animate-ping bg-dark/50 w-full h-full" />
            {messages.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export { ChatBtn };
