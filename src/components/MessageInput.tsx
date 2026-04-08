"use client";

import { useState } from "react";
import { sendMessage } from "@/services/messageService";

export default function MessageInput({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input) return;

    await sendMessage(groupId, userId, input);
    setInput("");
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}