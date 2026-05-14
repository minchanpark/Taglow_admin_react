import type { VoteStatus } from '../../../api/model';
import { AdminButton } from '../../../components/AdminButton';
import './css/VoteStatusControl.css';

type VoteStatusControlProps = {
  status: VoteStatus;
  isSaving: boolean;
  onChange(status: VoteStatus): void;
};

export function VoteStatusControl({
  isSaving,
  onChange,
  status,
}: VoteStatusControlProps) {
  return (
    <div className="status-control">
      <span>운영 상태</span>
      <div className="segmented">
        <AdminButton
          isLoading={isSaving && status !== 'PROGRESS'}
          onClick={() => onChange('PROGRESS')}
          variant={status === 'PROGRESS' ? 'primary' : 'secondary'}
        >
          PROGRESS
        </AdminButton>
        <AdminButton
          isLoading={isSaving && status !== 'END'}
          onClick={() => onChange('END')}
          variant={status === 'END' ? 'primary' : 'secondary'}
        >
          END
        </AdminButton>
      </div>
    </div>
  );
}
