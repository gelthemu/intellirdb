"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { createFromId } from "./dialog-factory";

export type Content = {
  id: string;
  title: string;
  component: React.ReactNode;
};

const registry = new Map<string, Content>();

function getParamName(level: number): string {
  return "i".repeat(level + 1);
}

export function useStack() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dialogs, setDialogs] = useState<Content[]>([]);

  const hasInitializedFromURL = useRef(false);

  const getDialogsFromURL = useCallback((): Content[] => {
    const stack: Content[] = [];
    let level = 0;

    while (true) {
      const paramName = getParamName(level);
      const id = searchParams.get(paramName);

      if (!id) break;

      let content = registry.get(id);

      if (!content) {
        const created = createFromId(id) ?? undefined;
        content = created;
        if (content) {
          registry.set(id, content);
        }
      }

      if (content) {
        stack.push(content);
      } else {
        break;
      }

      level++;
    }

    return stack;
  }, [searchParams]);

  useEffect(() => {
    const stack = getDialogsFromURL();
    setDialogs(stack);

    if (!hasInitializedFromURL.current) {
      hasInitializedFromURL.current = true;
    }
  }, [searchParams, getDialogsFromURL]);

  useEffect(() => {
    const handlePopState = () => {
      setTimeout(() => {
        const stack = getDialogsFromURL();
        setDialogs(stack);
      }, 10);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [getDialogsFromURL]);

  const openDialog = useCallback(
    (content: Content) => {
      const currentStack = getDialogsFromURL();

      if (currentStack.some((d) => d.id === content.id)) {
        return;
      }

      registry.set(content.id, content);

      const params = new URLSearchParams();

      currentStack.forEach((dialog, index) => {
        params.set(getParamName(index), dialog.id);
      });

      params.set(getParamName(currentStack.length), content.id);

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    },
    [pathname, router, getDialogsFromURL]
  );

  const closeDialog = useCallback(
    (dialogId?: string) => {
      const currentStack = getDialogsFromURL();

      if (currentStack.length === 0) return;

      let newStack: Content[];

      if (dialogId) {
        const index = currentStack.findIndex((d) => d.id === dialogId);
        if (index !== -1) {
          newStack = currentStack.slice(0, index);
        } else {
          return;
        }
      } else {
        newStack = currentStack.slice(0, -1);
      }

      const params = new URLSearchParams();
      newStack.forEach((dialog, index) => {
        params.set(getParamName(index), dialog.id);
      });

      const newUrl =
        newStack.length > 0 ? `${pathname}?${params.toString()}` : pathname;

      if (!dialogId && newStack.length === currentStack.length - 1) {
        window.history.back();
      } else {
        router.push(newUrl, { scroll: false });
      }
    },
    [pathname, router, getDialogsFromURL]
  );

  const closeAllDialogs = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    dialogs,
    openDialog,
    closeDialog,
    closeAllDialogs,
  };
}
