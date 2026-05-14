import { ChevronLeft, Tags } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoteDetailQuery } from '../../api/query/useVoteDetailQuery';
import { AdminMessage } from '../../components/AdminMessage';
import './css/VotePollDetailPage.css';

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const tagLocationToPercent = (value: number) =>
  `${clampPercent(value >= 0 && value <= 1 ? value * 100 : value)}%`;

const TAG_SHEET_SCROLL_DELAY_MS = 260;

const tagTypeLabel = {
  TEXT: '텍스트',
  PHOTO: '사진',
  VIDEO: '영상',
  UNKNOWN: '태그',
} as const;

export function VotePollDetailPage() {
  const { questionId = '', voteId = '' } = useParams();
  const navigate = useNavigate();
  const voteDetail = useVoteDetailQuery(voteId);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isTagSheetExpanded, setIsTagSheetExpanded] = useState(false);
  const [isTagPanelWide, setIsTagPanelWide] = useState(false);
  const tagItemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const tagSheetRef = useRef<HTMLElement | null>(null);
  const shouldDelayTagScrollRef = useRef(false);
  const isTagListOpen = isTagPanelWide || isTagSheetExpanded;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 960px)');
    const syncPanelLayout = () => setIsTagPanelWide(mediaQuery.matches);

    syncPanelLayout();
    mediaQuery.addEventListener('change', syncPanelLayout);

    return () => mediaQuery.removeEventListener('change', syncPanelLayout);
  }, []);

  useEffect(() => {
    if (!selectedTagId || !isTagListOpen) return;

    const delay = shouldDelayTagScrollRef.current ? TAG_SHEET_SCROLL_DELAY_MS : 0;
    const timeoutId = window.setTimeout(() => {
      tagItemRefs.current[selectedTagId]?.scrollIntoView({
        block: 'center',
      });
      shouldDelayTagScrollRef.current = false;
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [isTagListOpen, selectedTagId]);

  useEffect(() => {
    if (!isTagSheetExpanded || isTagPanelWide) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (tagSheetRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        (target.closest('.tag-location-dot') || target.closest('.sticker-tag-toggle-button'))
      ) {
        return;
      }

      shouldDelayTagScrollRef.current = false;
      setSelectedTagId(null);
      setIsTagSheetExpanded(false);
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);

    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [isTagPanelWide, isTagSheetExpanded]);

  const handleTagDotSelect = (tagId: string) => {
    if (selectedTagId === tagId) {
      setSelectedTagId(null);
      setIsTagSheetExpanded(false);
      return;
    }

    shouldDelayTagScrollRef.current = !isTagPanelWide && !isTagSheetExpanded;
    setIsTagSheetExpanded(true);
    setSelectedTagId(tagId);
  };

  const handleTagListSelect = (tagId: string) => {
    shouldDelayTagScrollRef.current = false;
    setSelectedTagId((current) => (current === tagId ? null : tagId));
  };

  const handleTagSheetToggle = () => {
    if (isTagPanelWide) return;

    if (isTagSheetExpanded) {
      setSelectedTagId(null);
    }
    setIsTagSheetExpanded((current) => !current);
  };

  if (voteDetail.isLoading) {
    return <div className="list-skeleton full-screen dark">상세 화면을 불러오는 중입니다.</div>;
  }

  const question = voteDetail.questions.find((item) => item.id === questionId);

  if (!voteDetail.vote || !question) {
    return (
      <section className="sticker-detail-screen">
        <AdminMessage tone="danger">항목을 찾을 수 없습니다.</AdminMessage>
      </section>
    );
  }

  const tags = question.tags ?? [];
  const imageRatio =
    Number.isFinite(question.imageRatio) && question.imageRatio > 0
      ? question.imageRatio
      : 1;
  const imageFrameStyle = {
    '--question-image-ratio': String(imageRatio),
  } as CSSProperties;

  return (
    <section className="sticker-detail-screen">
      <div className="sticker-image-frame" style={imageFrameStyle}>
        <div className="sticker-image-content">
          <img alt="" className="sticker-bg-image" src={question.imageUrl} />
          <div className="sticker-bg-overlay" />

          <div className="tag-dot-layer" aria-label="저장된 태그 위치">
            {tags.map((tag, index) => {
              const isSelected = tag.id === selectedTagId;
              return (
                <button
                  aria-label={`태그 위치 ${index + 1}`}
                  aria-pressed={isSelected}
                  className={`tag-location-dot${isSelected ? ' is-selected' : ''}`}
                  key={tag.id}
                  onClick={() => handleTagDotSelect(tag.id)}
                  style={{
                    left: tagLocationToPercent(tag.locationX),
                    top: tagLocationToPercent(tag.locationY),
                  }}
                  title={`태그 위치 ${index + 1}`}
                  type="button"
                />
              );
            })}
          </div>
        </div>
      </div>

      <header className="sticker-overlay-header">
        <button className="sticker-back-button" onClick={() => navigate(`/admin/category/${voteId}`)} type="button">
          <ChevronLeft />
          <span>목록</span>
        </button>
        <strong>{question.title}</strong>
        <button
          aria-expanded={isTagListOpen}
          aria-label={isTagListOpen ? '태그 목록 닫기' : '태그 목록 열기'}
          className={`sticker-tag-toggle-button${isTagListOpen ? ' is-active' : ''}`}
          onClick={handleTagSheetToggle}
          type="button"
        >
          <Tags aria-hidden="true" />
        </button>
      </header>

      <aside
        aria-label="태그 목록"
        className={`tag-bottom-sheet${isTagListOpen ? ' is-expanded' : ''}`}
        ref={tagSheetRef}
      >
        <button
          aria-expanded={isTagListOpen}
          className="tag-bottom-sheet-header"
          onClick={handleTagSheetToggle}
          type="button"
        >
          <span className="tag-bottom-sheet-handle" aria-hidden="true" />
          <span className="tag-bottom-sheet-summary">
            <strong>태그</strong>
            <span className="tag-bottom-sheet-count">{tags.length}개</span>
          </span>
        </button>
        {tags.length === 0 ? (
          <p className="tag-bottom-sheet-empty">등록된 태그가 없습니다.</p>
        ) : (
          <ul className="tag-list">
            {tags.map((tag, index) => {
              const isSelected = tag.id === selectedTagId;
              const label = tag.data?.trim() || `태그 ${index + 1}`;
              return (
                <li
                  key={tag.id}
                  ref={(element) => {
                    tagItemRefs.current[tag.id] = element;
                  }}
                >
                  <button
                    aria-pressed={isSelected}
                    className={`tag-list-button${isSelected ? ' is-selected' : ''}`}
                    onClick={() => handleTagListSelect(tag.id)}
                    type="button"
                  >
                    <span className="tag-list-index">{index + 1}</span>
                    <span className="tag-list-content">
                      <strong>{label}</strong>
                      <small>{tagTypeLabel[tag.type]}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </section>
  );
}
