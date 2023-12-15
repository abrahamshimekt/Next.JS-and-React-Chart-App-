
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SidebarToggleButton from './../../components/email-sender/EmailSenderSidebar';

describe('SidebarToggleButton component', () => {
  test('renders SidebarToggleButton component and triggers click event', () => {
    render(<SidebarToggleButton />);

    // Check if the button is rendered
    const toggleButton = screen.getByRole('button', { name: /Open sidebar/i });
    expect(toggleButton).toBeInTheDocument();

    // Trigger a click event on the button
    fireEvent.click(toggleButton);

    // Check if the expected data attributes are present
    expect(toggleButton).toHaveAttribute('data-drawer-target', 'sidebar-multi-level-sidebar');
    expect(toggleButton).toHaveAttribute('data-drawer-toggle', 'sidebar-multi-level-sidebar');
    expect(toggleButton).toHaveAttribute('aria-controls', 'sidebar-multi-level-sidebar');
  });
});
