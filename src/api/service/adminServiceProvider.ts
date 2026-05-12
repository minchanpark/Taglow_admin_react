import type { EnvConfig } from '../../utils';
import type { AdminService } from './adminService';
import { FetchAdminApiGateway } from './gateway/fetchAdminApiGateway';
import { GatewayAdminService } from './gatewayAdminService';
import { AdminPayloadMapper } from './mapper/adminPayloadMapper';
import { MockAdminService } from './mockAdminService';

export const createAdminService = (env: EnvConfig): AdminService => {
  if (env.useMockService) return new MockAdminService();

  return new GatewayAdminService(
    new FetchAdminApiGateway({
      baseUrl: env.apiBaseUrl,
      voteCreatePath: env.voteCreatePath,
    }),
    new AdminPayloadMapper(),
  );
};
