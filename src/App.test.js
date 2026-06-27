import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the route planner shell', () => {
  render(<App />);
  const headings = screen.getAllByRole('heading', { name: /deliveryapp/i });
  expect(headings.length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: /route input/i })).toBeInTheDocument();
});
