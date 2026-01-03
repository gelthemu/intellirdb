"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useChat } from "@/app/contexts/chat";
import { ChevronsDown } from "lucide-react";
import { Message } from "./message";
import { cn } from "@/lib/cn";

const MessageList = () => {
  const { messages, username, isUsernameFormVisible, isMessagesLoading } =
    useChat();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const prevMessagesLengthRef = useRef(messages.length);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const newMessagesCount = messages.length - prevMessagesLengthRef.current;

    const shouldAutoScroll =
      isUsernameFormVisible ||
      !isUserScrolling ||
      isAtBottom(container) ||
      (newMessagesCount > 0 &&
        messages[messages.length - 1]?.username === username);

    if (shouldAutoScroll) {
      scrollToBottom(container);
      setUnreadCount(0);
    } else if (newMessagesCount > 0) {
      const newUnreadMessages = messages
        .slice(prevMessagesLengthRef.current)
        .filter((msg) => msg.username !== username);

      setUnreadCount((prev) => prev + newUnreadMessages.length);
    }

    prevMessagesLengthRef.current = messages.length;

    const resizeObserver = new ResizeObserver(() => {
      if (container && (!isUserScrolling || isAtBottom(container))) {
        scrollToBottom(container);
      }
    });

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [messages, isUserScrolling, username, isUsernameFormVisible]);

  const isAtBottom = (element: HTMLElement) => {
    const threshold = 220;
    return (
      Math.abs(
        element.scrollHeight - element.clientHeight - element.scrollTop
      ) < threshold
    );
  };

  const scrollToBottom = (element: HTMLElement) => {
    element.scrollTop = element.scrollHeight;
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isAtBottom(container)) {
      setIsUserScrolling(true);
    } else {
      setIsUserScrolling(false);
      setUnreadCount(0);
    }
  };

  const scrollToBottomBtn = () => {
    if (containerRef.current) {
      scrollToBottom(containerRef.current);
      setUnreadCount(0);
      setIsUserScrolling(false);
    }
  };

  return (
    <div className="w-full h-full flex relative intelli-canvas overflow-x-hidden overflow-y-auto">
      <div
        ref={containerRef}
        className="relative w-full h-full flex overflow-x-hidden overflow-y-auto overscroll-none scroll-smooth px-1 bg-light/50 border-b border-dark/80"
        onScroll={handleScroll}
      >
        {isMessagesLoading ? (
          <div className="p-4">
            <span className="text-sm opacity-60">Loading messages...</span>
          </div>
        ) : messages.length !== 0 ? (
          <div className="w-full h-full flex flex-col divide-y divide-dark/20">
            <Suspense fallback={null}>
              {messages.map((message) => (
                <div key={message.id}>
                  <Message message={message} />
                </div>
              ))}
            </Suspense>
          </div>
        ) : null}
      </div>
      {(unreadCount > 0 || isUserScrolling) && !isMessagesLoading && (
        <div className="absolute bottom-2 right-2">
          <button onClick={scrollToBottomBtn} className="focus:outline-none">
            <span
              className={cn(
                "relative w-6 h-6 flex items-center justify-center shadow-md",
                "text-light bg-dark/80"
              )}
            >
              <ChevronsDown size={16} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export { MessageList };
