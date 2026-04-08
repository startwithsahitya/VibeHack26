"use client";

import { useRouter } from "next/navigation";
import useGroups from "@/hooks/useGroups";

export default function GroupList() {
  const groups = useGroups();
  const router = useRouter();

  return (
    <div>
      <h3>Groups</h3>
      {groups.map((g) => (
        <div key={g.id} onClick={() => router.push(`/chat/${g.id}`)}>
          {g.name}
        </div>
      ))}
    </div>
  );
}