
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpinnerMini from './../../components/commons/SpinnerMini';

describe('SpinnerMini component', () => {
  test('renders SpinnerMini component with animation', () => {
    const { container } = render(<SpinnerMini />);

    // Ensure the component is rendered
    expect(container.firstChild).toBeInTheDocument();

   
  });
});
