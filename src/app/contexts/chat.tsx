"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { messagesDatabase as database } from "@/lib/firebase/chat-firebase";
import {
  ref,
  onValue,
  push,
  set,
  serverTimestamp,
  query,
} from "firebase/database";

const CHAT_USERNAME = "_cfmpulse_USER";

interface Message {
  id: string;
  code: string;
  username: string;
  text?: string;
  timestamp: number;
}

interface FirebaseMessage {
  code: string;
  text?: string;
  timestamp: number;
  username: string;
}

interface ChatContextType {
  username: string;
  userId: string;
  messages: Message[];
  isConnected: boolean;
  isChatVisible: boolean;
  isUsernameFormVisible: boolean;
  isWelcomeBackMode: boolean;
  isMessagesLoading: boolean;
  users: string[];
  setUsername: (username: string) => void;
  sendMessage: (content: { text?: string }) => void;
  toggleChatVisibility: () => void;
  toggleUsernameForm: () => void;
  leaveChat: () => void;
  startChat: () => void;
}

interface ChatProviderProps {
  children: React.ReactNode;
  initialMessages?: Message[];
  initialUsers?: string[];
}

const INITIAL_STATE: Omit<
  ChatContextType,
  | "setUsername"
  | "sendMessage"
  | "toggleChatVisibility"
  | "toggleUsernameForm"
  | "leaveChat"
  | "startChat"
> = {
  username: "",
  userId: "",
  messages: [],
  isConnected: false,
  isChatVisible: false,
  isUsernameFormVisible: false,
  isWelcomeBackMode: false,
  isMessagesLoading: true,
  users: [],
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  initialMessages = [],
  initialUsers = [],
}) => {
  const [state, setState] = useState({
    ...INITIAL_STATE,
    messages: initialMessages,
    users: initialUsers,
    isMessagesLoading: false,
  });

  useEffect(() => {
    const savedUserInfo = Cookies.get(CHAT_USERNAME);
    if (savedUserInfo) {
      const [savedUsername, savedUserId] = savedUserInfo.split("|");

      setState((prevState) => ({
        ...prevState,
        username: savedUsername,
        userId: savedUserId,
        isWelcomeBackMode: true,
        isConnected: true,
      }));
    }
  }, []);

  useEffect(() => {
    const messagesRef = query(ref(database, "messages"));

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val();
        const messages = data
          ? Object.entries(data as Record<string, FirebaseMessage>)
              .map(([id, message]) => ({
                id,
                ...message,
              }))
              .sort((a, b) => a.timestamp - b.timestamp)
          : [];

        const users = Array.from(
          new Set(
            messages.map((message) => {
              const username = message.username;
              if (!username || typeof username !== "string") {
                return "";
              }
              const match = username.match(/^(.+?)(\s\(\w+\))?$/);
              return match ? match[1] : username;
            })
          )
        );

        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            messages,
            users,
            isConnected: true,
          }));
        }, 2500);
      },
      (error) => {
        console.error("Firebase error:", error);
        setState((prevState) => ({ ...prevState, isConnected: false }));
      }
    );

    return () => unsubscribe();
  }, []);

  const setUsername = async (inputUsername: string) => {
    const newUserId = uuidv4().replace(/-/g, "").toLowerCase();
    const trimmedUsername = inputUsername.trim();
    const userCode = newUserId.slice(-4);
    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Kampala",
    });

    const userAgent = navigator.userAgent;
    const deviceInfo = {
      userAgent,
      language: navigator.language || "",
    };

    Cookies.set(CHAT_USERNAME, `${trimmedUsername}|${newUserId}`, {
      expires: 120,
      path: "/",
    });

    setState((prevState) => ({
      ...prevState,
      username: trimmedUsername,
      userId: newUserId,
      isUsernameFormVisible: false,
      isWelcomeBackMode: false,
      isConnected: true,
    }));

    let ipData = null;
    try {
      const response = await fetch("https://ipwho.is/");
      const s = await response.json();

      if (response.ok && s.success !== false) {
        ipData = {
          ip: s.ip,
          city: s.city,
          region: s.region,
          country: s.country,
          continent: s.continent,
          postal: s.postal,
          latitude: s.latitude,
          longitude: s.longitude,
          timezone: s.timezone?.id,
          isp: s.connection?.org || s.connection?.isp || "",
        };
      }
    } catch {
      console.log("Error, but OK...");
    }

    try {
      const newUser = {
        username: trimmedUsername,
        userId: newUserId,
        code: userCode,
        timestamp,
        ...deviceInfo,
        ...(ipData && ipData),
      };

      const newUsersRef = ref(database, "users");
      const newUserRef = push(newUsersRef);
      await set(newUserRef, newUser);

      await fetch("https://formbold.com/s/3GvG0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notification: "New User Joined CFM Pulse Chat",
          username: trimmedUsername,
          userId: userCode,
          timestamp,
          ...deviceInfo,
          ...(ipData && ipData),
        }),
      });
    } catch {
      console.error("Error");
    }
  };

  const sendMessage = async (content: { text?: string }) => {
    const { username, userId } = state;

    if (!username || !content.text?.trim()) return;

    try {
      const messagesRef = ref(database, "messages");
      const newMessage = {
        code: userId,
        username: username,
        text: content.text.trim(),
        timestamp: serverTimestamp(),
      };

      const newMessageRef = push(messagesRef);
      await set(newMessageRef, newMessage);

      const formData = {
        notification: "New Message in CFM Pulse Chat",
        username: username,
        text: content.text.trim(),
        userId: userId,
        timestamp: new Date().toLocaleString("en-US", {
          timeZone: "Africa/Kampala",
        }),
      };

      await fetch("https://formbold.com/s/3GvG0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } catch {
      console.error("Error");
    }
  };

  const toggleChatVisibility = () => {
    setState((prevState) => {
      const newVisibility = !prevState.isChatVisible;

      if (newVisibility) {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isMessagesLoading: false,
          }));
        }, 2000);

        return {
          ...prevState,
          isChatVisible: newVisibility,
          isMessagesLoading: true,
        };
      }

      return {
        ...prevState,
        isChatVisible: newVisibility,
      };
    });
  };

  const toggleUsernameForm = () => {
    setState((prevState) => ({
      ...prevState,
      isUsernameFormVisible: !prevState.isUsernameFormVisible,
      isWelcomeBackMode: false,
    }));
  };

  const leaveChat = () => {
    Cookies.remove(CHAT_USERNAME);

    setState((prevState) => ({
      ...INITIAL_STATE,
      messages: prevState.messages,
      users: prevState.users,
      isChatVisible: prevState.isChatVisible,
    }));
  };

  const startChat = () => {
    setState((prevState) => ({
      ...prevState,
      isWelcomeBackMode: false,
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,
        setUsername,
        sendMessage,
        toggleChatVisibility,
        toggleUsernameForm,
        leaveChat,
        startChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export {
  type Message,
  type FirebaseMessage,
  type ChatContextType,
  ChatProvider,
  useChat,
};
