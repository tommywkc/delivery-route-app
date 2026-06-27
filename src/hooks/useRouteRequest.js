import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoute, getRoute } from '../services/routeApi';

const INITIAL_STATE = {
  errorMessage: '',
  apiMode: process.env.REACT_APP_ROUTE_API_MODE || 'mock',
  route: null,
  status: 'idle',
  token: '',
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
  return mockPostOutcome || process.env.REACT_APP_ROUTE_MOCK_POST_OUTCOME || 'success';
}

function getMockGetOutcome(mockGetOutcome) {
  return mockGetOutcome || process.env.REACT_APP_ROUTE_MOCK_GET_OUTCOME || 'success';
}

function logRouteDebug(message, details) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[route-debug]', message, details || '');
  }
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

  const resetState = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const submitRoute = useCallback(
    async ({ origin, destination, apiMode, mockPostOutcome, mockGetOutcome } = {}) => {
      const resolvedApiMode = getApiMode(apiMode);
      const resolvedMockPostOutcome = getMockPostOutcome(mockPostOutcome);
      const resolvedMockGetOutcome = getMockGetOutcome(mockGetOutcome);

      logRouteDebug('submitRoute:start', {
        apiMode: resolvedApiMode,
        mockGetOutcome: resolvedMockGetOutcome,
        mockPostOutcome: resolvedMockPostOutcome,
      });

      updateState({
        errorMessage: '',
        apiMode: resolvedApiMode,
        route: null,
        status: 'submitting',
        token: '',
      });

      logRouteDebug('status:submitting', { apiMode: resolvedApiMode });

      try {
        const token = await createRoute({
          apiMode: resolvedApiMode,
          destination,
          mockScenario: resolvedMockPostOutcome,
          origin,
        });
        updateState({ status: 'polling', token });
        logRouteDebug('status:polling', { apiMode: resolvedApiMode, token });

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
              logRouteDebug('status:in-progress', { apiMode: resolvedApiMode, token });
              await wait(1000);
              continue;
            }

            if (route.status === 'success') {
              logRouteDebug('status:success', { apiMode: resolvedApiMode, token });
              updateState({
                route,
                status: 'success',
              });
              return;
            }

            if (route.status === 'failure') {
              logRouteDebug('status:failure', {
                apiMode: resolvedApiMode,
                error: route.error,
                token,
              });
              updateState({
                errorMessage: route.error || 'Route request failed.',
                status: 'failure',
              });
              return;
            }

            logRouteDebug('status:unexpected-response', { apiMode: resolvedApiMode, route, token });
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
            logRouteDebug('status:in-progress', { apiMode: resolvedApiMode, token });
            await wait(1000);
            continue;
          }

          if (route.status === 'success') {
            logRouteDebug('status:success', { apiMode: resolvedApiMode, token });
            updateState({
              route,
              status: 'success',
            });
            return;
          }

          if (route.status === 'failure') {
            logRouteDebug('status:failure', {
              apiMode: resolvedApiMode,
              error: route.error,
              token,
            });
            updateState({
              errorMessage: route.error || 'Route request failed.',
              status: 'failure',
            });
            return;
          }

          logRouteDebug('status:unexpected-response', { apiMode: resolvedApiMode, route, token });
          updateState({
            errorMessage: 'Unexpected route response.',
            status: 'error',
          });
          return;
        }
      } catch (error) {
        logRouteDebug('status:error', {
          apiMode: resolvedApiMode,
          error: error.message || 'Request failed.',
        });
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
    route: state.route,
    status: state.status,
    submitRoute,
    resetState,
    token: state.token,
  };
}