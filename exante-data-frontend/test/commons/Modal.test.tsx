// Modal.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extended Jest matchers
import Modal from '../../components/commons/Modal'; // Update the path accordingly
describe('Modal Component', () => {
  it('opens and closes the modal correctly', () => {
    const { getByText, getByLabelText, queryByText } = render(
      <Modal>
        <Modal.Open opens="modal1">
          <button>Open Modal 1</button>
        </Modal.Open>

        <Modal.Window name="modal1">
          <div>
            <h2>Modal 1 Content</h2>
            <p>This is the content of Modal 1.</p>
          </div>
        </Modal.Window>
      </Modal>
    );

    // Modal should not be in the document initially
    expect(queryByText('Modal 1 Content')).not.toBeInTheDocument();

    // Click the button to open the modal
    fireEvent.click(getByText('Open Modal 1'));

    // Modal should be in the document after clicking the button
    expect(getByText('Modal 1 Content')).toBeInTheDocument();

    // Click the close button inside the modal using getByLabelText
    fireEvent.click(getByLabelText('Close Modal'));

    // Modal should not be in the document after clicking the close button
    expect(queryByText('Modal 1 Content')).not.toBeInTheDocument();
  });
});