"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

let client: SupabaseClient<Database> | null = null;

export function createBrowserSupabaseClient() {
  if (client) {
    return client;
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();
  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return client;
}
