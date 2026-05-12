export type EnvConfig = Readonly<{
  apiBaseUrl: string;
  participantBaseUrl: string;
  playerBaseUrl: string;
  useMockService: boolean;
  voteCreatePath: string;
  awsRegion: string;
  cognitoIdentityPoolId: string;
  s3Bucket: string;
  s3PublicBaseUrl: string;
  s3QuestionImagePrefix: string;
}>;

const readEnv = (key: string): string | undefined => {
  const metaEnv = import.meta.env as Record<string, string | undefined>;
  return metaEnv[key];
};

const readBoolean = (key: string, fallback: boolean) => {
  const value = readEnv(key);
  if (value == null || value === '') return fallback;
  return value.toLowerCase() === 'true';
};

export const createEnvConfig = (): EnvConfig => ({
  apiBaseUrl:
    readEnv('VITE_TAGLOW_API_BASE_URL') ??
    (import.meta.env.DEV ? '' : 'https://vote.newdawnsoi.site'),
  participantBaseUrl:
    readEnv('VITE_TAGLOW_PARTICIPANT_BASE_URL') ??
    'https://taglow-participant.web.app',
  playerBaseUrl:
    readEnv('VITE_TAGLOW_PLAYER_BASE_URL') ?? 'https://taglow-player.web.app',
  useMockService: readBoolean('VITE_TAGLOW_USE_MOCK_SERVICE', false),
  voteCreatePath: readEnv('VITE_TAGLOW_VOTE_CREATE_PATH') ?? '/api/votes',
  awsRegion: readEnv('VITE_TAGLOW_AWS_REGION') ?? 'ap-northeast-2',
  cognitoIdentityPoolId: readEnv('VITE_TAGLOW_COGNITO_IDENTITY_POOL_ID') ?? '',
  s3Bucket: readEnv('VITE_TAGLOW_S3_BUCKET') ?? 'tagvote-content-bucket',
  s3PublicBaseUrl:
    readEnv('VITE_TAGLOW_S3_PUBLIC_BASE_URL') ??
    'https://tagvote-content-bucket.s3.ap-northeast-2.amazonaws.com',
  s3QuestionImagePrefix:
    readEnv('VITE_TAGLOW_S3_QUESTION_IMAGE_PREFIX') ??
    'public/question-images',
});
