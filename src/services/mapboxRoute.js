const MAPBOX_DIRECTIONS_BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving';

function buildWaypointString(points) {
  return points.map((point) => point.coordinates.join(',')).join(';');
}

export async function getDrivingRouteCoordinates(points, accessToken) {
  if (!points.length) {
    return [];
  }

  const waypointString = buildWaypointString(points);
  const url = new URL(`${MAPBOX_DIRECTIONS_BASE_URL}/${waypointString}`);

  url.searchParams.set('access_token', accessToken);
  url.searchParams.set('geometries', 'geojson');
  url.searchParams.set('overview', 'full');
  url.searchParams.set('alternatives', 'false');
  url.searchParams.set('steps', 'false');

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error('Failed to load route line.');
  }

  const data = await response.json();
  const coordinates = data?.routes?.[0]?.geometry?.coordinates;

  return Array.isArray(coordinates) ? coordinates : [];
}