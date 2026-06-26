import { useState } from 'react';
import './RouteForm.css';

function RouteForm({ onSubmit, status = 'idle' }) {
  const [formValues, setFormValues] = useState({
    pickup: '',
    dropoff: '',
  });
  const [focusedField, setFocusedField] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleFocus(event) {
    setFocusedField(event.target.name);
  }

  function handleBlur() {
    setFocusedField(null);
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
        <div className="form-group floating-label-group">
          <input
            id="pickup"
            name="pickup"
            type="text"
            className="floating-input"
            value={formValues.pickup}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=" "
          />
          <label htmlFor="pickup" className="floating-label">
            {formValues.pickup || focusedField === 'pickup' ? 'Pickup' : 'Pickup Address'}
          </label>
        </div>

        <div className="form-group floating-label-group">
          <input
            id="dropoff"
            name="dropoff"
            type="text"
            className="floating-input"
            value={formValues.dropoff}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=" "
          />
          <label htmlFor="dropoff" className="floating-label">
            {formValues.dropoff || focusedField === 'dropoff' ? 'Drop-off' : 'Drop-off Address'}
          </label>
        </div>

        <button type="submit" disabled={status === 'submitting' || status === 'polling'}>
          {status === 'submitting' ? 'Sending request...' : status === 'polling' ? 'Finding route...' : 'Submit'}
        </button>

        {errorMessage ? <p className="error-message" role="alert">{errorMessage}</p> : null}
      </form>
    </section>
  );
}

export default RouteForm;