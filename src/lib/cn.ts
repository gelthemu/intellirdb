import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createUser = async (params: Record<string, any>) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/intellirdb/user-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  } catch {
    // fail silently
  }
};

export const sendNotice = async (params: Record<string, string>) => {
  try {
    const queryParams = new URLSearchParams(params);
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/notice?${queryParams.toString()}`,
    );
  } catch {
    // fail silently
  }
};
