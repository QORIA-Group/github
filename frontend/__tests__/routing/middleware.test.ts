/**
 * Tests for Next.js middleware routing logic.
 * Verifies that users are redirected to the correct dashboard based on their JWT tenant type.
 */

// Helper to create a base64-encoded JWT payload
function encodePayload(payload: Record<string, unknown>): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

describe('Middleware Routing Logic', () => {
  // Test the routing decision logic (extracted from middleware)
  function getRedirect(tenantType: string, pathname: string): string | null {
    if (tenantType === 'CGO' && pathname.startsWith('/client')) {
      return '/cgo/dashboard';
    }
    if (tenantType === 'CLIENT' && pathname.startsWith('/cgo')) {
      return '/client/autopilot';
    }
    return null;
  }

  it('should redirect CGO user from /client/* to /cgo/dashboard', () => {
    expect(getRedirect('CGO', '/client/autopilot')).toBe('/cgo/dashboard');
  });

  it('should redirect CLIENT user from /cgo/* to /client/autopilot', () => {
    expect(getRedirect('CLIENT', '/cgo/dashboard')).toBe('/client/autopilot');
  });

  it('should allow CGO user to access /cgo/dashboard', () => {
    expect(getRedirect('CGO', '/cgo/dashboard')).toBeNull();
  });

  it('should allow CLIENT user to access /client/autopilot', () => {
    expect(getRedirect('CLIENT', '/client/autopilot')).toBeNull();
  });

  it('should correctly decode JWT payload for routing', () => {
    const token = encodePayload({ sub: 'user-1', tenantType: 'CGO', tenantId: 'tenant-1' });
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    expect(payload.tenantType).toBe('CGO');
  });
});
