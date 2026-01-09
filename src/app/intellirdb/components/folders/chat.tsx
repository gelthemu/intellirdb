"use client";

import { useEffect } from "react";
import { useChat } from "@/app/contexts/chat";
import { useWindow } from "@/app/contexts/window";
import { UsernameForm } from "../chat/username-form";
import { MessageList } from "../chat/message-list";
import { MessageInput } from "../chat/message-input";

const Chat = () => {
  const { setDialogTitle } = useWindow();
  const { username, messages, setUsername } = useChat();

  const title = messages.length > 0 ? `Chat (${messages.length})` : "Chat";

  useEffect(() => {
    setDialogTitle(title);
  }, [setDialogTitle]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 flex flex-col text-dark border-2 border-dark/60 overflow-hidden z-40">
        <MessageList />
        <div className="shrink-0 bg-light/20">
          {!username ? (
            <UsernameForm onSubmit={setUsername} />
          ) : (
            <MessageInput />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
