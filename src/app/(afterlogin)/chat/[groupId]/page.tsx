"use client";

import { useParams } from "next/navigation";
import useMessages from "@/hooks/useMessages";
import useUser from "@/hooks/useUser";
import MessageInput from "@/components/MessageInput";

export default function ChatPage() {
  const { groupId } = useParams();
  const messages = useMessages(groupId as string);
  const user = useUser();

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat</h2>

      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <b>{msg.user_id}</b>: {msg.content}
          </div>
        ))}
      </div>

      {user && (
        <MessageInput groupId={groupId as string} userId={user.id} />
      )}
    </div>
  );
}