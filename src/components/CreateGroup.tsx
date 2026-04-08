"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { createGroup } from "@/services/groupService";

export default function CreateGroup() {
  const [name, setName] = useState("");
  const user = useUser();
  const router = useRouter();

  const handleCreate = async () => {
    if (!name || !user) return;

    try {
      const group = await createGroup(name, user.id);

      // redirect to new group
      router.push(`/chat/${group.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create group");
    }
  };

  return (
    <div>
      <input
        placeholder="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}