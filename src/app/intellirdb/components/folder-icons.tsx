"use client";

import { Suspense, useMemo } from "react";
import { useWindow } from "@/app/contexts/window";
import Image from "next/image";
import { FolderType } from "@/app/contexts/window";
import { fisherYatesShuffle } from "@/app/intellirdb/components/fy-shuffle";
import { cn } from "@/lib/cn";

const FolderIcons = () => {
  const { openFolder } = useWindow();

  const randomizedIcons = useMemo(() => {
    const icons = [
      { folder: "radio", title: "Radio", img: "img-radio.png" },
      { folder: "assets", title: "Assets", img: "img-assets.png" },
      { folder: "charts", title: "Charts", img: "img-charts.png" },
      { folder: "coinflip", title: "Coinflip", img: "img-coinflip.png" },
    ];

    const indentOptions = ["ml-0", "ml-12", "ml-24", "ml-36"];

    const shuffled = fisherYatesShuffle([...icons]);

    return shuffled.map((icon) => ({
      ...icon,

      randomClass:
        indentOptions[Math.floor(Math.random() * indentOptions.length)],
    }));
  }, []);

  const handleIconClick = (folder: string) => {
    openFolder(folder as FolderType);
  };

  return (
    <div className="flex flex-col gap-[40px] p-4">
      {randomizedIcons.map((icon) => (
        <Suspense key={icon.folder} fallback={null}>
          <div
            className={cn(
              "w-fit flex flex-row items-end gap-2 cursor-pointer p-2 transition-all",
              icon.randomClass,
            )}
            onClick={() => handleIconClick(icon.folder)}
          >
            <div className="w-12 aspect-square flex items-center justify-center">
              <Image
                src={`/folders/${icon.img}`}
                alt=""
                width={1500}
                height={1500}
                unoptimized
                loading="eager"
                className="w-full h-full object-contain intelli-none"
                style={{
                  imageRendering:
                    icon.folder === "coinflip" ? "pixelated" : undefined,
                }}
              />
            </div>
            <div className="pb-2">
              <span className="font-var font-semibold text-dark">
                {icon.title}
              </span>
            </div>
          </div>
        </Suspense>
      ))}
    </div>
  );
};

export default FolderIcons;
