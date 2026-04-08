import { supabase } from "@/lib/supabase/client";

export const createGroup = async (name: string, userId: string) => {
  // 1. create group
  const { data, error } = await supabase
    .from("groups")
    .insert([
      {
        name,
        created_by: userId,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // 2. add creator as member (optional but recommended)
  await supabase.from("group_members").insert([
    {
      group_id: data.id,
      user_id: userId,
    },
  ]);

  return data;
};