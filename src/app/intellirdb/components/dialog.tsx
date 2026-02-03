"use client";

import React from "react";
import { useWindow } from "@/app/contexts/window";
import { useChat } from "@/app/contexts/chat";
import Radio from "@/app/intellirdb/folders/radio";
import Assets from "@/app/intellirdb/folders/assets";
import CoinFlip from "@/app/intellirdb/folders/coinflip";
import Charts from "@/app/intellirdb/folders/charts";
import About from "@/app/intellirdb/folders/about";
import Chat from "@/app/intellirdb/folders/chat";
import { cn } from "@/lib/cn";

const Dialog: React.FC = () => {
  const { isOpen, currentFolder, goBack, dialogTitle } = useWindow();
  const { isChatVisible, toggleChatVisibility } = useChat();

  const renderContent = () => {
    switch (currentFolder) {
      case "radio":
        return <Radio />;
      case "assets":
        return <Assets />;
      case "coinflip":
        return <CoinFlip />;
      case "charts":
        return <Charts />;
      case "about":
        return <About isOpen={true} />;
      case "chat":
        return <Chat />;
      default:
        return null;
    }
  };

  return (
    <div>
      {isOpen && (
        <div
          className={cn(
            "absolute top-0 left-0 bottom-0 right-0 z-50",
            "flex flex-col transition-opacity duration-500 ease-in-out",
            "p-px bg-light/40 backdrop-blur-md border-none overflow-hidden",
          )}
        >
          <div className="w-full h-full flex flex-col">
            <div
              role="button"
              aria-label="Go Back"
              className={cn(
                "relative group w-full cursor-pointer overflow-hidden",
                "border-b-2 border-dark bg-beige",
                "flex flex-row items-center justify-between gap-2 p-0",
              )}
              onClick={() => {
                if (isChatVisible && toggleChatVisibility) {
                  toggleChatVisibility();
                }
                goBack();
              }}
            >
              <div className="flex-1 flex items-center justify-start shrink-0">
                <span className="font-var font-extrabold px-2 py-0 text-dark uppercase leading-none line-clamp-1 text-ellipsis">
                  {dialogTitle}
                </span>
              </div>
              <div className="shrink-0 h-8 min-w-10"></div>
              <div className="absolute top-0 bottom-0 right-0 w-10 flex items-center justify-center border-none bg-beige z-0">
                <div className="flex items-center justify-center group-hover:rotate-90 transition-all duration-300 ease-in-out">
                  <span className="block bg-dark group-hover:bg-red-600 h-0.5 absolute rotate-45 w-3" />
                  <span className="block bg-dark group-hover:bg-red-600 h-0.5 absolute -rotate-45 w-3" />
                </div>
              </div>
            </div>
            <div
              className="w-full h-full intelli-canvas overflow-hidden overflow-y-auto"
              key={currentFolder}
            >
              <div className="w-full h-full p-1 text-dark bg-light/40">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dialog;
