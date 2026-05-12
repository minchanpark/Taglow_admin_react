import type { EnvConfig } from '../../utils';
import type { AdminService } from './adminService';
import { MockAdminService } from './mockAdminService';

export const createAdminService = (_env: EnvConfig): AdminService => {
  return new MockAdminService();
};
