import { useState } from "react";
import { cn } from "@/lib/cn";

interface UsernameFormProps {
  onSubmit: (username: string) => void;
}

const UsernameForm = ({ onSubmit }: UsernameFormProps) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const RESTRICTED_WORDS = [
    "admin",
    "owner",
    "manager",
    "moderator",
    "supervisor",
    "administrator",
    "staff",
    "official",
    "office",
    "crooze",
  ];

  const containsEmoji = (text: string): boolean => {
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(text);
  };

  const containsRestrictedWord = (value: string) => {
    const lowercaseValue = value.toLowerCase();
    return RESTRICTED_WORDS.some((word) => lowercaseValue.includes(word));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 4) {
      setError("At least 4 characters");
      return;
    } else if (username.length > 34) {
      setError("Not more than 34 chars");
      return;
    } else if (containsRestrictedWord(username)) {
      setError("Username already exists");
      return;
    } else if (containsEmoji(username)) {
      setError("No emojis 😄");
    }

    onSubmit(username);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length < 4) {
      setError("At least 4 characters");
    } else if (value.length > 34) {
      setError("Not more than 34 chars");
    } else if (/\d/.test(value)) {
      setError("Cannot contain numbers");
    } else if (containsRestrictedWord(value)) {
      setError("Username already exists");
    } else if (containsEmoji(value)) {
      setError("No emojis 😄");
    } else {
      setError("");
    }

    setUsername(value);
  };

  return (
    <div className="w-full relative mt-auto">
      <div className="relative p-2 text-sm bg-light-accent dark:bg-dark-accent">
        <form onSubmit={handleSubmit}>
          <div className="w-full flex flex-row items-end space-x-2">
            <div className="w-full flex-1 flex flex-row items-end space-x-2">
              <label htmlFor="username" className="font-semibold shrink-0">
                Username:
              </label>
              <div className="relative flex-1">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={handleUsernameChange}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.length > 34) {
                      input.value = input.value.slice(0, 34);
                    }
                  }}
                  required
                  className={cn(
                    "w-full text-base font-semibold bg-transparent ps-1 pe-10 pt-2 pb-0 placeholder:text-dark/40",
                    "border-b-2 border-dark focus:outline-none",
                  )}
                  placeholder="Enter a username . . ."
                  minLength={4}
                  maxLength={34}
                  autoComplete="off"
                  data-lpignore="true"
                  style={{
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    userSelect: "none",
                  }}
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 px-1 dark:bg-dark/50 lowercase">
                  <span className="opacity-80 text-bi">
                    {Math.min(username.length, 34)}/34
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center shrink-0">
              <button
                aria-label="Enter chat"
                type="submit"
                disabled={
                  username.length < 4 ||
                  username.length > 34 ||
                  /\d/.test(username) ||
                  !username.trim() ||
                  containsRestrictedWord(username) ||
                  containsEmoji(username)
                }
                className="w-fit text-sm bg-dark text-light font-semibold px-3 py-1 disabled:opacity-60 focus:outline-none"
              >
                Go
              </button>
            </div>
          </div>
        </form>
      </div>
      {error && (
        <div className="absolute -top-1 left-2 lowercase transition-all duration-300">
          <span className="text-red-800 text-bi">{`⁕ ${error}` || "***"}</span>
        </div>
      )}
    </div>
  );
};

export { UsernameForm };
