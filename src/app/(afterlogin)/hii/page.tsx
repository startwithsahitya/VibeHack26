"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GroupList from "@/components/GroupList";
import useUser from "@/hooks/useUser";
import { createGroup } from "@/services/groupService";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  const [groupName, setGroupName] = useState("");

  // ✅ Handle redirect safely
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  // 🔄 Loading
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return null;
  }

  // 👇 👉 PUT YOUR FUNCTION HERE 👇
  const handleCreateGroup = async () => {
    if (!groupName.trim() || !user?.id) return;

    try {
      console.log("Creating group...", groupName, user?.id);

      const group = await createGroup(groupName, user.id);

      console.log("Created group:", group);

      router.push(`/chat/${group.id}`);
    } catch (err) {
      console.error("CREATE GROUP ERROR:", err);
      alert("Failed to create group");
    }
  };

  // UI
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{ width: 250, borderRight: "1px solid #ccc", padding: 10 }}>
        <h3>{user.user_metadata?.full_name}</h3>

        {/* 🔥 Create Group UI */}
        <div style={{ marginBottom: 20 }}>
          <input
            placeholder="New group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          {/* 👇 FUNCTION USED HERE 👇 */}
          <button onClick={handleCreateGroup}>
            + Create Group
          </button>
        </div>

        <GroupList />
      </div>

      <div style={{ flex: 1, padding: 20 }}>
        <h2>Select a group</h2>
      </div>
    </div>
  );
}