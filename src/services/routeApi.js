const API_BASE_URL = 'https://sg-mock-api.lalamove.com';
const DEFAULT_API_MODE = process.env.REACT_APP_ROUTE_API_MODE || 'mock';

const MOCK_ROUTE_ENDPOINTS = {
  500: '/mock/route/500',
  failure: '/mock/route/failure',
  inProgress: '/mock/route/inprogress',
  success: '/mock/route/success',
};

async function readErrorMessage(response) {
  const responseText = await response.text();

  return responseText.trim() || 'Request failed.';
}

function getApiMode(apiMode) {
  return apiMode || DEFAULT_API_MODE;
}

function getCreateRouteUrl(apiMode, mockScenario) {
  if (getApiMode(apiMode) === 'real') {
    return `${API_BASE_URL}/route`;
  }

  return `${API_BASE_URL}${mockScenario === '500' ? MOCK_ROUTE_ENDPOINTS[500] : MOCK_ROUTE_ENDPOINTS.success}`;
}

function getRouteUrl(token, apiMode, mockScenario) {
  if (getApiMode(apiMode) === 'real') {
    return `${API_BASE_URL}/route/${token}`;
  }

  return `${API_BASE_URL}${MOCK_ROUTE_ENDPOINTS[mockScenario] || MOCK_ROUTE_ENDPOINTS.success}`;
}

export async function createRoute({ origin, destination, apiMode, mockScenario = 'success' }) {
  const response = await fetch(getCreateRouteUrl(apiMode, mockScenario), {
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

export async function getRoute(token, { apiMode, mockScenario = 'success' } = {}) {
  const response = await fetch(getRouteUrl(token, apiMode, mockScenario));

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}