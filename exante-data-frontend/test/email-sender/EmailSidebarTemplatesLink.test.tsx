import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import EmailSidebarTemplatesLink from './../../components/email-sender/EmailSidebarTemplatesLink';

describe('EmailSidebarTemplatesLink Component', () => {
  test('toggles template rendering on click', () => {
    const { getByText } = render(<EmailSidebarTemplatesLink />);
    
    const link = getByText('Templates');
    
    fireEvent.click(link);
    
    expect(link).toHaveTextContent('Templates'); // Initial state
    fireEvent.click(link);
    expect(link).toHaveTextContent('Templates'); // Toggled state
  });
});
