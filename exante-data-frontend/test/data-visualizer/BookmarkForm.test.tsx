import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; 

import BookmarkForm from '../../components/data-visualizer/BookmarkForm'; 

const mockStore = configureStore();

describe('BookmarkForm component', () => {
  test('renders BookmarkForm component', async () => {
    const store = mockStore({
      searchedData: {
        isBookmarked: false,
        selectedItems: [],
      },
    });

    render(
      <Provider store={store}>
        <BookmarkForm />
      </Provider>
    );

    // You can customize these assertions based on your actual UI
    expect(screen.getByText('Enter bookmark name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter data name')).toBeInTheDocument();
    expect(screen.getByText('Add to Bookmark')).toBeInTheDocument();
  });

  test('handles adding bookmark', async () => {
    const store = mockStore({
      searchedData: {
        isBookmarked: false,
        selectedItems: [],
      },
    });

    render(
      <Provider store={store}>
        <BookmarkForm />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter data name'), {
      target: { value: 'NewBookmark' },
    });

    fireEvent.click(screen.getByText('Add to Bookmark'));

    // Use waitFor to handle asynchronous content rendering
    await waitFor(() => {
      expect(store.getActions()).toEqual([
        {
          type: 'searchedData/setIsBookmarked',
          payload: true,
        },
      ]);
    });
  });

  // Add more tests as needed
});
