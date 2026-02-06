"use client";

import { useWindow } from "@/app/contexts/window";
import Image from "next/image";
import { FolderType } from "@/app/contexts/window";

const FolderIcons = () => {
  const { openFolder } = useWindow();

  const icons = [
    {
      folder: "radio",
      title: "Radio",
      img: "img-radio.png",
    },
    {
      folder: "assets",
      title: "Assets",
      img: "img-assets.png",
    },
    {
      folder: "charts",
      title: "Charts",
      img: "img-charts.png",
    },
    {
      folder: "coinflip",
      title: "Coinflip",
      img: "img-coinflip.png",
    },
  ];

  const handleIconClick = (folder: string) => {
    openFolder(folder as FolderType);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {icons.map((icon, index) => (
        <div
          key={icon.folder}
          className={`w-fit flex flex-row items-end gap-2 cursor-pointer pl-${index * 10}`}
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
      ))}
    </div>
  );
};

export default FolderIcons;
