const API_BASE_URL = 'https://sg-mock-api.lalamove.com';

const MOCK_ROUTE_ENDPOINTS = {
  error: '/mock/route/500',
  failure: '/mock/route/failure',
  inProgress: '/mock/route/inprogress',
  success: '/mock/route/success',
};

async function readErrorMessage(response) {
  const responseText = await response.text();

  return responseText.trim() || 'Request failed.';
}

export async function createRoute({ origin, destination, mockScenario = 'success' }) {
  const response = await fetch(`${API_BASE_URL}${MOCK_ROUTE_ENDPOINTS[mockScenario] || MOCK_ROUTE_ENDPOINTS.success}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ origin, destination }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data = await response.json();

  return data.token;
}

export async function getRoute(token, { mockScenario = 'success' } = {}) {
  void token;

  const response = await fetch(`${API_BASE_URL}${MOCK_ROUTE_ENDPOINTS[mockScenario] || MOCK_ROUTE_ENDPOINTS.success}`);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}