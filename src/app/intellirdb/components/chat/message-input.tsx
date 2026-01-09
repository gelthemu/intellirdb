"use client";

import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { useChat } from "@/app/contexts/chat";
import { cn } from "@/lib/cn";

interface MessageInputProps {
  placeholder?: string;
}

const MessageInput = ({
  placeholder = "Add a message...",
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { username, isConnected, sendMessage } = useChat();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [message]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;
    setIsSending(true);
    const content: { text?: string } = {};
    if (message.trim()) {
      content.text = message;
    }

    await new Promise((resolve) => setTimeout(resolve, 2500));

    sendMessage({ text: content.text });

    await new Promise((resolve) => setTimeout(resolve, 500));

    resetInput();
    setIsSending(false);
  };

  const resetInput = () => {
    setMessage("");
  };

  return (
    <div className="w-full text-sm">
      <div className="px-2.5 md:px-4 py-2">
        <div className="relative w-full">
          <div className="font-bold capitalize line-clamp-1">
            Hi, {username}!
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-center space-1 md:space-x-3">
            <div className="w-full flex flex-row items-center space-x-2 md:space-x-3 relative">
              <label htmlFor="message" className="font-semibold">
                {"Message"}:
              </label>
              <div className="relative flex-1">
                <textarea
                  id="message"
                  name="message"
                  ref={textareaRef}
                  value={message}
                  onChange={handleChange}
                  autoFocus={true}
                  onInput={(e) => {
                    const input = e.target as HTMLTextAreaElement;
                    if (input.value.length > 200) {
                      input.value = input.value.slice(0, 200);
                    }
                  }}
                  required={false}
                  placeholder={placeholder}
                  className={cn(
                    "w-full ps-2 pe-2 pt-1 pb-0 text-base font-bold bg-transparent border-b-2 border-dark placeholder:text-dark/40",
                    "resize-none focus:outline-none max-h-[60px] overflow-y-auto overscroll-none scroll-smooth scrollbar-hide"
                  )}
                  rows={1}
                  maxLength={200}
                  style={{ height: "auto" }}
                  disabled={isSending}
                />
              </div>
            </div>
            <div className="flex items-center">
              <button
                aria-label="Send message"
                type="submit"
                disabled={!message.trim() || !isConnected || isSending}
                className="w-fit text-sm bg-dark text-light px-3 py-1 font-bold disabled:opacity-60 focus:outline-none"
              >
                <div>
                  {isSending ? <span>Sending...</span> : <span>Send</span>}
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { MessageInput };
