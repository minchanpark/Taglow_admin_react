import type { AdminQuestion, AdminUser, AdminVote, VoteStatus } from '../../model';

const IMAGE_RATIO_SCALE = 10000;

type UserFallback = {
  fallbackName?: string;
};

type VoteFallback = {
  currentUser?: AdminUser | null;
};

type QuestionFallback = {
  voteId?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const firstRecord = (
  payload: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> => {
  for (const key of keys) {
    const value = payload[key];
    if (isRecord(value)) return firstRecord(value, keys);
  }
  return payload;
};

const toStringValue = (value: unknown, fallback = '') => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

const optionalString = (value: unknown) => {
  const normalized = toStringValue(value);
  return normalized.trim() ? normalized : undefined;
};

const toStringId = (value: unknown, fallback: string) => {
  const normalized = toStringValue(value);
  return normalized.trim() ? normalized : fallback;
};

const normalizeRole = (value: unknown) => {
  const role = isRecord(value)
    ? toStringValue(value.role ?? value.name ?? value.authority)
    : toStringValue(value);
  return role.replace(/^ROLE_/i, '').trim().toUpperCase();
};

const toRoleSet = (payload: Record<string, unknown>) => {
  const rawRoles =
    payload.roles ?? payload.authorities ?? payload.roleList ?? payload.role;
  const roles = new Set<string>();

  if (Array.isArray(rawRoles)) {
    rawRoles.map(normalizeRole).filter(Boolean).forEach((role) => roles.add(role));
  } else {
    const role = normalizeRole(rawRoles);
    if (role) roles.add(role);
  }

  return roles;
};

const normalizeStatus = (value: unknown): VoteStatus => {
  const status = toStringValue(value, 'PROGRESS').trim().toUpperCase();
  if (['END', 'ENDED', 'CLOSED', 'DONE', 'FINISHED'].includes(status)) return 'END';
  return 'PROGRESS';
};

const normalizeBoolean = (value: unknown) =>
  typeof value === 'boolean' ? value : undefined;

const toNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const decodeImageRatio = (
  imageRatio: unknown,
  rawQuestion: Record<string, unknown>,
) => {
  const ratio = toNumber(imageRatio);
  if (ratio && ratio > 0) {
    return ratio > 10 ? ratio / IMAGE_RATIO_SCALE : ratio;
  }

  const width = toNumber(rawQuestion.imageWidth ?? rawQuestion.width);
  const height = toNumber(rawQuestion.imageHeight ?? rawQuestion.height);
  if (width && height) return width / height;

  return 1;
};

const encodeImageRatio = (imageRatio: number) => {
  if (!Number.isFinite(imageRatio) || imageRatio <= 0) return IMAGE_RATIO_SCALE;
  return Math.round(imageRatio * IMAGE_RATIO_SCALE);
};

const toPathIdPayloadValue = (value: string) => {
  const normalized = value.trim();
  if (/^\d+$/.test(normalized)) {
    const parsed = Number(normalized);
    if (Number.isSafeInteger(parsed)) return parsed;
  }
  return normalized;
};

const withoutNil = (payload: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null),
  );

const imageUrlFromQuestion = (rawQuestion: Record<string, unknown>) =>
  toStringValue(
    rawQuestion.imageProxyUrl ??
      rawQuestion.image_proxy_url ??
      rawQuestion.proxiedImageUrl ??
      rawQuestion.proxied_image_url ??
      rawQuestion.imageUrl ??
      rawQuestion.image_url ??
      rawQuestion.posterImageUrl ??
      rawQuestion.mediaUrl,
  );

export class AdminPayloadMapper {
  loginToPayload(input: { name: string; password: string }) {
    return {
      name: input.name,
      password: input.password,
    };
  }

  signupToPayload(input: { name: string; password: string }) {
    return {
      name: input.name,
      password: input.password,
    };
  }

  userFromPayload(
    payload: Record<string, unknown>,
    fallback: UserFallback = {},
  ): AdminUser {
    const rawUser = firstRecord(payload, ['user', 'data', 'account', 'member']);
    const name = toStringValue(
      rawUser.name ?? rawUser.username ?? rawUser.loginId,
      fallback.fallbackName ?? 'operator',
    );
    const id = toStringId(rawUser.id ?? rawUser.userId ?? rawUser.memberId, name);

    return {
      id,
      name,
      roles: toRoleSet(rawUser),
    };
  }

  createVoteToPayload(input: { name: string }) {
    return {
      name: input.name,
    };
  }

  updateVoteToPayload(input: { name?: string; status?: VoteStatus }) {
    return withoutNil({
      name: input.name,
      status: input.status,
    });
  }

  voteFromPayload(
    payload: Record<string, unknown>,
    fallback: VoteFallback = {},
  ): AdminVote {
    const rawVote = firstRecord(payload, ['vote', 'data', 'item', 'display']);
    const id = toStringId(rawVote.id ?? rawVote.voteId ?? rawVote.eventId, '');
    const createdByUserId = toStringValue(
      rawVote.createdByUserId ??
        rawVote.createdBy ??
        rawVote.creatorId ??
        rawVote.ownerId ??
        (isRecord(rawVote.user) ? rawVote.user.id ?? rawVote.user.userId : undefined),
      fallback.currentUser?.id ?? '',
    );
    const explicitMine = normalizeBoolean(rawVote.isMine ?? rawVote.mine ?? rawVote.owned);

    return {
      id,
      name: toStringValue(rawVote.name ?? rawVote.voteName ?? rawVote.title, 'Untitled'),
      status: normalizeStatus(rawVote.status ?? rawVote.state),
      createdByUserId,
      isMine:
        explicitMine ??
        Boolean(fallback.currentUser?.id && createdByUserId === fallback.currentUser.id),
      createdAt: optionalString(rawVote.createdAt ?? rawVote.created_at),
      updatedAt: optionalString(rawVote.updatedAt ?? rawVote.updated_at),
    };
  }

  createQuestionToPayload(input: {
    voteId: string;
    title: string;
    detail: string;
    imageUrl: string;
    imageRatio: number;
  }) {
    return {
      voteId: toPathIdPayloadValue(input.voteId),
      title: input.title,
      detail: input.detail,
      imageUrl: input.imageUrl,
      imageRatio: encodeImageRatio(input.imageRatio),
    };
  }

  updateQuestionToPayload(input: {
    title?: string;
    detail?: string;
    imageUrl?: string;
    imageRatio?: number;
  }) {
    return withoutNil({
      title: input.title,
      detail: input.detail,
      imageUrl: input.imageUrl,
      imageRatio:
        input.imageRatio == null ? undefined : encodeImageRatio(input.imageRatio),
    });
  }

  questionFromPayload(
    payload: Record<string, unknown>,
    fallback: QuestionFallback = {},
  ): AdminQuestion {
    const rawQuestion = firstRecord(payload, ['question', 'data', 'item', 'post']);
    const id = toStringId(
      rawQuestion.id ?? rawQuestion.questionId ?? rawQuestion.votePostId ?? rawQuestion.postId,
      '',
    );
    const voteId = toStringId(
      rawQuestion.voteId ?? rawQuestion.eventId,
      fallback.voteId ?? '',
    );

    return {
      id,
      voteId,
      title: toStringValue(rawQuestion.title ?? rawQuestion.name, 'Untitled'),
      detail: toStringValue(
        rawQuestion.detail ?? rawQuestion.description ?? rawQuestion.content,
      ),
      imageUrl: imageUrlFromQuestion(rawQuestion),
      imageRatio: decodeImageRatio(rawQuestion.imageRatio, rawQuestion),
      createdAt: optionalString(rawQuestion.createdAt ?? rawQuestion.created_at),
      updatedAt: optionalString(rawQuestion.updatedAt ?? rawQuestion.updated_at),
    };
  }
}

export const adminPayloadMapper = new AdminPayloadMapper();
