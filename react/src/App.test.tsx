import React from 'react';
import { render } from '@testing-library/react'; // render wrapped in act() waits until ready
import App from './App';

test('renders learn react link', () => {
  const { debug, getByText } = render(<App />);
  debug();
  const linkElement = getByText(/instructions/i);
  expect(linkElement).toBeInTheDocument();
});
