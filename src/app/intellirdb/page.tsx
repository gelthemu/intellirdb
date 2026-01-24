"use client";

import { Suspense } from "react";
import FolderIcons from "./components/folder-icons";
import { ChatBtn } from "./components/chat-btn";

function DesktopContent() {
  return (
    <div className="w-full h-full relative overflow-hidden border-none bg-light/20">
      <div className="relative w-full h-full z-[0] overflow-hidden overflow-y-auto">
        <FolderIcons />
      </div>
      <ChatBtn />
    </div>
  );
}

export default function Desktop() {
  return (
    <Suspense fallback={null}>
      <DesktopContent />
    </Suspense>
  );
}
