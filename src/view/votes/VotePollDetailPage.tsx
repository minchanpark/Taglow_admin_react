import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, Image as ImageIcon, Play, Type, Video, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useVoteDetailController } from '../../api/controller/useVoteDetailController';
import { AdminMessage } from '../../components/AdminMessage';
import { TagSticker } from './components/TagSticker';

type StickerKind = 'text' | 'image' | 'video';

const stickerCopy: Record<StickerKind, { label: string; quote: string }> = {
  text: {
    label: '텍스트 태그',
    quote: '가장 먼저 떠오른 순간을 짧게 남긴 태그입니다.',
  },
  image: {
    label: '이미지 태그',
    quote: '참여자가 현장에서 고른 이미지 반응입니다.',
  },
  video: {
    label: '비디오 태그',
    quote: '플레이어 화면에서 강조해서 보여줄 반응입니다.',
  },
};

export function VotePollDetailPage() {
  const { questionId = '', voteId = '' } = useParams();
  const navigate = useNavigate();
  const controller = useVoteDetailController(voteId);
  const [selected, setSelected] = useState<StickerKind>();

  if (controller.isLoading) {
    return <div className="list-skeleton full-screen dark">상세 화면을 불러오는 중입니다.</div>;
  }

  const question = controller.questions.find((item) => item.id === questionId);

  if (!controller.vote || !question) {
    return (
      <section className="sticker-detail-screen">
        <AdminMessage tone="danger">항목을 찾을 수 없습니다.</AdminMessage>
      </section>
    );
  }

  const selectedCopy = selected ? stickerCopy[selected] : undefined;

  return (
    <section className="sticker-detail-screen">
      <img alt="" className="sticker-bg-image" src={question.imageUrl} />
      <div className="sticker-bg-overlay" />

      <header className="sticker-overlay-header">
        <button className="sticker-back-button" onClick={() => navigate(`/admin/category/${voteId}`)} type="button">
          <ChevronLeft />
          <span>목록</span>
        </button>
        <strong>{question.title}</strong>
        <Link className="sticker-share-pill" to={`/admin/category/${voteId}/share/${questionId}`}>
          공유
        </Link>
      </header>

      <TagSticker
        label="텍스트 태그 보기"
        onClick={() => setSelected('text')}
        style={{ left: '18%', top: '28%', transform: 'rotate(-12deg)' }}
      >
        <span>T</span>
      </TagSticker>
      <TagSticker
        className="image-sticker"
        label="이미지 태그 보기"
        onClick={() => setSelected('image')}
        style={{ right: '18%', top: '46%', transform: 'rotate(8deg)' }}
      >
        <img alt="" src={question.imageUrl} />
      </TagSticker>
      <TagSticker
        className="video-sticker"
        label="비디오 태그 보기"
        onClick={() => setSelected('video')}
        style={{ left: '35%', bottom: '18%', transform: 'rotate(5deg)' }}
      >
        <img alt="" src={question.imageUrl} />
        <span>V</span>
      </TagSticker>

      <AnimatePresence>
        {selected && selectedCopy ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="tag-modal-backdrop"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setSelected(undefined)}
          >
            <motion.article
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="tag-modal-card"
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              onClick={(event) => event.stopPropagation()}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                aria-label="닫기"
                className="modal-close-button"
                onClick={() => setSelected(undefined)}
                type="button"
              >
                <X />
              </button>
              <div className="tag-modal-icon">
                {selected === 'text' ? <Type /> : selected === 'image' ? <ImageIcon /> : <Video />}
              </div>
              {selected !== 'text' ? (
                <div className="tag-modal-media">
                  <img alt="" src={question.imageUrl} />
                  {selected === 'video' ? (
                    <span className="video-play-badge">
                      <Play fill="currentColor" />
                    </span>
                  ) : null}
                </div>
              ) : null}
              <p>“{question.detail || selectedCopy.quote}”</p>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
