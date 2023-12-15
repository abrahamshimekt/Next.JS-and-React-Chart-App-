import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailChips from './../../components/email-sender/EmailChips';

describe('EmailChips component', () => {
  test('renders EmailChips component with provided email and calls removeFromEmails on close button click', () => {
    const email = 'test@example.com';
    const index = 0;
    const removeFromEmailsMock = jest.fn();

    render(
      <EmailChips email={email} index={index} removeFromEmails={removeFromEmailsMock} />
    );

    // Check if the email is rendered correctly
    const emailElement = screen.getByText(email);
    expect(emailElement).toBeInTheDocument();

    // Check if the remove button is rendered
    const removeButton = screen.getByTestId('remove-button');
    expect(removeButton).toBeInTheDocument();

    // Simulate click on the remove button
    fireEvent.click(removeButton);

    // Ensure that removeFromEmailsMock was called with the correct index
    expect(removeFromEmailsMock).toHaveBeenCalledWith(index);
  });
});
