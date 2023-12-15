import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // You may need to install this package

import BookmarkButton from '../../components/data-visualizer/BookmarkButton'; // Update the import path based on your project structure

const mockStore = configureStore();

describe('BookmarkButton component', () => {
  test('renders "Add" button by default', async () => {
    const store = mockStore({
      searchedData: {
        isBookmarked: false,
        selectedItems: [], // Provide any initial state required
      },
    });

    render(
      <Provider store={store}>
        <BookmarkButton />
      </Provider>
    );

    const addButton = screen.getByLabelText('Add to Bookmark');

    // Use waitFor to handle asynchronous content rendering
    await waitFor(() => {
      expect(addButton).toBeInTheDocument();
    });
  });

  test('renders "Remove" button when bookmarked', async () => {
    const store = mockStore({
      searchedData: {
        isBookmarked: true,
        selectedItems: [], // Provide any initial state required
      },
    });

    render(
      <Provider store={store}>
        <BookmarkButton />
      </Provider>
    );

    const removeButton = screen.getByLabelText('Remove Bookmark');

    // Use waitFor to handle asynchronous content rendering
    await waitFor(() => {
      expect(removeButton).toBeInTheDocument();
    });
  });

 
});
