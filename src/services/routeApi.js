const API_BASE_URL = 'https://sg-mock-api.lalamove.com';

async function readErrorMessage(response) {
  const responseText = await response.text();

  return responseText.trim() || 'Request failed.';
}

export async function createRoute({ origin, destination }) {
  const response = await fetch(`${API_BASE_URL}/route`, {
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

export async function getRoute(token) {
  const response = await fetch(`${API_BASE_URL}/route/${token}`);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}