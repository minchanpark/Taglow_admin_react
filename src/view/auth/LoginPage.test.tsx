import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('renders login form and blocks unsupported roles with safe message', async () => {
    renderWithProviders(<LoginPage />, { route: '/login' });

    await userEvent.clear(screen.getByLabelText('계정명'));
    await userEvent.type(screen.getByLabelText('계정명'), 'guest');
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText('운영 콘솔 접근 권한이 없습니다.')).toBeInTheDocument();
  });
});
