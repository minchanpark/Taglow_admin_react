import type { EnvConfig } from '../../utils';
import { debugAuthFlow } from '../../utils';
import type { AdminApiController } from './adminApiController';
import { GatewayAdminApiController } from './gatewayAdminApiController';
import { MockAdminApiController } from './mockAdminApiController';
import { FetchAdminApiGateway } from '../service/gateway/fetchAdminApiGateway';
import { AdminPayloadMapper } from '../service/mapper/adminPayloadMapper';

export const createAdminApiController = (env: EnvConfig): AdminApiController => {
  debugAuthFlow('AdminApiControllerProvider.create', {
    useMockService: env.useMockService,
    apiMode: env.apiBaseUrl ? 'remote' : 'dev-proxy',
  });
  if (env.useMockService) {
    debugAuthFlow('AdminApiControllerProvider.selected', { controller: 'mock' });
    return new MockAdminApiController();
  }

  debugAuthFlow('AdminApiControllerProvider.selected', { controller: 'gateway' });
  return new GatewayAdminApiController(
    new FetchAdminApiGateway({
      baseUrl: env.apiBaseUrl,
      voteCreatePath: env.voteCreatePath,
    }),
    new AdminPayloadMapper(),
  );
};
