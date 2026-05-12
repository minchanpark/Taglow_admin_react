export type AdminUser = Readonly<{
  id: string;
  name: string;
  roles: ReadonlySet<string>;
}>;

export const isAdmin = (user: AdminUser) => user.roles.has('ADMIN');

export const canUseAdminConsole = (user: AdminUser) =>
  user.roles.has('USER') || user.roles.has('ADMIN');
