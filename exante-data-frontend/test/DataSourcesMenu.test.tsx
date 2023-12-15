import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DataSourcesMenu from './../components/DataSourcesMenu';

// Test the DataSourcesMenu component
describe('DataSourcesMenu', () => {
  test('renders DataSourcesMenu component', () => {
    render(<DataSourcesMenu />);
    
    // Assert that the "Data Feeds" button is present in the rendered component
    expect(screen.getByText('Data Feeds')).toBeInTheDocument();
  });

  test('toggles dropdown visibility on button click', async () => {
    render(<DataSourcesMenu />);
    
    // Click the button to toggle dropdown visibility
    fireEvent.click(screen.getByText('Data Feeds'));

    // Wait for dropdown to be rendered
    await waitFor(() => {
      // Assert that the content of the dropdown is present
      expect(screen.getByText('Exante')).toBeInTheDocument();
      expect(screen.getByText('Bloomberg')).toBeInTheDocument();
      expect(screen.getByText('Haver')).toBeInTheDocument();
      expect(screen.getByText('Macrobond')).toBeInTheDocument();
    });
  });

  test('toggles checkbox state on item click', () => {
    render(<DataSourcesMenu />);
    
    // Click an item to toggle its checkbox state
    fireEvent.click(screen.getByText('Exante'));

    // Assert that the checkbox state has changed
  });

  // Add more test cases based on the behavior of your component
});
