"use client";

import Image from "next/image";

interface IconsProps {
  onIconClick: (iconId: string) => void;
}

export default function Icons({ onIconClick }: IconsProps) {
  const icons = [
    {
      id: "radio",
      title: "Radio",
      img: "/img-radio.png",
      className: "radio-icon",
    },
    {
      id: "assets",
      title: "Assets",
      img: "/img-folder.png",
      className: "folder-icon assets-icon",
    },
    {
      id: "coinflip",
      title: "Coinflip",
      img: "/img-coinflip.png",
      className: "coinflip-icon",
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="w-fit flex flex-row items-end gap-2 cursor-pointer"
          onClick={() => onIconClick(icon.id)}
        >
          <div className="w-12 aspect-square flex items-center justify-center">
            <Image
              src={icon.img}
              alt={icon.title}
              width={1500}
              height={1500}
              unoptimized
              className="w-full h-full object-contain intelli-none"
              style={{
                imageRendering:
                  icon.id === "coinflip" ? "pixelated" : undefined,
              }}
            />
          </div>
          <div className="pb-2">
            <span>{icon.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
