import type { EnvConfig } from '../../utils';
import { debugAuthFlow } from '../../utils';
import type { AdminApiController } from './adminApiController';
import { GatewayAdminApiController } from './gatewayAdminApiController';
import { FetchAdminApiGateway } from '../service/gateway/fetchAdminApiGateway';
import { AdminPayloadMapper } from '../service/mapper/adminPayloadMapper';

export const createAdminApiController = (env: EnvConfig): AdminApiController => {
  debugAuthFlow('AdminApiControllerProvider.create', {
    apiMode: env.apiBaseUrl ? 'remote' : 'dev-proxy',
  });

  debugAuthFlow('AdminApiControllerProvider.selected', { controller: 'gateway' });
  return new GatewayAdminApiController(
    new FetchAdminApiGateway({
      baseUrl: env.apiBaseUrl,
      voteCreatePath: env.voteCreatePath,
    }),
    new AdminPayloadMapper(),
  );
};
