import { useEffect, useMemo, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getDrivingRouteCoordinates } from '../../services/mapboxRoute';

function parseRoutePath(route) {
  if (!route?.path?.length) {
    return [];
  }

  return route.path
    .map((point, index) => {
      const [latitude, longitude] = point;
      const parsedLatitude = Number(latitude);
      const parsedLongitude = Number(longitude);

      if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
        return null;
      }

      return {
        coordinates: [parsedLongitude, parsedLatitude],
        sequence: index + 1,
      };
    })
    .filter(Boolean);
}

function fitMapToRoute(mapboxglModule, map, points) {
  if (!points.length) {
    return;
  }

  if (points.length === 1) {
    map.setCenter(points[0].coordinates);
    map.setZoom(12);
    return;
  }

  const bounds = new mapboxglModule.LngLatBounds(points[0].coordinates, points[0].coordinates);

  points.forEach((point) => {
    bounds.extend(point.coordinates);
  });

  map.fitBounds(bounds, {
    padding: 56,
    duration: 0,
  });
}

function RouteMap({ route }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const mapboxRef = useRef(null);
  const markerRefs = useRef([]);
  const [mapReady, setMapReady] = useState(false);
  const routePoints = useMemo(() => parseRoutePath(route), [route]);
  const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    let cancelled = false;

    if (!accessToken || mapRef.current || !mapContainerRef.current) {
      return undefined;
    }

    import('mapbox-gl').then((module) => {
      if (cancelled) {
        return;
      }

      const mapboxglModule = module.default;
      mapboxRef.current = mapboxglModule;
      mapboxglModule.accessToken = accessToken;

      const map = new mapboxglModule.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [114.1, 22.3],
        zoom: 10,
      });

      map.addControl(new mapboxglModule.NavigationControl(), 'top-right');
      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      setMapReady(false);

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [accessToken]);

  useEffect(() => {
    const map = mapRef.current;
    const mapboxglModule = mapboxRef.current;

    if (!mapReady || !map || !mapboxglModule || !routePoints.length) {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      if (map?.getLayer('route-line')) {
        map.removeLayer('route-line');
      }
      if (map?.getSource('route-line')) {
        map.removeSource('route-line');
      }
      return;
    }

    let cancelled = false;

    const applyRouteLayer = async () => {
      let routeCoordinates = routePoints.map((point) => point.coordinates);

      if (routePoints.length > 1) {
        routeCoordinates = await getDrivingRouteCoordinates(routePoints, accessToken);
      }

      if (cancelled) {
        return;
      }

      if (!routeCoordinates.length) {
        routeCoordinates = routePoints.map((point) => point.coordinates);
      }

      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];

      if (map.getLayer('route-line')) {
        map.removeLayer('route-line');
      }

      if (map.getSource('route-line')) {
        map.removeSource('route-line');
      }

      map.addSource('route-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
          properties: {},
        },
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route-line',
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#111827',
          'line-width': 4,
        },
      });

      routePoints.forEach((point) => {
        const markerElement = document.createElement('div');
        markerElement.style.width = '24px';
        markerElement.style.height = '24px';
        markerElement.style.borderRadius = '999px';
        markerElement.style.background = '#111827';
        markerElement.style.color = '#ffffff';
        markerElement.style.fontSize = '12px';
        markerElement.style.fontWeight = '700';
        markerElement.style.lineHeight = '24px';
        markerElement.style.textAlign = 'center';
        markerElement.style.border = '1px solid #ffffff';
        markerElement.textContent = String(point.sequence);

        const marker = new mapboxglModule.Marker({ element: markerElement, anchor: 'center' })
          .setLngLat(point.coordinates)
          .addTo(map);

        markerRefs.current.push(marker);
      });

      fitMapToRoute(mapboxglModule, map, routePoints);
    };

    if (map.isStyleLoaded()) {
      applyRouteLayer();
      return undefined;
    }

    map.once('load', applyRouteLayer);

    return () => {
      cancelled = true;
      map.off('load', applyRouteLayer);
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      if (map.getLayer('route-line')) {
        map.removeLayer('route-line');
      }
      if (map.getSource('route-line')) {
        map.removeSource('route-line');
      }
    };
  }, [accessToken, mapReady, routePoints]);

  return (
    <div aria-label="Route map">
      <div
        ref={mapContainerRef}
        style={{ height: '420px', width: '100%' }}
      />
    </div>
  );
}

export default RouteMap;