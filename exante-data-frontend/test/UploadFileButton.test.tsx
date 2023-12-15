import React from 'react';
import { render, screen } from '@testing-library/react';
import UploadFileButton from '../components/UploadFileButton'; // Adjust the path accordingly

// Mock the Modal component to avoid side effects
jest.mock('', () => ({
  ...jest.requireActual('/Users/tadaelshewaregagebre/Desktop/exante-data-frontend/components/commons/Modal.tsx'),
  Open: jest.fn(),
  Window: jest.fn(({ children }) => children),
}));

test('renders UploadFileButton component', () => {
  render(<UploadFileButton />);

  // Your test assertions...
  // Now, the `screen` object has the getByText function
  const uploadButton = screen.getByText('Upload File');
  expect(uploadButton).toBeInTheDocument();

  // You can add more assertions based on your component's behavior
});
