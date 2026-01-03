"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindow } from "@/app/contexts/window";
import { useChat } from "@/app/contexts/chat";
import { usePreview } from "@/app/contexts/preview";
import Radio from "./folders/radio";
import Assets from "./folders/assets";
import CoinFlip from "./folders/coinflip";
import Charts from "./folders/charts";
import About from "./folders/about";
import Chat from "./folders/chat";
import { cn } from "@/lib/cn";

const Dialog: React.FC = () => {
  const { isOpen, currentFolder, goBack, dialogTitle } = useWindow();
  const { isChatVisible, toggleChatVisibility } = useChat();
  const { isPlaying, pausePreview } = usePreview();

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

  const dialogVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={cn(
            "absolute top-0 left-0 bottom-0 right-0 z-50",
            "flex flex-col transition-opacity duration-500 ease-in-out",
            "p-px bg-dark backdrop-blur-md border-none overflow-hidden"
          )}
          variants={dialogVariants}
          initial="hidden"
          animate={"visible"}
          exit="exit"
          layout
        >
          <motion.div className="w-full h-full flex flex-col">
            <motion.div
              className={cn(
                "w-full overflow-hidden",
                "border-b-2 border-dark bg-beige",
                "flex flex-row items-center justify-between gap-2 p-0"
              )}
            >
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center">
                  <span className="font-bold px-2 py-0 text-dark uppercase line-clamp-1 text-ellipsis">
                    {dialogTitle}
                  </span>
                </div>
              </motion.div>
              <div className="flex items-center justify-center space-x-0">
                <div
                  role="button"
                  onClick={() => {
                    if (isChatVisible && toggleChatVisibility) {
                      toggleChatVisibility();
                    }
                    if (isPlaying && pausePreview) {
                      pausePreview();
                    }
                    goBack();
                  }}
                  className={cn(
                    "w-10 h-8 shrink-0 flex items-center justify-center",
                    "group px-1 bg-red-500 cursor-pointer"
                  )}
                  aria-label="Close"
                  title="Close"
                >
                  <div className="flex items-center justify-center group-hover:rotate-90 transition-all duration-300 ease-in-out">
                    <span className="block bg-light h-0.5 absolute rotate-45 w-3" />
                    <span className="block bg-light h-0.5 absolute -rotate-45 w-3" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="w-full h-full overflow-hidden overflow-y-auto"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              key={currentFolder}
            >
              <div className="w-full h-full intelli-canvas borde border-ark p-1 text-dark">
                {renderContent()}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
