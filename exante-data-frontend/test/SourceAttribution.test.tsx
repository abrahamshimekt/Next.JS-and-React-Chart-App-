import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils'; // Import act for async testing
import { SourceAttrubution } from '../components/SourceAttribution'; // Adjust the path accordingly

test('renders SourceAttrubution component', async () => {
  // Mock state and state setters
  const mockLabel = 'Mock Label';
  const mockLink = 'http://mocklink.com';
  const setMockLabel = jest.fn();
  const setMockLink = jest.fn();

  render(
    <SourceAttrubution
      label={mockLabel}
      link={mockLink}
      setLink={setMockLink}
      setLabel={setMockLabel}
    />
  );

  // Find input elements
  const labelInput = screen.getByPlaceholderText('Enter your source label here...');
  const linkInput = screen.getByPlaceholderText('Enter your source link...');

  // Check if the inputs have the correct initial values
  expect(labelInput).toHaveValue(mockLabel);
  expect(linkInput).toHaveValue(mockLink);

  // Simulate user input and check if state setters are called
  const newLabel = 'New Label';
  const newLink = 'http://newlink.com';

  fireEvent.change(labelInput, { target: { value: newLabel } });
  fireEvent.change(linkInput, { target: { value: newLink } });

  await act(async () => {
    // Wait for state updates to take effect
  });

  // Check if state setters are called with the correct values
  expect(setMockLabel).toHaveBeenCalledWith(newLabel);
  expect(setMockLink).toHaveBeenCalledWith(newLink);
});
