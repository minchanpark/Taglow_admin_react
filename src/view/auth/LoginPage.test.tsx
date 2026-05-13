import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders login form and blocks unsupported roles with safe message', async () => {
    renderWithProviders(<LoginPage />, { route: '/login' });

    await userEvent.clear(screen.getByLabelText('계정명'));
    await userEvent.type(screen.getByLabelText('계정명'), 'guest');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText('운영 콘솔 접근 권한이 없습니다.')).toBeInTheDocument();
  });

  it('does not block short login ids before submitting', async () => {
    renderWithProviders(<LoginPage />, { route: '/login' });

    await userEvent.clear(screen.getByLabelText('계정명'));
    await userEvent.type(screen.getByLabelText('계정명'), 'ab');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText('로그인되었습니다.')).toBeInTheDocument();
    expect(screen.queryByText('계정명은 3자 이상 입력해주세요.')).not.toBeInTheDocument();
  });
});
