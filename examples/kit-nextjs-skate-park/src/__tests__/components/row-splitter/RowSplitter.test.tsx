import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as RowSplitter } from '../../../components/row-splitter/RowSplitter';
import {
  mockRowSplitterProps,
  mockRowSplitterPropsTwo,
  mockRowSplitterPropsSingle,
  mockRowSplitterPropsNoStyles,
  mockRowSplitterPropsMax,
  mockRowSplitterPropsEmpty,
} from './mockProps';

describe('RowSplitter Component should', () => {
  it('render without crashing', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);

    // Check if the component renders
    const rowSplitterDiv = document.querySelector('.row-splitter');
    expect(rowSplitterDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);

    // Check if the component has the right CSS classes
    const rowSplitterDiv = document.querySelector('.row-splitter');
    expect(rowSplitterDiv).toHaveClass('component', 'row-splitter', 'rowsplitter-styles');
  });

  it('have correct ID attribute', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);

    // Check if the component has the right ID
    const rowSplitterDiv = document.querySelector('.row-splitter');
    expect(rowSplitterDiv).toHaveAttribute('id', 'rowsplitter-test-id');
  });

  it('render correct number of rows based on EnabledPlaceholders', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);

    // Should render 3 rows (container-fluid divs)
    const containerDivs = document.querySelectorAll('.container-fluid');
    expect(containerDivs).toHaveLength(3);
  });

  it('apply custom styles to each row', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);

    // Get all container-fluid divs
    const containerDivs = document.querySelectorAll('.container-fluid');

    expect(containerDivs[0]).toHaveClass('first-row-style');
    expect(containerDivs[1]).toHaveClass('second-row-style');
    expect(containerDivs[2]).toHaveClass('third-row-style');
  });

  it('render placeholders for each row', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);

    // Check if placeholders are rendered
    const placeholder1 = screen.getByTestId('placeholder-row-1-{*}');
    const placeholder2 = screen.getByTestId('placeholder-row-2-{*}');
    const placeholder3 = screen.getByTestId('placeholder-row-3-{*}');

    expect(placeholder1).toBeInTheDocument();
    expect(placeholder2).toBeInTheDocument();
    expect(placeholder3).toBeInTheDocument();
  });

  it('render two rows with custom styles', () => {
    render(<RowSplitter {...mockRowSplitterPropsTwo} />);

    // Should render 2 rows
    const containerDivs = document.querySelectorAll('.container-fluid');
    expect(containerDivs).toHaveLength(2);

    // Check styles
    expect(containerDivs[0]).toHaveClass('hero-section');
    expect(containerDivs[1]).toHaveClass('content-section');
  });

  it('render single row', () => {
    render(<RowSplitter {...mockRowSplitterPropsSingle} />);

    // Should render 1 row
    const containerDivs = document.querySelectorAll('.container-fluid');
    expect(containerDivs).toHaveLength(1);

    // Check style
    expect(containerDivs[0]).toHaveClass('full-page-style');
  });

  it('handle rows without style specifications', () => {
    render(<RowSplitter {...mockRowSplitterPropsNoStyles} />);

    // Should still render 3 rows
    const containerDivs = document.querySelectorAll('.container-fluid');
    expect(containerDivs).toHaveLength(3);

    // Should only have container-fluid class (no custom styles)
    expect(containerDivs[0].className.trim()).toBe('container-fluid');
    expect(containerDivs[1].className.trim()).toBe('container-fluid');
    expect(containerDivs[2].className.trim()).toBe('container-fluid');
  });

  it('render maximum number of rows (8)', () => {
    render(<RowSplitter {...mockRowSplitterPropsMax} />);

    // Should render 8 rows
    const containerDivs = document.querySelectorAll('.container-fluid');
    expect(containerDivs).toHaveLength(8);
  });

  it('render all 8 placeholders for maximum rows', () => {
    render(<RowSplitter {...mockRowSplitterPropsMax} />);

    // Check if all 8 placeholders exist
    for (let i = 1; i <= 8; i++) {
      const placeholder = screen.getByTestId(`placeholder-row-${i}-{*}`);
      expect(placeholder).toBeInTheDocument();
    }
  });

  it('apply all custom styles to maximum rows', () => {
    render(<RowSplitter {...mockRowSplitterPropsMax} />);

    const containerDivs = document.querySelectorAll('.container-fluid');

    expect(containerDivs[0]).toHaveClass('header');
    expect(containerDivs[1]).toHaveClass('hero');
    expect(containerDivs[2]).toHaveClass('features');
    expect(containerDivs[3]).toHaveClass('testimonials');
    expect(containerDivs[4]).toHaveClass('pricing');
    expect(containerDivs[5]).toHaveClass('faq');
    expect(containerDivs[6]).toHaveClass('cta');
    expect(containerDivs[7]).toHaveClass('footer');
  });

  it('render one row with row number 0 when EnabledPlaceholders is empty string', () => {
    render(<RowSplitter {...mockRowSplitterPropsEmpty} />);

    // Should render component
    const rowSplitterDiv = document.querySelector('.row-splitter');
    expect(rowSplitterDiv).toBeInTheDocument();

    // Empty string split creates one item with empty string
    const containerDivs = document.querySelectorAll('.container-fluid');
    expect(containerDivs).toHaveLength(1);

    // Number('') returns 0, so placeholder will be 'row-0-{*}'
    const placeholder = screen.getByTestId('placeholder-row-0-{*}');
    expect(placeholder).toBeInTheDocument();
  });

  it('render inner row div for each container', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);

    // Each container should have an inner row div
    const innerRows = document.querySelectorAll('.container-fluid .row');
    expect(innerRows).toHaveLength(3);
  });

  it('render container-fluid for each row', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);

    // Each row should be wrapped in container-fluid
    const containerDivs = document.querySelectorAll('.container-fluid');
    expect(containerDivs).toHaveLength(3);
  });

  it('handle EnabledPlaceholders as comma-separated string', () => {
    render(<RowSplitter {...mockRowSplitterProps} />);

    // EnabledPlaceholders: '1,2,3' should create 3 rows
    const containerDivs = document.querySelectorAll('.container-fluid');
    expect(containerDivs).toHaveLength(3);
  });

  it('generate correct placeholder names with row numbers', () => {
    render(<RowSplitter {...mockRowSplitterPropsTwo} />);

    // Placeholder names should include row numbers
    expect(screen.getByTestId('placeholder-row-1-{*}')).toHaveTextContent('Placeholder: row-1-{*}');
    expect(screen.getByTestId('placeholder-row-2-{*}')).toHaveTextContent('Placeholder: row-2-{*}');
  });
});
