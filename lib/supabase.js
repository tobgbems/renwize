import { createClient } from "@supabase/supabase-js";

/**
 * Supabase API keys are JWTs. PostgREST uses the `role` claim; only `service_role`
 * bypasses RLS. A mis-pasted anon key yields empty `users` / `subscriptions` rows with no error.
 */
function assertServiceRoleJwt(secretKey) {
  const parts = secretKey.split(".");
  if (parts.length !== 3) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not a valid JWT. Use the service_role secret from Supabase → Project Settings → API.",
    );
  }
  let payload;
  try {
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    payload = JSON.parse(json);
  } catch {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY could not be decoded. Use the service_role secret from Supabase → Project Settings → API.",
    );
  }
  if (payload.role !== "service_role") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY must be the service_role secret, not the anon key. With RLS enabled, the wrong key returns empty dashboard data. Copy service_role from Supabase → Project Settings → API.",
    );
  }
}

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Supabase environment variables are missing. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  assertServiceRoleJwt(supabaseServiceRoleKey);

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}
