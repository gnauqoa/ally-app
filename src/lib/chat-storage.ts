export interface ChatRecord {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
  }>;
  selectedCategory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = "chat_records";

export function generateChatTitle(content: string): string {
  return content.length > 50 ? content.substring(0, 50) + "..." : content;
}

export function getChatRecords(): ChatRecord[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const records = JSON.parse(stored);
    return records.map((record: any) => ({
      ...record,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
      messages: record.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch {
    return [];
  }
}

export function getChatRecord(id: string): ChatRecord | null {
  const records = getChatRecords();
  return records.find((r) => r.id === id) || null;
}

export function saveChatRecord(record: ChatRecord): void {
  if (typeof window === "undefined") return;
  const records = getChatRecords();
  const existingIndex = records.findIndex((r) => r.id === record.id);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function createNewChatRecord(): ChatRecord {
  return {
    id: Date.now().toString(),
    title: "New Chat",
    messages: [
      {
        id: "1",
        content: "Hello! How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function deleteChatRecord(id: string): void {
  if (typeof window === "undefined") return;
  const records = getChatRecords();
  const filtered = records.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
