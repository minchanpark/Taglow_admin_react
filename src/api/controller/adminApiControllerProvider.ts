import type { EnvConfig } from '../../utils';
import type { AdminApiController } from './adminApiController';
import { GatewayAdminApiController } from './gatewayAdminApiController';
import { MockAdminApiController } from './mockAdminApiController';
import { FetchAdminApiGateway } from '../service/gateway/fetchAdminApiGateway';
import { AdminPayloadMapper } from '../service/mapper/adminPayloadMapper';

export const createAdminApiController = (env: EnvConfig): AdminApiController => {
  if (env.useMockService) return new MockAdminApiController();

  return new GatewayAdminApiController(
    new FetchAdminApiGateway({
      baseUrl: env.apiBaseUrl,
      voteCreatePath: env.voteCreatePath,
    }),
    new AdminPayloadMapper(),
  );
};
