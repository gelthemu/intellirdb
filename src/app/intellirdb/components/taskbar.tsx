"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRadio } from "@/app/contexts/radio";
import { BASE_URL } from "@/lib/constants";
import { useWindow } from "@/app/contexts/window";
import { FolderType } from "@/app/contexts/window";
import AudioControls from "@/app/intellirdb/components/audio-controls";
import { cn } from "@/lib/cn";

type StartFolder = {
  label: string;
  folder: FolderType;
  img: string;
};

type MenuItem = {
  label: string;
  img?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const Taskbar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);
  const { isOpen, openFolder } = useWindow();
  const { currentStation } = useRadio();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTime(new Date());

    const timer = setInterval(() => setTime(new Date()), 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showStartMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        startRef.current &&
        !startRef.current.contains(event.target as Node)
      ) {
        setShowStartMenu(false);
      }
    };

    if (showStartMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showStartMenu]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const toggleStartMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowStartMenu((prev) => !prev);
  };

  const handleMenuClick = (action: () => void) => {
    action();
    setShowStartMenu(false);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (!item.disabled && item.onClick) {
      setShowStartMenu(false);
      item.onClick();
    }
  };

  const startFolders: StartFolder[] = [
    {
      label: "Radio",
      folder: "radio",
      img: "img-radio.png",
    },
    {
      label: "Assets",
      folder: "assets",
      img: "img-assets.png",
    },
    {
      label: "Coinflip",
      folder: "coinflip",
      img: "img-coinflip.png",
    },
    {
      label: "Charts",
      folder: "charts",
      img: "img-charts.png",
    },
  ];

  const menuItems: MenuItem[] = [
    {
      label: "About",
      img: "img-about.png",
      onClick: () => openFolder("about"),
    },
    {
      label: "Exit",
      disabled: true,
    },
  ];

  return (
    <>
      <div>
        {showStartMenu && (
          <div className="absolute inset-0 z-[999] bg-transparent border-none">
            <div
              ref={menuRef}
              className={cn(
                "absolute w-36 md:w-48 text-dark bg-beige border-2 border-dark p-px focus:outline-none select-none",
                isOpen ? "left-2 bottom-10" : "left-2 bottom-10",
              )}
            >
              <ul>
                <li className="w-full text-left px-2 py-px border-none font-var text-light bg-dark cursor-default focus:outline-none">
                  <span>intelliRDB</span>
                </li>
                {startFolders.map((folder, index) => (
                  <li
                    key={`${folder.folder}-${index}`}
                    onClick={() =>
                      handleMenuClick(() => openFolder(folder.folder))
                    }
                    className="w-full text-left flex items-center justify-start space-x-2 px-2 py-px border-none bg-transparent hover:bg-dark/60 hover:text-light cursor-pointer focus:outline-none"
                  >
                    <Image
                      src={`/folders/${folder.img}`}
                      alt=""
                      width={1500}
                      height={1500}
                      unoptimized
                      loading="lazy"
                      className="w-5 aspect-square object-contain intelli-none"
                    />
                    <span>{folder.label}</span>
                  </li>
                ))}
                <li className="border-b border-dark/50 py-0 opacity-75" />
                {menuItems.map((item, index) => (
                  <li
                    key={`${item.label}-${index}`}
                    onClick={() => handleMenuItemClick(item)}
                    className={cn(
                      "w-full text-left flex items-center justify-start space-x-2 px-2 py-px focus:outline-none",
                      "border-none bg-transparent cursor-pointer",
                      item.disabled
                        ? "opacity-50 cursor-default"
                        : "hover:bg-dark/60 hover:text-light",
                    )}
                  >
                    <Image
                      src={
                        item.img
                          ? `/folders/${item.img}`
                          : `${BASE_URL}/favicon.ico`
                      }
                      alt=""
                      width={1500}
                      height={1500}
                      unoptimized
                      loading="lazy"
                      className="w-5 aspect-square object-contain intelli-none"
                    />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "w-full sticky bottom-0 z-50 p-0 bg-dark border-t-2 border-dark",
        )}
      >
        <div className="flex flex-row items-center justify-between space-x-2 p-0 text-dark bg-beige border-none">
          <div
            ref={startRef}
            role="button"
            tabIndex={0}
            onClick={toggleStartMenu}
            className="relative flex flex-row items-center justify-start space-x-1 shrink-0 cursor-pointer focus:outline-none select-none"
          >
            <div className="w-8 aspect-square flex items-center justify-center">
              <Image
                src={`${BASE_URL}/favicon.ico`}
                alt=""
                width={1500}
                height={1500}
                unoptimized
                loading="lazy"
                className="w-full h-full object-contain intelli-none"
              />
            </div>
            <div className="px-1 py-px font-bold font-var">
              <span>Start</span>
            </div>
          </div>
          {currentStation ? (
            <AudioControls />
          ) : (
            <div className="shrink-0 px-2 py-px font-bold font-var opacity-80">
              <span suppressHydrationWarning>{formatTime(time)}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Taskbar;
