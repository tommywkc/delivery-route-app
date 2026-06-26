import './App.css';
import RouteForm from './components/RouteForm/RouteForm';

function App() {
  return (
    <main className="app-shell">
      <h1>Delivery route challenge</h1>
      <p>Skeleton is ready. Next step is the route form.</p>
      <RouteForm />
      <div className="placeholder-card">
        <h2>Status</h2>
        <p>Request state will appear here.</p>
      </div>
      <div className="placeholder-card">
        <h2>Map</h2>
        <p>Route map will render here.</p>
      </div>
    </main>
  );
}

export default App;
