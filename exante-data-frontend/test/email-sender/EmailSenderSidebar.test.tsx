import React from 'react';
import { render } from '@testing-library/react';
import EmailSenderSidebar from './../../components/email-sender/EmailSenderSidebar';

describe('EmailSenderSidebar Component', () => {
  test('renders menu items with correct text content', () => {
    const { getByText } = render(<EmailSenderSidebar />);
    
    const menuItem1 = getByText(/Menu Item 2.1/);
    const menuItem2 = getByText(/Menu Item 2.2/);
    
    expect(menuItem1).toBeInTheDocument();
    expect(menuItem2).toBeInTheDocument();
  });
});
