import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoute, getRoute } from '../services/routeApi';

const INITIAL_STATE = {
  errorMessage: '',
  apiMode: process.env.REACT_APP_ROUTE_API_MODE || 'mock',
  route: null,
  status: 'idle',
  token: '',
  mockGetOutcome: process.env.REACT_APP_ROUTE_MOCK_GET_OUTCOME || process.env.REACT_APP_ROUTE_MOCK_OUTCOME || 'success',
  mockPostOutcome: process.env.REACT_APP_ROUTE_MOCK_POST_OUTCOME || process.env.REACT_APP_ROUTE_MOCK_OUTCOME || 'success',
};

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getApiMode(apiMode) {
  return apiMode || process.env.REACT_APP_ROUTE_API_MODE || 'mock';
}

function getMockPostOutcome(mockPostOutcome) {
  return mockPostOutcome || process.env.REACT_APP_ROUTE_MOCK_POST_OUTCOME || process.env.REACT_APP_ROUTE_MOCK_OUTCOME || 'success';
}

function getMockGetOutcome(mockGetOutcome) {
  return mockGetOutcome || process.env.REACT_APP_ROUTE_MOCK_GET_OUTCOME || process.env.REACT_APP_ROUTE_MOCK_OUTCOME || 'success';
}

export function useRouteRequest() {
  const mountedRef = useRef(true);
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updateState = useCallback((nextState) => {
    if (mountedRef.current) {
      setState((currentState) => ({
        ...currentState,
        ...nextState,
      }));
    }
  }, []);

  const submitRoute = useCallback(
    async ({ origin, destination, apiMode, mockPostOutcome, mockGetOutcome } = {}) => {
      const resolvedApiMode = getApiMode(apiMode);
      const resolvedMockPostOutcome = getMockPostOutcome(mockPostOutcome);
      const resolvedMockGetOutcome = getMockGetOutcome(mockGetOutcome);

      updateState({
        errorMessage: '',
        apiMode: resolvedApiMode,
        route: null,
        status: 'submitting',
        token: '',
        mockGetOutcome: resolvedMockGetOutcome,
        mockPostOutcome: resolvedMockPostOutcome,
      });

      try {
        const token = await createRoute({
          apiMode: resolvedApiMode,
          destination,
          mockScenario: resolvedMockPostOutcome,
          origin,
        });
        updateState({ status: 'polling', token });

        if (resolvedApiMode === 'mock') {
          const pollSequence =
            resolvedMockGetOutcome === 'failure'
              ? ['failure']
              : resolvedMockGetOutcome === '500'
                ? ['500']
                : ['inProgress', 'success'];

          for (const mockScenario of pollSequence) {
            const route = await getRoute(token, { apiMode: resolvedApiMode, mockScenario });

            if (route.status === 'in progress') {
              await wait(1000);
              continue;
            }

            if (route.status === 'success') {
              updateState({
                route,
                status: 'success',
              });
              return;
            }

            if (route.status === 'failure') {
              updateState({
                errorMessage: route.error || 'Route request failed.',
                status: 'failure',
              });
              return;
            }

            updateState({
              errorMessage: 'Unexpected route response.',
              status: 'error',
            });
            return;
          }

          return;
        }

        while (true) {
          const route = await getRoute(token, { apiMode: resolvedApiMode });

          if (route.status === 'in progress') {
            await wait(1000);
            continue;
          }

          if (route.status === 'success') {
            updateState({
              route,
              status: 'success',
            });
            return;
          }

          if (route.status === 'failure') {
            updateState({
              errorMessage: route.error || 'Route request failed.',
              status: 'failure',
            });
            return;
          }

          updateState({
            errorMessage: 'Unexpected route response.',
            status: 'error',
          });
          return;
        }
      } catch (error) {
        updateState({
          errorMessage: error.message || 'Request failed.',
          status: 'error',
        });
      }
    },
    [updateState],
  );

  return {
    apiMode: state.apiMode,
    errorMessage: state.errorMessage,
    mockGetOutcome: state.mockGetOutcome,
    mockPostOutcome: state.mockPostOutcome,
    route: state.route,
    status: state.status,
    submitRoute,
    token: state.token,
  };
}