"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type FolderType =
  | "radio"
  | "assets"
  | "coinflip"
  | "charts"
  | "about"
  | "chat"
  | null;
export type SubView = string | null;
export type DeepView = string | null;

interface WindowContextType {
  isOpen: boolean;
  currentFolder: FolderType;
  subView: SubView;
  deepView: DeepView;
  dialogTitle: string;
  openFolder: (folder: FolderType) => void;
  openSubView: (view: string) => void;
  openDeepView: (view: string) => void;
  goBack: () => void;
  closeWindow: () => void;
  setDialogTitle: (title: string) => void;
}

const WindowContext = createContext<WindowContextType | null>(null);

export const useWindow = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindow must be used within a WindowProvider");
  }
  return context;
};

const DEFAULT_TITLE = "Just Radio";

function WindowProviderContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dialogTitle, setDialogTitleState] = useState(DEFAULT_TITLE);

  const currentFolder = (searchParams.get("v") as FolderType) || null;
  const subView = searchParams.get("sv") || null;
  const deepView = searchParams.get("dv") || null;
  const isOpen = currentFolder !== null;

  const setDialogTitle = useCallback((title: string) => {
    setDialogTitleState(title);
  }, []);

  const updateUrl = useCallback(
    (folder: FolderType, sub: SubView = null, deep: DeepView = null) => {
      const params = new URLSearchParams();
      if (folder) {
        params.set("v", folder);
        if (sub) {
          params.set("sv", sub);
          if (deep) {
            params.set("dv", deep);
          }
        }
      }
      const queryString = params.toString();
      const newUrl = queryString ? `/intellirdb?${queryString}` : "/intellirdb";

      if (
        typeof window !== "undefined" &&
        window.history &&
        window.history.pushState
      ) {
        window.history.pushState(null, "", newUrl);
      } else {
        router.push(newUrl, { scroll: false });
      }
    },
    [router],
  );

  const openFolder = useCallback(
    (folder: FolderType) => {
      updateUrl(folder);
    },
    [updateUrl],
  );

  const openSubView = useCallback(
    (view: string) => {
      if (currentFolder) {
        updateUrl(currentFolder, view);
      }
    },
    [currentFolder, updateUrl],
  );

  const openDeepView = useCallback(
    (view: string) => {
      if (currentFolder && subView) {
        updateUrl(currentFolder, subView, view);
      }
    },
    [currentFolder, subView, updateUrl],
  );

  const goBack = useCallback(() => {
    if (deepView) {
      updateUrl(currentFolder, subView, null);
    } else if (subView) {
      updateUrl(currentFolder, null);
    } else {
      updateUrl(null);
    }
  }, [currentFolder, subView, deepView, updateUrl]);

  const closeWindow = useCallback(() => {
    updateUrl(null);
  }, [updateUrl]);

  return (
    <WindowContext.Provider
      value={{
        isOpen,
        currentFolder,
        subView,
        deepView,
        dialogTitle,
        openFolder,
        openSubView,
        openDeepView,
        goBack,
        closeWindow,
        setDialogTitle,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Suspense fallback={null}>
      <WindowProviderContent>{children}</WindowProviderContent>
    </Suspense>
  );
};
