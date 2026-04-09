import { NextRequest } from 'next/server';

const BYPASS_HEADER = 'x-gpme-admin-token';

export function hasGpmeAdminBypass(req: NextRequest): boolean {
  const expected = process.env.GPME_ADMIN_TOKEN;
  if (!expected) return false;
  const provided = req.headers.get(BYPASS_HEADER);
  return Boolean(provided && provided === expected);
}

export function blockedCustomizationResponse() {
  return {
    error: 'GPME is read-only for customization. Use premades in-platform and submit external custom requests.',
    policy: {
      gpme_read_only: true,
      mip2_outside_only: true,
      mip1_denied: true,
    },
  };
}
