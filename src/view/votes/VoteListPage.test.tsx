import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { VoteListPage } from './VoteListPage';

describe('VoteListPage', () => {
  it('renders mock votes and quick create controls', async () => {
    renderWithProviders(<VoteListPage />, { route: '/votes' });

    expect(await screen.findByText('봄 팝업 스토어 현장 투표')).toBeInTheDocument();
    expect(screen.getByLabelText('vote 검색')).toBeInTheDocument();
    expect(screen.getByText('빠른 vote 생성')).toBeInTheDocument();
  });
});
