import { useState } from 'react';

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
    <section className="placeholder-card" aria-label="Route input">
      <h2>Route input</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="pickup">Pickup</label>
          <input
            id="pickup"
            name="pickup"
            type="text"
            value={formValues.pickup}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="dropoff">Drop-off</label>
          <input
            id="dropoff"
            name="dropoff"
            type="text"
            value={formValues.dropoff}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>

        {errorMessage ? <p role="alert">{errorMessage}</p> : null}
      </form>
    </section>
  );
}

export default RouteForm;