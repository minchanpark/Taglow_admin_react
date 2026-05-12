import { describe, expect, it } from 'vitest';
import { canUseAdminConsole, isAdmin, type AdminUser } from './index';

describe('AdminUser helpers', () => {
  it('allows USER and ADMIN roles to use the console', () => {
    const user: AdminUser = { id: '1', name: 'operator', roles: new Set(['USER']) };
    const admin: AdminUser = {
      id: '2',
      name: 'admin',
      roles: new Set(['USER', 'ADMIN']),
    };

    expect(canUseAdminConsole(user)).toBe(true);
    expect(canUseAdminConsole(admin)).toBe(true);
    expect(isAdmin(admin)).toBe(true);
  });

  it('blocks unsupported roles', () => {
    const guest: AdminUser = { id: '3', name: 'guest', roles: new Set(['VIEWER']) };

    expect(canUseAdminConsole(guest)).toBe(false);
    expect(isAdmin(guest)).toBe(false);
  });
});
