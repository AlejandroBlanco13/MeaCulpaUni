import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = await createClient();
  const { data: member } = await supabase
    .from("guild_members")
    .select("id")
    .eq("guild_id", params.id)
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (!member)
    return NextResponse.json({ error: "No eres miembro de este gremio" }, { status: 403 });

  const { data: messages } = await supabase
    .from("guild_messages")
    .select("id, content, user_id, created_at")
    .eq("guild_id", params.id)
    .order("created_at", { ascending: true })
    .limit(100);

  return NextResponse.json({
    messages: (messages ?? []).map((m) => ({
      id: m.id,
      content: m.content,
      userId: m.user_id,
      createdAt: m.created_at,
    })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = await createClient();
  const { data: member } = await supabase
    .from("guild_members")
    .select("id")
    .eq("guild_id", params.id)
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (!member)
    return NextResponse.json({ error: "No eres miembro de este gremio" }, { status: 403 });

  const { content } = await req.json();
  if (!content || typeof content !== "string" || content.length > 500)
    return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });

  const { data: msg } = await supabase
    .from("guild_messages")
    .insert({
      guild_id: params.id,
      user_id: session.user.id,
      content: content.trim(),
    })
    .select()
    .single();
  return NextResponse.json({ message: msg });
}
