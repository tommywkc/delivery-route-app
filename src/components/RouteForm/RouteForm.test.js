import { render, screen, fireEvent } from '@testing-library/react';
import RouteForm from './RouteForm';

describe('RouteForm', () => {
  it('renders correctly with initial inputs', () => {
    render(<RouteForm onSubmit={jest.fn()} onReset={jest.fn()} />);
    
    expect(screen.getByRole('textbox', { name: /pickup address/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /drop-off address/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', () => {
    render(<RouteForm onSubmit={jest.fn()} onReset={jest.fn()} />);
    
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitBtn);

    expect(screen.getByRole('alert')).toHaveTextContent('Please fill in all pickup, stop(s), and drop-off addresses.');
  });

  it('calls onSubmit with origin and destination when valid', () => {
    const handleSubmit = jest.fn();
    render(<RouteForm onSubmit={handleSubmit} onReset={jest.fn()} />);
    
    const pickupInput = screen.getByRole('textbox', { name: /pickup address/i });
    const dropoffInput = screen.getByRole('textbox', { name: /drop-off address/i });
    
    fireEvent.change(pickupInput, { target: { value: 'Hong Kong' } });
    fireEvent.change(dropoffInput, { target: { value: 'Kowloon' } });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      origin: 'Hong Kong',
      destination: 'Kowloon',
    });
  });

  it('adds a new stop when Add Stop button is clicked', () => {
    render(<RouteForm onSubmit={jest.fn()} onReset={jest.fn()} />);
    
    const addBtn = screen.getByRole('button', { name: /add another drop-off/i });
    fireEvent.click(addBtn);

    // After adding, we should have 1 Pickup, 1 Stop, and 1 Drop-off
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(3);
    
    // Check if the middle input is labeled "Stop Address"
    expect(screen.getByRole('textbox', { name: /stop address/i })).toBeInTheDocument();
  });
});
