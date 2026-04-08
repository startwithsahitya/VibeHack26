export type Group = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
};