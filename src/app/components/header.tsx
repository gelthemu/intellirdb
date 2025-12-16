"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { useStack } from "@/app/hooks/use-dialog-stack";
import About from "@/app/content/about";
import AudioControls from "@/app/components/audio-controls";
import { BASE_URL } from "@/lib/constants";

type MenuItem = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Header() {
  const { openDialog } = useStack();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fileMenuItems: MenuItem[] = [
    {
      label: "About",
      onClick: () =>
        openDialog({
          id: "about",
          title: "About",
          component: <About isOpen={true} />,
        }),
    },
    {
      label: "Fullscreen",
      onClick: () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      },
    },
    {
      label: "Exit",
      disabled: true,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenu]);

  const handleFileClick = () => {
    setOpenMenu(openMenu === "File" ? null : "File");
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (!item.disabled && item.onClick) {
      setOpenMenu(null);
      item.onClick();
    }
  };

  return (
    <nav className="navbar w-full sticky top-0 z-50">
      <div className="flex flex-row items-center justify-between space-x-2 p-0 bg-beige border-b-2 border-dark">
        <div className="flex flex-row items-center justify-start space-x-1">
          <div className="w-8 aspect-square flex items-center justify-center">
            <Image
              src={`${BASE_URL}/favicon.ico`}
              alt="intelliRDB Logo"
              width={1500}
              height={1500}
              unoptimized
              loading="lazy"
              className="w-full h-full object-contain intelli-none"
            />
          </div>
          <div className="flex items-center justify-center space-x-0.5">
            <Suspense fallback={null}>
              <div ref={menuRef} className="relative">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleFileClick}
                  className={cn(
                    "px-2 py-px font-bold",
                    "border-none cursor-pointer transition-colors focus:outline-none",
                    openMenu === "File"
                      ? "bg-dark text-light"
                      : "text-dark hover:bg-dark/60 hover:text-light"
                  )}
                >
                  File
                </div>
                {openMenu === "File" && (
                  <ul className="menu absolute top-full left-0 w-44 bg-beige border-2 border-dark list-none p-px">
                    {fileMenuItems.map((item, index) => (
                      <li key={`${item.label}-${index}`}>
                        <div
                          onClick={() => handleMenuItemClick(item)}
                          className={cn(
                            "w-full menu-item text-left px-2 py-px font-bold",
                            "border-none bg-transparent cursor-pointer",
                            "flex items-center justify-between gap-2 focus:outline-none",
                            item.disabled
                              ? "text-dark/50 cursor-default"
                              : "text-dark hover:bg-dark/60 hover:text-light"
                          )}
                        >
                          <span>{item.label}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() =>
                  window.open("https://geltaverse.vercel.app/", "_blank")
                }
                className={cn(
                  "px-2 py-px font-bold",
                  "border-none cursor-pointer transition-colors focus:outline-none",
                  "text-dark hover:bg-dark/60 hover:text-light"
                )}
              >
                Explore
              </div>
            </Suspense>
          </div>
        </div>
        <AudioControls />
      </div>
    </nav>
  );
}
