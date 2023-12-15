import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ColumnSelector from '../../components/data-visualizer/columnSelector';
import { setSelectedColumns } from '@/redux/slice/dataSlice';

const mockStore = configureStore();

describe('ColumnSelector component', () => {
  test('renders component with initial state', async () => {
    const store = mockStore({
      searchedData: {
        selectedColumns: {
          date: "",
          data: "",
          dataName: "",
        },
      },
    });

    render(
      <Provider store={store}>
        <ColumnSelector columns={['Column1', 'Column2', 'Column3']} />
      </Provider>
    );

    const heading = screen.getByText('Column Selector');
    const saveButton = screen.getByText('Save Columns');
    const dateColumnSelect = screen.getByLabelText('Date Column:', { selector: 'select' });
    const dataColumnSelect = screen.getByLabelText('Data Column:', { selector: 'select' });
    const dataNameInput = screen.getByPlaceholderText('Enter data name');

    // Assertions...
  });

  test('handles column selection and dispatches action', async () => {
    // Your test logic...
  });
});
