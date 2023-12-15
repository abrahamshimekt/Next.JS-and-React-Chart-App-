import React from 'react';
import { render } from '@testing-library/react';
import TemplateTable from './../../components/email-sender/TemplateTable';

jest.mock('/Users/tadaelshewaregagebre/Desktop/exante-data-frontend/components/email-sender/TemplateTableHeader.tsx', () => () => <div data-testid="mocked-template-table-header" />);
jest.mock('/Users/tadaelshewaregagebre/Desktop/exante-data-frontend/components/email-sender/TemplateTableBody', () => () => <div data-testid="mocked-template-table-body" />);
jest.mock('/Users/tadaelshewaregagebre/Desktop/exante-data-frontend/components/email-sender/TemplateTableFooter', () => () => <div data-testid="mocked-template-table-footer" />);

describe('TemplateTable Component', () => {
  test('renders TemplateTable with child components', () => {
    const { getByTestId } = render(<TemplateTable />);
    
    const header = getByTestId('mocked-template-table-header');
    const body = getByTestId('mocked-template-table-body');
    const footer = getByTestId('mocked-template-table-footer');
    
    expect(header).toBeInTheDocument();
    expect(body).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });
});
