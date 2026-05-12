import type { AdminUser } from './adminUser';

export type AdminAuthSession = Readonly<{
  user: AdminUser | null;
  isCheckingSession: boolean;
  errorMessage?: string;
}>;
