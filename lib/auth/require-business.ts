import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BusinessRow, ProfileRow } from "@/lib/supabase/types";

export type BusinessContext = {
  user: User;
  profile: Pick<ProfileRow, "id" | "full_name" | "role">;
};

export async function requireBusinessContext(): Promise<BusinessContext> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read profile: ${error.message}`);
  }

  if (!profile) {
    redirect("/auth?error=profile_missing");
  }

  if (profile.role !== "business") {
    redirect("/auth?error=business_only");
  }

  return {
    user,
    profile
  };
}

export async function getPrimaryBusiness(ownerId: string): Promise<BusinessRow | null> {
  const supabase = await createServerSupabaseClient();
  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) {
    throw new Error(`Failed to fetch business: ${error.message}`);
  }

  return businesses?.[0] ?? null;
}
