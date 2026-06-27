import { useState } from 'react';
import FloatingInput from '../FloatingInput/FloatingInput';
import './RouteForm.css';

function RouteForm({ onSubmit, status = 'idle' }) {
  const [pickup, setPickup] = useState('');
  const [dropoffs, setDropoffs] = useState(['']); // 預設有一個 dropoff

  const [errorMessage, setErrorMessage] = useState('');

  function handlePickupChange(event) {
    setPickup(event.target.value);
  }

  function handleDropoffChange(index, event) {
    const newDropoffs = [...dropoffs];
    newDropoffs[index] = event.target.value;
    setDropoffs(newDropoffs);
  }

  function handleRemoveDropoff(index) {
    const newDropoffs = [...dropoffs];
    newDropoffs.splice(index, 1);
    setDropoffs(newDropoffs);
  }

  function handleSwap(dropoffIndex) {
    // 呢個 Swap 會同指定嘅 dropoff index 對調
    const currentPickup = pickup;
    setPickup(dropoffs[dropoffIndex]);
    
    const newDropoffs = [...dropoffs];
    newDropoffs[dropoffIndex] = currentPickup;
    setDropoffs(newDropoffs);
  }

  function handleAddDropoff() {
    setDropoffs([...dropoffs, '']);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const filledDropoffs = dropoffs.map(d => d.trim()).filter(Boolean);

    if (!pickup.trim() || filledDropoffs.length === 0) {
      setErrorMessage('Please enter both pickup and drop-off addresses.');
      return;
    }

    setErrorMessage('');

    if (onSubmit) {
      // API 目前只支援單一 Origin 同 Destination，所以就送第一個 dropoff 俾佢
      onSubmit({
        origin: pickup.trim(),
        destination: filledDropoffs[0],
      });
    }
  }

  return (
    <section className="route-form-card" aria-label="Route input">
      <form onSubmit={handleSubmit}>
        <div className="route-inputs-container">
          <FloatingInput
            id="pickup"
            value={pickup}
            onChange={handlePickupChange}
            showClearBtn={false}
            shortLabel="Pickup"
            longLabel="Pickup Address"
            style={{ marginBottom: '24px' }}
          />

          {dropoffs.map((dropoff, index) => {
            const isLastDropoff = index === dropoffs.length - 1;
            const dropoffId = `dropoff-${index}`;
            const totalInputs = 1 + dropoffs.length;
            const showRemove = totalInputs >= 3;

            return (
              <div key={dropoffId} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="swap-btn center-swap"
                  onClick={() => handleSwap(index)}
                  aria-label="Swap pickup and drop-off"
                >
                  &#x21C5;
                </button>

                <FloatingInput
                  id={dropoffId}
                  value={dropoff}
                  onChange={(e) => handleDropoffChange(index, e)}
                  onClear={() => handleRemoveDropoff(index)}
                  showClearBtn={showRemove}
                  shortLabel={`Drop-off ${index > 0 ? index + 1 : ''}`}
                  longLabel={`Drop-off Address ${index > 0 ? index + 1 : ''}`}
                  style={{ marginBottom: isLastDropoff ? 0 : '24px' }}
                />
              </div>
            );
          })}
        </div>

        <button 
          type="button" 
          className="add-dropoff-btn"
          onClick={handleAddDropoff}
          aria-label="Add another drop-off"
        >
          &#x002B; Add Stop
        </button>

        <button type="submit" disabled={status === 'submitting' || status === 'polling'}>
          {status === 'submitting' ? 'Submitting...' : status === 'polling' ? 'Calculating route...' : 'Submit'}
        </button>

        {errorMessage ? <p className="error-message" role="alert">{errorMessage}</p> : null}
      </form>
    </section>
  );
}

export default RouteForm;