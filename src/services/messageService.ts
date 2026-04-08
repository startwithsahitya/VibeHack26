import { supabase } from "@/lib/supabase/client";

export const sendMessage = async (
  groupId: string,
  userId: string,
  content: string
) => {
  return await supabase.from("messages").insert([
    { group_id: groupId, user_id: userId, content },
  ]);
};