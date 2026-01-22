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
  const preview = usePreview();

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
              role="button"
              aria-label="Go Back"
              className={cn(
                "relative group w-full cursor-pointer overflow-hidden",
                "border-b-2 border-dark bg-beige",
                "flex flex-row items-center justify-between gap-2 p-0"
              )}
              onClick={() => {
                if (isChatVisible && toggleChatVisibility) {
                  toggleChatVisibility();
                }
                goBack();
              }}
            >
              <motion.div
                className="flex-1 flex items-center justify-start shrink-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-var font-extrabold px-2 py-0 text-dark uppercase leading-none line-clamp-1 text-ellipsis">
                  {dialogTitle}
                </span>
              </motion.div>
              <div className="shrink-0 h-8 min-w-10"></div>
              <motion.div className="absolute top-0 bottom-0 right-0 w-10 flex items-center justify-center border-none bg-beige z-0">
                <div className="flex items-center justify-center group-hover:rotate-90 transition-all duration-300 ease-in-out">
                  <span className="block bg-dark group-hover:bg-red-600 h-0.5 absolute rotate-45 w-3" />
                  <span className="block bg-dark group-hover:bg-red-600 h-0.5 absolute -rotate-45 w-3" />
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              className="w-full h-full overflow-hidden overflow-y-auto"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              key={currentFolder}
            >
              <div className="w-full h-full intelli-canvas p-1 text-dark">
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
