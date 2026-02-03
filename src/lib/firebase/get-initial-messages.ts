import { adminDb } from "@/lib/firebase/admin";

interface FirebaseMessage {
  code: string;
  text?: string;
  timestamp: number;
  username: string;
}

interface Message {
  id: string;
  code: string;
  username: string;
  text?: string;
  timestamp: number;
}

export async function getInitialMessages(): Promise<{
  messages: Message[];
  users: string[];
}> {
  try {
    const snapshot = await adminDb.ref("messages").once("value");
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
        }),
      ),
    );

    return { messages, users };
  } catch (error) {
    console.error(error);
    return { messages: [], users: [] };
  }
}
