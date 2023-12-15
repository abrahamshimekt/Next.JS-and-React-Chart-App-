// ConfirmDelete.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmDelete from '../../components/commons/ConfirmDelete';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };
});


describe('ConfirmDelete', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ConfirmDelete resourceName="TestResource" onConfirm={() => {}} disabled={false} />
    );

    expect(getByText('Delete TestResource')).toBeInTheDocument();
    expect(
      getByText('Are you sure you want to delete this TestResource permanently? This action cannot be undone.')
    ).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Delete')).toBeInTheDocument();
  });

  it('calls onConfirm when "Delete" is clicked', () => {
    const onConfirmMock = jest.fn();
    const { getByText } = render(
      <ConfirmDelete resourceName="TestResource" onConfirm={onConfirmMock} disabled={false} />
    );

    fireEvent.click(getByText('Delete'));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('calls onCloseModal when "Cancel" is clicked', () => {
    const onCloseModalMock = jest.fn();
    const { getByText } = render(
      <ConfirmDelete resourceName="TestResource" onConfirm={() => {}} disabled={false} onCloseModal={onCloseModalMock} />
    );

    fireEvent.click(getByText('Cancel'));
    expect(onCloseModalMock).toHaveBeenCalledTimes(1);
  });

  // Add more test cases as needed
});