import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as ColumnSplitter } from '../../../components/column-splitter/ColumnSplitter';
import {
  mockColumnSplitterProps,
  mockColumnSplitterPropsTwo,
  mockColumnSplitterPropsSingle,
  mockColumnSplitterPropsNoWidths,
  mockColumnSplitterPropsMax,
  mockColumnSplitterPropsEmpty,
} from './mockProps';

describe('ColumnSplitter Component should', () => {
  it('render without crashing', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // Check if the component renders
    const columnSplitterDiv = document.querySelector('.column-splitter');
    expect(columnSplitterDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // Check if the component has the right CSS classes
    const columnSplitterDiv = document.querySelector('.column-splitter');
    expect(columnSplitterDiv).toHaveClass('row', 'component', 'column-splitter', 'columnsplitter-styles');
  });

  it('have correct ID attribute', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // Check if the component has the right ID
    const columnSplitterDiv = document.querySelector('.column-splitter');
    expect(columnSplitterDiv).toHaveAttribute('id', 'columnsplitter-test-id');
  });

  it('render correct number of columns based on EnabledPlaceholders', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // Should render 3 columns
    const rowDivs = document.querySelectorAll('.row .row');
    expect(rowDivs).toHaveLength(3);
  });

  it('apply column width classes to each column', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // Get all column divs (direct children of .column-splitter)
    const columnSplitterDiv = document.querySelector('.column-splitter');
    const columnDivs = Array.from(columnSplitterDiv?.children || []);

    expect(columnDivs[0]).toHaveClass('col-4');
    expect(columnDivs[1]).toHaveClass('col-4');
    expect(columnDivs[2]).toHaveClass('col-4');
  });

  it('apply custom styles to each column', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // Get all column divs
    const columnSplitterDiv = document.querySelector('.column-splitter');
    const columnDivs = Array.from(columnSplitterDiv?.children || []);

    expect(columnDivs[0]).toHaveClass('first-column-style');
    expect(columnDivs[1]).toHaveClass('second-column-style');
    expect(columnDivs[2]).toHaveClass('third-column-style');
  });

  it('render placeholders for each column', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // Check if placeholders are rendered
    const placeholder1 = screen.getByTestId('placeholder-column-1-{*}');
    const placeholder2 = screen.getByTestId('placeholder-column-2-{*}');
    const placeholder3 = screen.getByTestId('placeholder-column-3-{*}');

    expect(placeholder1).toBeInTheDocument();
    expect(placeholder2).toBeInTheDocument();
    expect(placeholder3).toBeInTheDocument();
  });

  it('render two columns with different widths', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsTwo} />);

    // Should render 2 columns
    const rowDivs = document.querySelectorAll('.row .row');
    expect(rowDivs).toHaveLength(2);

    // Check widths
    const columnSplitterDiv = document.querySelector('.column-splitter');
    const columnDivs = Array.from(columnSplitterDiv?.children || []);

    expect(columnDivs[0]).toHaveClass('col-8');
    expect(columnDivs[1]).toHaveClass('col-4');
  });

  it('render single column with full width', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsSingle} />);

    // Should render 1 column
    const rowDivs = document.querySelectorAll('.row .row');
    expect(rowDivs).toHaveLength(1);

    // Check width
    const columnSplitterDiv = document.querySelector('.column-splitter');
    const columnDivs = Array.from(columnSplitterDiv?.children || []);

    expect(columnDivs[0]).toHaveClass('col-12');
    expect(columnDivs[0]).toHaveClass('full-width-style');
  });

  it('handle columns without width specifications', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsNoWidths} />);

    // Should still render 2 columns
    const rowDivs = document.querySelectorAll('.row .row');
    expect(rowDivs).toHaveLength(2);

    // Should have styles but no width classes
    const columnSplitterDiv = document.querySelector('.column-splitter');
    const columnDivs = Array.from(columnSplitterDiv?.children || []);

    expect(columnDivs[0]).toHaveClass('first-style');
    expect(columnDivs[1]).toHaveClass('second-style');
  });

  it('render maximum number of columns (8)', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsMax} />);

    // Should render 8 columns
    const rowDivs = document.querySelectorAll('.row .row');
    expect(rowDivs).toHaveLength(8);
  });

  it('render all 8 placeholders for maximum columns', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsMax} />);

    // Check if all 8 placeholders exist
    for (let i = 1; i <= 8; i++) {
      const placeholder = screen.getByTestId(`placeholder-column-${i}-{*}`);
      expect(placeholder).toBeInTheDocument();
    }
  });

  it('render one empty column when EnabledPlaceholders is empty string', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsEmpty} />);

    // Should render component
    const columnSplitterDiv = document.querySelector('.column-splitter');
    expect(columnSplitterDiv).toBeInTheDocument();

    // Empty string split creates one item with empty string
    // This is JavaScript behavior: ''.split(',') returns ['']
    const rowDivs = document.querySelectorAll('.row .row');
    expect(rowDivs).toHaveLength(1);

    // Placeholder will be 'column--{*}' (empty column number)
    const placeholder = screen.getByTestId('placeholder-column--{*}');
    expect(placeholder).toBeInTheDocument();
  });

  it('render inner row div for each column', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // Each column should have an inner row div
    const innerRows = document.querySelectorAll('.row .row');
    expect(innerRows).toHaveLength(3);
  });

  it('apply both column width and custom styles together', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // First column should have both col-4 and first-column-style
    const columnSplitterDiv = document.querySelector('.column-splitter');
    const firstColumn = columnSplitterDiv?.children[0];

    expect(firstColumn).toHaveClass('col-4', 'first-column-style');
  });

  it('handle EnabledPlaceholders as comma-separated string', () => {
    render(<ColumnSplitter {...mockColumnSplitterProps} />);

    // EnabledPlaceholders: '1,2,3' should create 3 columns
    const rowDivs = document.querySelectorAll('.row .row');
    expect(rowDivs).toHaveLength(3);
  });

  it('generate correct placeholder names with column numbers', () => {
    render(<ColumnSplitter {...mockColumnSplitterPropsTwo} />);

    // Placeholder names should include column numbers
    expect(screen.getByTestId('placeholder-column-1-{*}')).toHaveTextContent('Placeholder: column-1-{*}');
    expect(screen.getByTestId('placeholder-column-2-{*}')).toHaveTextContent('Placeholder: column-2-{*}');
  });
});
