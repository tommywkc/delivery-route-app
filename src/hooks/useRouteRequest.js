import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoute, getRoute } from '../services/routeApi';

const INITIAL_STATE = {
  errorMessage: '',
  route: null,
  status: 'idle',
  token: '',
};

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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
    async ({ origin, destination, mockOutcome = 'success' }) => {
      updateState({
        errorMessage: '',
        route: null,
        status: 'submitting',
        token: '',
      });

      try {
        const token = await createRoute({ origin, destination });
        updateState({ status: 'polling', token });

        const pollSequence =
          mockOutcome === 'failure'
            ? ['failure']
            : mockOutcome === 'error'
              ? ['error']
              : ['inProgress', 'success'];

        for (const mockScenario of pollSequence) {
          const route = await getRoute(token, { mockScenario });

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
    errorMessage: state.errorMessage,
    route: state.route,
    status: state.status,
    submitRoute,
    token: state.token,
  };
}