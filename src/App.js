import './App.css';
import RouteForm from './components/RouteForm/RouteForm';
import RouteMap from './components/RouteMap/RouteMap';
import { useRouteRequest } from './hooks/useRouteRequest';

function App() {
  const { apiMode, errorMessage, mockGetOutcome, mockPostOutcome, route, status, submitRoute, token } = useRouteRequest();

  return (
    <main className="app-shell">
      <h1>Delivery route app</h1>
      <RouteForm onSubmit={submitRoute} status={status} />

      <section className="status-card" aria-label="Route status">
        <h2>Status</h2>
        <p role="status" aria-live="polite">
          Status: {status}
        </p>
        <p>Mode: {apiMode}</p>
        {token ? <p>Token: {token}</p> : null}
        {apiMode === 'mock' ? (
          <>
            <p>Mock POST outcome: {mockPostOutcome}</p>
            <p>Mock GET outcome: {mockGetOutcome}</p>
          </>
        ) : null}
        {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      </section>

      <section className="map-section">
        <h2>Map</h2>
        <RouteMap route={route} />
      </section>
    </main>
  );
}

export default App;
