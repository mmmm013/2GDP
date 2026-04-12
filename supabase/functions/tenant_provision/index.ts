// Edge Function: tenant_provision
// Creates or upserts a FLAGSHIP tenant, default admin member, and emits an audit event.
// Endpoint: POST /functions/v1/tenant_provision
// Body: { slug: string, name: string, admin_email?: string, admin_auth_user_id?: string }
// File: supabase/functions/tenant_provision/index.ts

import { supabaseAdmin } from "../_shared/supabaseClient.ts";
import { json, bad, ok, preflight } from "../_shared/responses.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return bad("Method not allowed", 405);

  try {
    const body = await req.json().catch(() => null);
    if (!body?.slug || !body?.name) return bad("slug and name are required");

    const slug: string = body.slug.toLowerCase().trim();
    const name: string = body.name.trim();
    const adminEmail: string | undefined = body.admin_email;
    const adminAuthUserId: string | undefined = body.admin_auth_user_id;

    // 1. Upsert tenant (idempotent)
    const { data: tenant, error: tenantErr } = await supabaseAdmin
      .from("tenants")
      .upsert({ slug, name }, { onConflict: "slug" })
      .select()
      .single();

    if (tenantErr) return bad(`Tenant upsert failed: ${tenantErr.message}`, 500);

    let profileId: string | null = null;

    // 2. Upsert admin user profile if provided
    if (adminEmail && adminAuthUserId) {
      const { data: profile, error: profileErr } = await supabaseAdmin
        .from("user_profiles")
        .upsert(
          {
            auth_user_id: adminAuthUserId,
            tenant_id: tenant.id,
            email: adminEmail.toLowerCase().trim(),
            display_name: adminEmail,
          },
          { onConflict: "auth_user_id" }
        )
        .select()
        .single();

      if (profileErr) return bad(`Profile upsert failed: ${profileErr.message}`, 500);
      profileId = profile.id;

      // 3. Upsert owner membership
      const { error: memberErr } = await supabaseAdmin
        .from("tenant_members")
        .upsert(
          { tenant_id: tenant.id, user_id: profileId, role: "owner" },
          { onConflict: "tenant_id,user_id" }
        );

      if (memberErr) return bad(`Member upsert failed: ${memberErr.message}`, 500);
    }

    // 4. Write audit event
    await supabaseAdmin.from("audit_log").insert({
      tenant_id: tenant.id,
      action: "TENANT_PROVISION",
      table_name: "tenants",
      row_pk: tenant.id,
      diff: { slug, name, admin_email: adminEmail ?? null },
    });

    return ok({ tenant, profile_id: profileId });
  } catch (e) {
    console.error("[tenant_provision] Unexpected error:", e);
    return bad(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
