import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import LoadingVan from './components/LoadingVan/LoadingVan';
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
      <>
        Total distance: {route.total_distance}<br />
        Total time: {timeString}
      </>
    );
  }

  return null;
}

function App() {
  const { errorMessage, route, status, submitRoute, resetState } = useRouteRequest();
  const [formKey, setFormKey] = useState(0); // Used to force remount of RouteForm
  const userMessage = getUserMessage(status, errorMessage, route);

  function handleReset() {
    resetState();
    setFormKey(prevKey => prevKey + 1);
  }

  // On Mobile: Only show map if status is success and route exists
  const isMobileMapVisible = status === 'success' && route;

  return (
    <div className="app-shell">
      <Header showBackBtn={isMobileMapVisible} onBack={handleReset} />
      <main className="main-content">
        <aside className={`left-panel ${isMobileMapVisible ? 'mobile-hidden' : ''}`}>
          <RouteForm key={formKey} onSubmit={submitRoute} onReset={handleReset} status={status} />
          
          {(status === 'submitting' || status === 'polling') && (
            <LoadingVan />
          )}

          {userMessage && status !== 'success' && (
            <section className="message-card" aria-live="polite" aria-label="Route message">
              <p role={status === 'failure' || status === 'error' ? 'alert' : 'status'} style={{ margin: 0 }}>
                {userMessage}
              </p>
            </section>
          )}
        </aside>

        <section 
          className={`map-section ${!isMobileMapVisible ? 'mobile-hidden' : ''}`} 
          aria-label="Route map"
        >
          {/* On desktop, keep standard h2 visually hidden. On mobile, we only see map now */}
          <h2>Map</h2>
          <RouteMap route={route} />

          {/* Render success message over the map (always anchored to bottom) */}
          {status === 'success' && route && (
            <section className="message-card" aria-live="polite" aria-label="Route message" style={{ margin: '16px', position: 'absolute', bottom: '24px', left: 0, right: 0, zIndex: 10, border: '1px solid #f97316' }}>
              <p role="status" style={{ margin: 0 }}>
                {userMessage}
              </p>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
