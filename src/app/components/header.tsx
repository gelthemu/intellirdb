"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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

type Menu = {
  label: string;
  items: MenuItem[];
};

export default function Header() {
  const { openDialog } = useStack();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const menuItems: Menu[] = [
    {
      label: "File",
      items: [
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
      ],
    },
    {
      label: "Explore",
      items: [
        {
          label: "intelliURL",
          onClick: () =>
            window.open("https://intelliurl.vercel.app/", "_blank"),
        },
        {
          label: "TransAudio",
          onClick: () =>
            window.open("https://transaudio.vercel.app/", "_blank"),
        },
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu) {
        const menuElement = menuRefs.current[openMenu];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenu(null);
        }
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenu]);

  const handleMenuClick = (menuLabel: string) => {
    setOpenMenu(openMenu === menuLabel ? null : menuLabel);
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
              {menuItems.map((menu) => (
                <div
                  key={menu.label}
                  ref={(el) => {
                    menuRefs.current[menu.label] = el;
                  }}
                  className="relative"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleMenuClick(menu.label)}
                    className={cn(
                      "px-2 py-px font-bold",
                      "border-none cursor-pointer transition-colors",
                      openMenu === menu.label
                        ? "bg-dark text-light"
                        : "text-dark hover:bg-dark/60 hover:text-light"
                    )}
                  >
                    {menu.label}
                  </div>
                  {openMenu === menu.label && menu.items.length > 0 && (
                    <ul className="menu absolute top-full left-0 w-44 bg-beige border-2 border-dark list-none p-px">
                      {menu.items.map((item, index) => (
                        <li key={`${item.label}-${index}`}>
                          <div
                            onClick={() => handleMenuItemClick(item)}
                            className={cn(
                              "w-full menu-item text-left px-2 py-px font-bold",
                              "border-none bg-transparent cursor-pointer",
                              "flex items-center justify-between gap-2",
                              item.disabled
                                ? "text-dark/50 cursor-default"
                                : "text-dark hover:bg-dark/60 hover:text-light"
                            )}
                          >
                            <span>{item.label}</span>
                            {menu.label === "Explore" && !item.disabled && (
                              <ArrowUpRight size={16} className="opacity-80" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Suspense>
          </div>
        </div>
        <AudioControls />
      </div>
    </nav>
  );
}
