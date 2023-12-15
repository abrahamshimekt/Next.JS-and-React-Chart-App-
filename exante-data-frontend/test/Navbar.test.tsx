import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './../components/Navbar';

describe('Navbar component', () => {
  it('renders without crashing', () => {
    render(<Navbar isSidebarOpen={false} setIsSidebarOpen={() => {}} />);

    // Check if the component renders without crashing
    const header = screen.getByTestId('navbar-header'); // Use an appropriate test ID
    expect(header).toBeInTheDocument();
  });

  it('toggles sidebar when button is clicked', () => {
    const setIsSidebarOpenMock = jest.fn();
    render(<Navbar isSidebarOpen={false} setIsSidebarOpen={setIsSidebarOpenMock} />);

    // Check if the button is present
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Simulate a button click
    fireEvent.click(button);

    // Check if the setIsSidebarOpen function is called with the correct value
    expect(setIsSidebarOpenMock).toHaveBeenCalledWith(true);
  });
});
