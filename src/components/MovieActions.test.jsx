import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import MovieActions from './MovieActions';
import { useAuth } from '../auth/AuthContext';
import { getWishlist } from '../api/backend';

jest.mock('../auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../api/backend', () => ({
  putVote: jest.fn(),
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
  getWishlist: jest.fn(),
}));

describe('MovieActions', () => {
  let container;
  let root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    useAuth.mockReturnValue({ isLoggedIn: true, token: 'token-123' });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.clearAllMocks();
  });

  it('shows the movie as already saved when the wishlist contains it', async () => {
    getWishlist.mockResolvedValue({ items: [{ id: 42, title: 'Sample movie' }] });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MovieActions movieId={42} />
        </MemoryRouter>
      );
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(getWishlist).toHaveBeenCalledWith('token-123');
    expect(container.textContent).toContain('อยู่ในรายการที่อยากดูแล้ว');
  });
});
