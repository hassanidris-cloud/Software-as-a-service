import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request
  });
  let supabaseUrl: string;
  let supabaseAnonKey: string;

  try {
    const env = getSupabaseEnv();
    supabaseUrl = env.supabaseUrl;
    supabaseAnonKey = env.supabaseAnonKey;
  } catch {
    return { response, user: null };
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as CookieOptions)
        );
      }
    }
  });

  // Important: this call refreshes the auth session when needed.
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { response, user };
}
