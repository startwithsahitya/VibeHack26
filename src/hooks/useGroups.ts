import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Group } from "@/lib/types";

export default function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await supabase.from("groups").select("*");
      setGroups(data || []);
    };

    fetchGroups();
  }, []);

  return groups;
}