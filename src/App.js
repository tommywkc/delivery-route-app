import './App.css';
import Header from './components/Header/Header';
import RouteForm from './components/RouteForm/RouteForm';
import RouteMap from './components/RouteMap/RouteMap';
import { useRouteRequest } from './hooks/useRouteRequest';

function getUserMessage(status, errorMessage, route) {
  if (status === 'failure' || status === 'error') {
    return errorMessage || 'Route request failed.';
  }

  if (status === 'success' && route) {
    const hours = Math.floor(route.total_time / 3600);
    const minutes = Math.floor((route.total_time % 3600) / 60);
    const timeString = hours > 0 ? `${hours}hr ${minutes}min` : `${minutes}min`;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <strong>Total distance: {route.total_distance}</strong>
        <strong>Total time: {timeString}</strong>
      </div>
    );
  }

  return null;
}

function App() {
  const { errorMessage, route, status, submitRoute } = useRouteRequest();
  const userMessage = getUserMessage(status, errorMessage, route);

  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <aside className="left-panel">
          <RouteForm onSubmit={submitRoute} status={status} />
          
          {userMessage && (
            <section className="message-card" aria-live="polite" aria-label="Route message">
              <p role={status === 'failure' || status === 'error' ? 'alert' : 'status'} style={{ margin: 0 }}>
                {userMessage}
              </p>
            </section>
          )}
        </aside>

        <section className="map-section">
          <h2>Map</h2>
          {route ? null : <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#6b7280'}}>No route yet.</div>}
          <RouteMap route={route} />
        </section>
      </main>
    </div>
  );
}

export default App;
