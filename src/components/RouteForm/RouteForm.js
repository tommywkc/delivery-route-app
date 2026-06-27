import { useState } from 'react';
import FloatingInput from '../FloatingInput/FloatingInput';
import './RouteForm.css';

function RouteForm({ onSubmit, status = 'idle' }) {
  const [pickup, setPickup] = useState('');
  const [dropoffs, setDropoffs] = useState(['']); // Default to one dropoff

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
    if (dropoffIndex === 0) {
      // Swap the first dropoff with pickup
      const currentPickup = pickup;
      setPickup(dropoffs[0]);
      
      const newDropoffs = [...dropoffs];
      newDropoffs[0] = currentPickup;
      setDropoffs(newDropoffs);
    } else {
      // Swap other dropoffs with the one immediately above
      const newDropoffs = [...dropoffs];
      const temp = newDropoffs[dropoffIndex - 1];
      newDropoffs[dropoffIndex - 1] = newDropoffs[dropoffIndex];
      newDropoffs[dropoffIndex] = temp;
      setDropoffs(newDropoffs);
    }
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
      // API currently only supports single origin and destination
      // Submit the first filled dropoff for now
      onSubmit({
        origin: pickup.trim(),
        destination: filledDropoffs[0],
      });
    }
  }

  return (
    <section className="route-form-card" aria-label="Route input">
      <form onSubmit={handleSubmit}>
        <div className="route-inputs-container" style={{ marginBottom: '24px' }}>
          
          <div className="input-row">
            <div className="timeline-col">
              <div className="timeline-number">1</div>
              <div className="timeline-dotted-line"></div>
            </div>
            <div className="input-col">
              <FloatingInput
                id="pickup"
                value={pickup}
                onChange={handlePickupChange}
                showClearBtn={false}
                shortLabel="Pickup"
                longLabel="Pickup Address"
              />
            </div>
          </div>

          {dropoffs.map((dropoff, index) => {
            const isLastDropoff = index === dropoffs.length - 1;
            const dropoffId = `dropoff-${index}`;
            const totalInputs = 1 + dropoffs.length;
            const showRemove = totalInputs >= 3;

            return (
              <div key={dropoffId} className="input-row">
                <div className="timeline-col">
                  <div className="timeline-number">{index + 2}</div>
                  {!isLastDropoff && <div className="timeline-dotted-line"></div>}
                </div>
                <div className="input-col">
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
                    shortLabel={isLastDropoff ? 'Drop-off' : 'Stop'}
                    longLabel={isLastDropoff ? 'Drop-off Address' : 'Stop Address'}
                  />
                </div>
              </div>
            );
          })}

          <button 
            type="button" 
            className="add-dropoff-btn"
            onClick={handleAddDropoff}
            aria-label="Add another drop-off"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <button type="submit" disabled={status === 'submitting' || status === 'polling'} style={{ marginTop: '24px' }}>
          {status === 'submitting' ? 'Submitting...' : status === 'polling' ? 'Calculating route...' : 'Submit'}
        </button>

        {errorMessage ? <p className="error-message" role="alert">{errorMessage}</p> : null}
      </form>
    </section>
  );
}

export default RouteForm;