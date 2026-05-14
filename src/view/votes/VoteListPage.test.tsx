import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { VoteListPage } from './VoteListPage';

describe('VoteListPage', () => {
  it('renders categories and create entry', async () => {
    renderWithProviders(<VoteListPage />, { route: '/admin' });

    expect(await screen.findByText('현장 테스트 투표')).toBeInTheDocument();
    expect(screen.getByText('투표 관리')).toBeInTheDocument();
    expect(screen.getByText('새로운 카테고리 만들기')).toBeInTheDocument();
  });
});
