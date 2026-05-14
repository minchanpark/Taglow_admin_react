import type {
  AdminQuestion,
  AdminQuestionTag,
  AdminQuestionTagType,
  AdminUser,
  AdminVote,
  VoteStatus,
} from '../../model';

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

const normalizeTagType = (value: unknown): AdminQuestionTagType => {
  const type = toStringValue(value).trim().toUpperCase();
  if (type === 'TEXT' || type === 'PHOTO' || type === 'VIDEO') return type;
  return 'UNKNOWN';
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

const findFirstValue = (
  value: unknown,
  keys: string[],
  depth = 0,
): unknown => {
  if (!isRecord(value) || depth > 4) return undefined;

  for (const key of keys) {
    const candidate = value[key];
    if (candidate !== undefined && candidate !== null) return candidate;
  }

  for (const key of ['data', 'item', 'vote', 'question', 'post']) {
    const nested = value[key];
    if (!isRecord(nested)) continue;
    const candidate = findFirstValue(nested, keys, depth + 1);
    if (candidate !== undefined) return candidate;
  }

  return undefined;
};

const normalizeCount = (value: unknown) => {
  const count = toNumber(value);
  if (count == null) return undefined;
  return Math.max(0, Math.trunc(count));
};

const countFromPayload = (
  payload: Record<string, unknown>,
  countKeys: string[],
  listKeys: string[],
) => {
  const explicitCount = normalizeCount(findFirstValue(payload, countKeys));
  if (explicitCount !== undefined) return explicitCount;

  const list = findFirstValue(payload, listKeys);
  return Array.isArray(list) ? list.length : undefined;
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

const tagLocationValue = (rawTag: Record<string, unknown>, axis: 'x' | 'y') => {
  const position = isRecord(rawTag.position) ? rawTag.position : undefined;
  const location = isRecord(rawTag.location) ? rawTag.location : undefined;
  const keys =
    axis === 'x'
      ? [
          rawTag.locationX,
          rawTag.location_x,
          rawTag.positionX,
          rawTag.position_x,
          rawTag.x,
          rawTag.left,
          rawTag.xRatio,
          rawTag.ratioX,
          position?.x,
          position?.left,
          position?.locationX,
          location?.x,
          location?.left,
          location?.locationX,
        ]
      : [
          rawTag.locationY,
          rawTag.location_y,
          rawTag.positionY,
          rawTag.position_y,
          rawTag.y,
          rawTag.top,
          rawTag.yRatio,
          rawTag.ratioY,
          position?.y,
          position?.top,
          position?.locationY,
          location?.y,
          location?.top,
          location?.locationY,
        ];

  for (const key of keys) {
    const value = toNumber(key);
    if (value !== undefined) return value;
  }

  return undefined;
};

const tagFromPayload = (
  rawTag: Record<string, unknown>,
  fallback: { questionId: string; index: number },
): AdminQuestionTag | undefined => {
  const locationX = tagLocationValue(rawTag, 'x');
  const locationY = tagLocationValue(rawTag, 'y');
  if (locationX === undefined || locationY === undefined) return undefined;

  const questionId = toStringId(
    rawTag.questionId ?? rawTag.question_id,
    fallback.questionId,
  );

  return {
    id: toStringId(
      rawTag.id ?? rawTag.tagId ?? rawTag.tag_id,
      `${questionId}:tag-${fallback.index}`,
    ),
    questionId,
    type: normalizeTagType(rawTag.type ?? rawTag.tagType ?? rawTag.tag_type),
    locationX,
    locationY,
    data: optionalString(rawTag.data ?? rawTag.value ?? rawTag.text),
    duration: normalizeCount(rawTag.duration),
    createdAt: optionalString(rawTag.createdAt ?? rawTag.created_at),
    updatedAt: optionalString(rawTag.updatedAt ?? rawTag.updated_at),
  };
};

const tagsFromPayload = (
  payload: Record<string, unknown>,
  questionId: string,
): AdminQuestionTag[] => {
  const rawTags = findFirstValue(payload, ['tags', 'tagList', 'tag_list']);
  if (!Array.isArray(rawTags)) return [];

  return rawTags
    .filter(isRecord)
    .map((tag, index) => tagFromPayload(tag, { questionId, index }))
    .filter((tag): tag is AdminQuestionTag => Boolean(tag));
};

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
      questionCount: countFromPayload(
        payload,
        ['questionCount', 'questionsCount', 'question_count', 'questions_count'],
        ['questions', 'questionList', 'question_list'],
      ),
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
    const tags = tagsFromPayload(payload, id);

    return {
      id,
      voteId,
      title: toStringValue(rawQuestion.title ?? rawQuestion.name, 'Untitled'),
      detail: toStringValue(
        rawQuestion.detail ?? rawQuestion.description ?? rawQuestion.content,
      ),
      imageUrl: imageUrlFromQuestion(rawQuestion),
      imageRatio: decodeImageRatio(rawQuestion.imageRatio, rawQuestion),
      tagCount: countFromPayload(
        payload,
        ['tagCount', 'tagsCount', 'tag_count', 'tags_count'],
        ['tags', 'tagList', 'tag_list'],
      ),
      tags,
      createdAt: optionalString(rawQuestion.createdAt ?? rawQuestion.created_at),
      updatedAt: optionalString(rawQuestion.updatedAt ?? rawQuestion.updated_at),
    };
  }
}

export const adminPayloadMapper = new AdminPayloadMapper();
