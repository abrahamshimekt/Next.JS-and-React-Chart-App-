import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import AllBookmarksButton from "./../components/AllBookmarksButton";

const mockStore = configureStore([]);

describe("AllBookmarksButton", () => {
  test("renders button and opens modal on click", () => {
    const store = mockStore({}); // Provide a mock Redux store

    render(
      <Provider store={store}>
        <AllBookmarksButton />
      </Provider>
    );

    // Rest of your test code
  });
});