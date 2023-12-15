import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TemplateFiltering from './../../components/email-sender/TemplateFiltering';

describe('TemplateFiltering Component', () => {
  test('renders TemplateFiltering component correctly', () => {
    const { getByText } = render(<TemplateFiltering />);

    // Assert that the component renders correctly
    expect(getByText('From')).toBeInTheDocument();
    expect(getByText('To')).toBeInTheDocument();
    expect(getByText('Type :')).toBeInTheDocument();
  });

  test('select options trigger change correctly', () => {
    const { getByLabelText } = render(<TemplateFiltering />);

    // Find the input elements by their associated labels using getByLabelText
    const fromInput = getByLabelText('From') as HTMLInputElement;
    const toInput = getByLabelText('To') as HTMLInputElement;

    // Simulate user input for the 'From' input
    fireEvent.change(fromInput, { target: { value: '2024-03-01' } });

    // Simulate user input for the 'To' input
    fireEvent.change(toInput, { target: { value: '2024-03-15' } });

    // Add additional test logic for selecting options in the dropdowns if needed

    // Assert that the inputs have been updated with the correct values
    expect(fromInput.value).toBe('2024-03-01');
    expect(toInput.value).toBe('2024-03-15');
  });
});