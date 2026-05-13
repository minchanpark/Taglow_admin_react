import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import {
  AdminUrlBuilder,
  BrowserBlobDownloadHelper,
  BrowserClipboardHelper,
  createEnvConfig,
  type EnvConfig,
} from '../../utils';
import { createAdminApiController } from '../controller/adminApiControllerProvider';
import type { AdminApiController } from '../controller/adminApiController';
import {
  BrowserExternalLinkLauncher,
  type ExternalLinkLauncher,
} from '../service/externalLinkLauncher';
import { SvgQrExportService, type QrExportService } from '../service/qrExportService';
import {
  BrowserQuestionImagePickerService,
  type QuestionImagePickerService,
} from '../service/upload/questionImagePickerService';
import {
  MockQuestionImageUploadService,
  type QuestionImageUploadService,
} from '../service';
import type { ClipboardHelper } from '../../utils';

export type AdminRuntime = Readonly<{
  env: EnvConfig;
  adminApiController: AdminApiController;
  urlBuilder: AdminUrlBuilder;
  clipboard: ClipboardHelper;
  qrExportService: QrExportService;
  externalLinkLauncher: ExternalLinkLauncher;
  imagePickerService: QuestionImagePickerService;
  imageUploadService: QuestionImageUploadService;
}>;

const AdminRuntimeContext = createContext<AdminRuntime | null>(null);

export function AdminRuntimeProvider({ children }: PropsWithChildren) {
  const runtime = useMemo<AdminRuntime>(() => {
    const env = createEnvConfig();
    const downloadHelper = new BrowserBlobDownloadHelper();
    return {
      env,
      adminApiController: createAdminApiController(env),
      urlBuilder: new AdminUrlBuilder(env.participantBaseUrl, env.playerBaseUrl),
      clipboard: new BrowserClipboardHelper(),
      qrExportService: new SvgQrExportService(downloadHelper),
      externalLinkLauncher: new BrowserExternalLinkLauncher(),
      imagePickerService: new BrowserQuestionImagePickerService(),
      imageUploadService: new MockQuestionImageUploadService(),
    };
  }, []);

  return (
    <AdminRuntimeContext.Provider value={runtime}>
      {children}
    </AdminRuntimeContext.Provider>
  );
}

export const useAdminRuntime = () => {
  const runtime = useContext(AdminRuntimeContext);
  if (!runtime) {
    throw new Error('AdminRuntimeProvider is missing.');
  }
  return runtime;
};

export const useAdminApiController = () => useAdminRuntime().adminApiController;
