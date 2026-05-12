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
import { createAdminService } from './adminServiceProvider';
import type { AdminService } from './adminService';
import {
  BrowserExternalLinkLauncher,
  type ExternalLinkLauncher,
} from './externalLinkLauncher';
import { SvgQrExportService, type QrExportService } from './qrExportService';
import {
  BrowserQuestionImagePickerService,
  type QuestionImagePickerService,
} from './upload/questionImagePickerService';
import {
  MockQuestionImageUploadService,
  type QuestionImageUploadService,
} from './index';
import type { ClipboardHelper } from '../../utils';

export type AdminRuntime = Readonly<{
  env: EnvConfig;
  adminService: AdminService;
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
      adminService: createAdminService(env),
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

export const useAdminService = () => useAdminRuntime().adminService;
