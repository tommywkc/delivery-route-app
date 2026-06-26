import './App.css';
import RouteForm from './components/RouteForm/RouteForm';
import { useRouteRequest } from './hooks/useRouteRequest';

function App() {
  const { errorMessage, route, status, submitRoute, token } = useRouteRequest();

  return (
    <main className="app-shell">
      <h1>Delivery route application</h1>
      <p>Skeleton is ready. Next step is the route form.</p>
      <RouteForm onSubmit={submitRoute} status={status} />
      <div className="placeholder-card">
        <h2>Status</h2>
        <p role="status" aria-live="polite">
          Status: {status}
        </p>
        {token ? <p>Token: {token}</p> : null}
        {errorMessage ? <p role="alert">{errorMessage}</p> : null}
        {route?.status === 'success' ? <p>Route ready.</p> : null}
      </div>
      <div className="placeholder-card">
        <h2>Map</h2>
        <p>Route map will render here.</p>
        {route?.path ? <p>Waypoints: {route.path.length}</p> : null}
      </div>
    </main>
  );
}

export default App;
