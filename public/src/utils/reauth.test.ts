import { ensureAuthenticated, resetAuthState } from './reauth';

const mockFetch = jest.fn();
globalThis.fetch = mockFetch;

const mockPopup = { closed: false };
const mockWindowOpen = jest.fn().mockReturnValue(mockPopup);

// Provide window.open for Node test environment (reauth.ts only accesses it at call time)
(globalThis as unknown as Record<string, unknown>).window = {
  open: mockWindowOpen,
  location: { origin: 'http://localhost' },
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  resetAuthState();
  mockPopup.closed = false;
  mockWindowOpen.mockReturnValue(mockPopup);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('ensureAuthenticated', () => {
  it('does nothing when session is valid', async () => {
    mockFetch.mockResolvedValue({ status: 200, ok: true });

    await ensureAuthenticated();

    expect(mockFetch).toHaveBeenCalledWith('/isValid');
  });

  it('skips /isValid check within TTL window', async () => {
    mockFetch.mockResolvedValue({ status: 200, ok: true });

    await ensureAuthenticated();
    await ensureAuthenticated();

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('rechecks after TTL expires', async () => {
    mockFetch.mockResolvedValue({ status: 200, ok: true });

    await ensureAuthenticated();
    await jest.advanceTimersByTimeAsync(31000);
    await ensureAuthenticated();

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('opens popup when session is invalid', async () => {
    mockFetch.mockResolvedValueOnce({ status: 419, ok: false });
    mockFetch.mockResolvedValueOnce({ status: 200, ok: true });

    const authPromise = ensureAuthenticated();
    await jest.advanceTimersByTimeAsync(0);

    mockPopup.closed = true;
    await jest.advanceTimersByTimeAsync(500);

    await authPromise;

    expect(mockWindowOpen).toHaveBeenCalledWith('/reauth', 'reauth', 'width=600,height=700');
  });

  it('deduplicates concurrent auth checks', async () => {
    mockFetch.mockResolvedValueOnce({ status: 419, ok: false });
    mockFetch.mockResolvedValueOnce({ status: 200, ok: true });

    const promise1 = ensureAuthenticated();
    const promise2 = ensureAuthenticated();
    await jest.advanceTimersByTimeAsync(0);

    expect(mockWindowOpen).toHaveBeenCalledTimes(1);

    mockPopup.closed = true;
    await jest.advanceTimersByTimeAsync(500);

    await Promise.all([promise1, promise2]);
  });

  it('rejects when popup is blocked', async () => {
    mockFetch.mockResolvedValueOnce({ status: 419, ok: false });
    mockWindowOpen.mockReturnValueOnce(null);

    await expect(ensureAuthenticated()).rejects.toThrow('Popup blocked');
  });

  it('rejects when reauth times out', async () => {
    mockFetch.mockResolvedValueOnce({ status: 419, ok: false });

    const authPromise = ensureAuthenticated();
    // Attach rejection handler before advancing timers to avoid unhandled rejection
    const expectation = expect(authPromise).rejects.toThrow('Re-authentication timed out');

    await jest.advanceTimersByTimeAsync(120000);

    await expectation;
  });

  it('rejects when session is still invalid after popup closes', async () => {
    mockFetch.mockResolvedValueOnce({ status: 419, ok: false });
    mockFetch.mockResolvedValueOnce({ status: 419, ok: false });

    const authPromise = ensureAuthenticated();
    const expectation = expect(authPromise).rejects.toThrow('Re-authentication failed');

    await jest.advanceTimersByTimeAsync(0);

    mockPopup.closed = true;
    await jest.advanceTimersByTimeAsync(500);

    await expectation;
  });
});
