"use client";

import { Suspense, useEffect } from "react";
import Icons from "@/app/components/icons";
import { useStack } from "@/app/hooks/use-dialog-stack";
import { Assets } from "@/app/content/assets";
import { Radio } from "@/app/content/radio";
import Coinflip from "@/app/content/coinflip";

function HomeContent() {
  const { openDialog, closeDialog } = useStack();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDialog();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeDialog]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="relative w-full h-full z-[1] overflow-hidden overflow-y-auto">
        <Icons
          onIconClick={(iconId) => {
            if (iconId === "assets") {
              openDialog({
                id: "assets",
                title: "Assets",
                component: <Assets isOpen={true} />,
              });
            } else if (iconId === "radio") {
              openDialog({
                id: "radio",
                title: "Radio",
                component: <Radio isOpen={true} />,
              });
            } else if (iconId === "coinflip") {
              openDialog({
                id: "coinflip",
                title: "Coinflip",
                component: <Coinflip isOpen={true} />,
              });
            }
          }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
