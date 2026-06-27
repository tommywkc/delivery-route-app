import { renderHook, act, waitFor } from '@testing-library/react';
import { useRouteRequest } from './useRouteRequest';
import * as api from '../services/routeApi';

jest.mock('../services/routeApi');

describe('useRouteRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useRouteRequest());

    expect(result.current.status).toBe('idle');
    expect(result.current.errorMessage).toBe('');
    expect(result.current.route).toBeNull();
  });

  it('updates state successfully when API returns success', async () => {
    api.createRoute.mockResolvedValue('mock-token-123');
    api.getRoute.mockResolvedValue({
      status: 'success',
      total_distance: 100,
      total_time: 100,
      path: [['1', '2']],
    });

    const { result } = renderHook(() => useRouteRequest());

    act(() => {
      result.current.submitRoute({ origin: 'A', destination: 'B' });
    });

    // It should first set submitting/polling states
    expect(result.current.status).toBe('submitting');
    
    await waitFor(() => expect(result.current.status).toBe('success'));

    expect(result.current.route.total_distance).toBe(100);
  });

  it('updates state to failure when API returns failure status', async () => {
    api.createRoute.mockResolvedValue('mock-token-123');
    api.getRoute.mockResolvedValue({
      status: 'failure',
      error: 'Location not accessible by car',
    });

    const { result } = renderHook(() => useRouteRequest());

    act(() => {
      result.current.submitRoute({ origin: 'A', destination: 'B' });
    });

    await waitFor(() => expect(result.current.status).toBe('failure'));

    expect(result.current.errorMessage).toBe('Location not accessible by car');
  });

  it('updates state to error when createRoute API throws an error (e.g. 500)', async () => {
    api.createRoute.mockRejectedValue(new Error('Internal Server Error'));

    const { result } = renderHook(() => useRouteRequest());

    act(() => {
      result.current.submitRoute({ origin: 'A', destination: 'B' });
    });

    await waitFor(() => expect(result.current.status).toBe('error'));

    expect(result.current.errorMessage).toBe('Internal Server Error');
  });

  it('resets state when resetState is called', () => {
    const { result } = renderHook(() => useRouteRequest());

    act(() => {
      result.current.resetState();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.errorMessage).toBe('');
  });
});
