import { useState } from 'react';
import './RouteForm.css';

function RouteForm({ onSubmit, status = 'idle' }) {
  const [formValues, setFormValues] = useState({
    pickup: '',
    dropoff: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formValues.pickup.trim() || !formValues.dropoff.trim()) {
      setErrorMessage('Please enter both pickup and drop-off addresses.');
      return;
    }

    setErrorMessage('');

    if (onSubmit) {
      onSubmit({
        origin: formValues.pickup.trim(),
        destination: formValues.dropoff.trim(),
      });
    }
  }

  return (
    <section className="route-form-card" aria-label="Route input">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pickup">Pickup</label>
          <input
            id="pickup"
            name="pickup"
            type="text"
            value={formValues.pickup}
            onChange={handleChange}
            placeholder="Enter pickup location"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dropoff">Drop-off</label>
          <input
            id="dropoff"
            name="dropoff"
            type="text"
            value={formValues.dropoff}
            onChange={handleChange}
            placeholder="Enter drop-off location"
          />
        </div>

        <button type="submit" disabled={status === 'submitting' || status === 'polling'}>
          {status === 'submitting' || status === 'polling' ? 'Loading...' : 'Submit'}
        </button>

        {errorMessage ? <p className="error-message" role="alert">{errorMessage}</p> : null}
      </form>
    </section>
  );
}

export default RouteForm;