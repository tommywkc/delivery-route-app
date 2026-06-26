import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the route planner shell', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /delivery route app/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /route input/i })).toBeInTheDocument();
});
