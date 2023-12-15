import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Importing the extended matchers
import Custom404 from '../../components/commons/404page';

test('renders 404 page correctly', () => {
  render(<Custom404 />);

  // Assert text content
  expect(screen.getByText(/404 - Page Not Found!/i)).toBeInTheDocument();
  expect(screen.getByText(/The page you are looking for does not exist./i)).toBeInTheDocument();

  // Assert link
  const linkElement = screen.getByRole('link', { name: /go back to home/i });
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveAttribute('href', '/');
});

// Add more test cases as needed
