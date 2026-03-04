import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email?: string;
  name?: string | null;
  role: string;
  level: string;
  walletBalance: number;
};

export async function getSession(): Promise<{ user: SessionUser } | null> {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, name, role, level, wallet_balance")
    .eq("id", authUser.id)
    .single();

  if (!profile) return null;

  return {
    user: {
      id: profile.id,
      email: profile.email ?? authUser.email ?? undefined,
      name: profile.name,
      role: profile.role ?? "user",
      level: (profile as { level?: string }).level ?? "principiante",
      walletBalance: profile.wallet_balance ?? 0,
    },
  };
}
