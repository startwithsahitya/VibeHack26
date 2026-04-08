import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function useUser() {
  const [user, setUser] = useState<any | undefined>(undefined);

  useEffect(() => {
    // get initial user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // listen to auth changes 🔥
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return user;
}