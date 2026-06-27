import { createRoute, getRoute } from './routeApi';

describe('routeApi Service', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createRoute', () => {
    it('returns a token when the POST request is successful', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'mock-token-123' }),
      });

      const token = await createRoute({ origin: 'Point A', destination: 'Point B', apiMode: 'real' });
      
      expect(token).toBe('mock-token-123');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/route'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ origin: 'Point A', destination: 'Point B' }),
        })
      );
    });

    it('throws an error when the POST request fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Internal Server Error',
      });

      await expect(
        createRoute({ origin: 'Point A', destination: 'Point B', apiMode: 'real' })
      ).rejects.toThrow('Internal Server Error');
    });
  });

  describe('getRoute', () => {
    it('returns route data when the GET request is successful', async () => {
      const mockResponse = {
        status: 'success',
        path: [['22.1', '114.1']],
        total_distance: 20000,
        total_time: 1800,
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const data = await getRoute('mock-token-123', { apiMode: 'real' });
      
      expect(data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/route/mock-token-123'));
    });

    it('throws an error when the GET request fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Not Found',
      });

      await expect(getRoute('mock-token-123', { apiMode: 'real' })).rejects.toThrow('Not Found');
    });
  });
});
