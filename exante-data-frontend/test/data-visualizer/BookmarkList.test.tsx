import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import BookmarkList from '../../components/data-visualizer/BookmarkList'; 

const mockStore = configureStore();

describe('BookmarkList component', () => {
  test('renders BookmarkList component with empty bookmarks', async () => {
    const store = mockStore({
      searchedData: {
        isBookmarked: false,
        selectedItems: [],
      },
    });

    render(
      <Provider store={store}>
        <BookmarkList />
      </Provider>
    );

    // Customize these assertions based on your actual UI
    expect(screen.getByText('All Bookmarks')).toBeInTheDocument();
    expect(screen.queryByText('Bookmarks')).toBeNull(); // Assuming no bookmarks are present initially
  });

  test('renders BookmarkList component with bookmarks', async () => {
    const store = mockStore({
      searchedData: {
        isBookmarked: false,
        selectedItems: [],
      },
    });

    // Assume you have some bookmarks in the local storage
    localStorage.setItem(
      'exante_bookmarks',
      JSON.stringify({
        "someConcatenatedNames": {
          bookmarkName: "SampleBookmark",
          datasetNames: ["Dataset1", "Dataset2"],
        },
      })
    );

    render(
      <Provider store={store}>
        <BookmarkList />
      </Provider>
    );

    // Customize these assertions based on your actual UI
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('SampleBookmark')).toBeInTheDocument();
  });

  // Add more tests as needed
});
