import './App.css';
import RouteForm from './components/RouteForm/RouteForm';
import RouteMap from './components/RouteMap/RouteMap';
import { useRouteRequest } from './hooks/useRouteRequest';

function getUserMessage(status, errorMessage, route) {
  if (status === 'submitting' || status === 'polling') {
    return 'Loading route...';
  }

  if (status === 'failure' || status === 'error') {
    return errorMessage || 'Route request failed.';
  }

  if (status === 'success' && route) {
    return 'Route loaded successfully.';
  }

  return 'Enter pickup and drop-off to see the route.';
}

function App() {
  const { errorMessage, route, status, submitRoute } = useRouteRequest();
  const userMessage = getUserMessage(status, errorMessage, route);

  return (
    <main className="app-shell">
      <h1>Delivery route app</h1>
      <RouteForm onSubmit={submitRoute} status={status} />

      <section className="message-card" aria-live="polite" aria-label="Route message">
        <p role={status === 'failure' || status === 'error' ? 'alert' : 'status'}>{userMessage}</p>
      </section>

      <section className="map-section">
        <h2>Map</h2>
        {route ? null : <p>No route yet.</p>}
        <RouteMap route={route} />
      </section>
    </main>
  );
}

export default App;
