"use client";

import { useState, useEffect } from "react";
import { useWindow } from "@/app/contexts/window";
import data from "@/data/webapp-info.json";
import { cn } from "@/lib/cn";

export default function About({ isOpen = true }: { isOpen: boolean }) {
  const [email, setEmail] = useState("");
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

  const handleSignUp = async () => {
    if (!email || !validateEmail(email)) return;

    setButtonState("submitting");

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Kampala",
    });
    const userAgent = navigator.userAgent;
    const deviceInfo = {
      userAgent,
      language: navigator.language || "",
    };

    try {
      const queryParams = new URLSearchParams({
        code: "982gx",
        subscriber: email,
      });
      await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/notice?${queryParams.toString()}`
      );

      await new Promise((resolve) => setTimeout(resolve, 2500));

      setButtonState("success");
      setEmail("");

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setButtonState("idle");
    } catch {
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
      <div className="space-y-2">
        <p>Sign up for the radio playlist below:</p>
        <div className="flex flex-col gap-1 sm:flex-row">
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
            className="px-2 py-px border-2 border-dark text-dark bg-beige/80 focus:outline-none disabled:opacity-60"
          />
          <button
            onClick={() => handleSignUp()}
            disabled={!email || !validateEmail(email) || buttonState !== "idle"}
            className={cn(
              "w-fit px-2 py-px border-2 border-dark",
              "bg-dark hover:bg-dark/80 text-light",
              "font-bold transition-opacity duration-200 ease-in-out",
              (!validateEmail(email) || buttonState !== "idle") &&
                "opacity-60 cursor-default"
            )}
          >
            {getButtonText()}
          </button>
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
