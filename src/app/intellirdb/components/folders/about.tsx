"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useWindow } from "@/app/contexts/window";
import data from "@/data/webapp-info.json";
import { cn } from "@/lib/cn";

const SUB_KEY = "__cfmpulse_sub";

export default function About({ isOpen = true }: { isOpen: boolean }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [buttonState, setButtonState] = useState<
    "idle" | "submitting" | "success"
  >("idle");
  const { setDialogTitle } = useWindow();

  useEffect(() => {
    setDialogTitle("About");
  }, [setDialogTitle]);

  const validateEmail = (email: string) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const subKey = Cookies.get(SUB_KEY);

  const handleSignUp = async () => {
    setError("");

    if (!email) {
      setError("email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("invalid email");
      return;
    }

    if (subKey) {
      setError("already signed up");
      return;
    }

    setButtonState("submitting");

    try {
      try {
        const queryParams = new URLSearchParams({
          code: "982gx",
          subscriber: email,
        });

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/notice?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error("signup failed");
        }
      } catch {
        setError("signup failed, try again!");
        setButtonState("idle");
        return;
      }

      Cookies.set(SUB_KEY, "1", {
        expires: 1 / 24,
        path: "/",
      });

      await new Promise((resolve) => setTimeout(resolve, 2500));

      setButtonState("success");
      setEmail("");

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setButtonState("idle");
    } catch {
      setError("something went wrong");
      setButtonState("idle");
    }
  };

  const getButtonText = () => {
    switch (buttonState) {
      case "submitting":
        return "Signing Up...";
      case "success":
        return "Signed Up!";
      default:
        return "Sign Up";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-full relative p-4 overflow-y-auto space-y-4 text-dark">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Welcome to intelliRDB</h2>
        <p>
          Discover some of the best radio stations from around the world. Click{" "}
          <strong>PLAY</strong> to start listening.
        </p>
      </div>
      <div className="w-full space-y-2">
        <p>Sign up for the radio playlist below:</p>
        <div className="w-full flex flex-col gap-0">
          <div className="w-full max-w-sm flex flex-row gap-1">
            <input
              type="email"
              value={email}
              name="email"
              onChange={(e: { target: { value: string } }) =>
                setEmail(e.target.value.trim())
              }
              onPaste={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              autoComplete="off"
              data-lpignore="true"
              placeholder="Your email"
              disabled={buttonState !== "idle"}
              className="flex-1 px-2 py-px border-2 border-dark text-dark bg-beige/80 focus:outline-none disabled:opacity-60"
            />
            <button
              onClick={() => handleSignUp()}
              disabled={buttonState !== "idle"}
              className={cn(
                "w-fit shrink-0 px-2 py-px border-2 border-dark",
                "bg-dark hover:bg-dark/80 text-light",
                "font-bold transition-opacity duration-200 ease-in-out",
                buttonState !== "idle" && "opacity-60 cursor-default"
              )}
            >
              {getButtonText()}
            </button>
          </div>
          <div className="lowercase">
            <span className={cn("text-xs", error ? "text-red-800" : "")}>
              {error ? `⁕ ${error}` : "."}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-semibold">Got questions or feedback?</p>
        <div className="flex flex-col">
          <span>Please send an email to:</span>
          <a
            href="mailto:intellirdb@cfmpulse.com"
            className="w-fit underline hover:opacity-80"
          >
            intellirdb@cfmpulse.com
          </a>
        </div>
      </div>
      <div className="w-full h-10 bg-transparent border-none"></div>
      <div className="flex flex-col text-sm opacity-60">
        <div>
          <span className="font-bold">
            intelliRDB v{process.env.SITE_VERSION} (iii)
          </span>
        </div>
        <div>
          {data["last-updated"].trim() !== "" ? (
            <span>Updated: {data["last-updated"]}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
