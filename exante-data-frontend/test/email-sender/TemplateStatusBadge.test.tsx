import React from 'react';
import { render } from '@testing-library/react';
import TemplateStatusBadge from './../../components/email-sender/TemplateStatusBadge';

describe('TemplateStatusBadge Component', () => {
  test('renders TemplateStatusBadge with status prop', () => {
    const status = 'Active';
    const { getByText } = render(<TemplateStatusBadge status={status} />);
    
    const statusElement = getByText(status);
    
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('flex justify-center bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300');
  });

  test('renders TemplateStatusBadge with different status prop', () => {
    const status = 'Inactive';
    const { getByText } = render(<TemplateStatusBadge status={status} />);
    
    const statusElement = getByText(status);
    
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('flex justify-center bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300');
  });
});
