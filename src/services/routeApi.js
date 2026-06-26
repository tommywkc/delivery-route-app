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

function logResponseSummary(stage, response, summary) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[route-api]', stage, {
      ok: response.ok,
      status: response.status,
      summary,
    });
  }
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
    logResponseSummary('POST /route', response, { error: 'request failed' });
    throw new Error(await readErrorMessage(response));
  }

  const data = await response.json();

  logResponseSummary('POST /route', response, {
    token: data.token,
  });

  return data.token;
}

export async function getRoute(token, { apiMode, mockScenario = 'success' } = {}) {
  const response = await fetch(getRouteUrl(token, apiMode, mockScenario));

  if (!response.ok) {
    logResponseSummary('GET /route', response, { error: 'request failed', token });
    throw new Error(await readErrorMessage(response));
  }

  const data = await response.json();

  logResponseSummary('GET /route', response, {
    status: data.status,
    token,
    total_distance: data.total_distance,
    total_time: data.total_time,
    pathPoints: Array.isArray(data.path) ? data.path.length : 0,
  });

  return data;
}