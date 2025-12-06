"use client";

import { Suspense } from "react";
import { useStack } from "@/app/hooks/use-dialog-stack";
import { cn } from "@/lib/cn";

function StackContent() {
  const { dialogs, closeDialog } = useStack();

  return (
    <>
      {dialogs.map((dialog, index) => (
        <Suspense key={dialog.id} fallback={null}>
          <div
            className={cn(
              "absolute top-1 left-1 bottom-1 right-1 z-50",
              "flex flex-col transition-opacity duration-500 ease-in-out",
              "bg-beige/90 backdrop-blur-md border-2 border-dark overflow-hidden"
            )}
            style={{ zIndex: index + 2 }}
          >
            <header
              className={cn(
                "w-full overflow-hidden",
                "border-b-2 border-dark bg-beige",
                "flex flex-row items-center justify-between gap-2 p-0"
              )}
            >
              <div className="flex items-center justify-center">
                <span className="font-bold px-3.5 py-0 text-dark uppercase line-clamp-1 text-ellipsis">
                  {dialog.title}
                </span>
              </div>
              <div
                className={cn(
                  "group w-10 h-8 shrink-0 flex items-center justify-center",
                  "px-1 border-l-2 border-dark bg-dark/20 hover:bg-red-500 cursor-pointer"
                )}
                onClick={() => closeDialog(dialog.id)}
                aria-label="Close"
                title="Close"
              >
                <span className="block bg-dark/80 group-hover:bg-light h-0.5 absolute rotate-45 w-3 transition-all duration-200 ease-in-out" />
                <span className="block bg-dark/80 group-hover:bg-light h-0.5 absolute -rotate-45 w-3 transition-all duration-200 ease-in-out" />
              </div>
            </header>
            <div className="w-full h-full p-1 overflow-hidden overflow-y-auto">
              <div className="w-full h-full intelli-canvas border border-dark p-1 text-dark">
                {dialog.component}
              </div>
            </div>
          </div>
        </Suspense>
      ))}
    </>
  );
}

export default function Dialog() {
  return (
    <Suspense fallback={null}>
      <StackContent />
    </Suspense>
  );
}
