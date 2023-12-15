
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Searchbar from '../../components/commons/Searchbar'; // Update the path accordingly


const mockStore = configureStore([]);

describe('Searchbar component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      category: {
        loading: false,
        categories: [{ id: 1, name: 'Category1', isUploaded: false }],
        error: null,
      },
      searchedData: {
        selectedItems: [],
      },
      fundData: {
        loading: false,
      },
    });
  });

  test('renders Searchbar component', () => {
    render(
      <Provider store={store}>
        <Searchbar />
      </Provider>
    );

    // Assert that some part of the Searchbar component is rendered
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    // Add more assertions based on your component's structure
  });

  test('handles multi-select search', async () => {
    render(
      <Provider store={store}>
        <Searchbar />
      </Provider>
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'SearchQuery' } });

    await waitFor(() => {
      // Add assertions based on the expected behavior after the search
    });
  });

  // Add more tests based on your component's functionality
});