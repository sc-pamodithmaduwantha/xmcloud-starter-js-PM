import { render, screen } from '@testing-library/react';
import { Default as Title } from '../../../components/title/Title';
import { mockTitleProps, mockTitlePropsEditing, mockTitlePropsNoFields } from './mockProps';

describe('Title Component should', () => {
  it('render without crashing', () => {
    render(<Title {...mockTitleProps} />);
    
    // Check if the component renders
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Title {...mockTitleProps} />);
    
    // Check if the component has the right CSS classes
    const titleElement = screen.getByText('Test Title').closest('.component');
    expect(titleElement).toHaveClass('component', 'title', 'test-styles');
  });

  it('have correct ID attribute', () => {
    render(<Title {...mockTitleProps} />);
    
    // Check if the component has the right ID
    const titleElement = screen.getByText('Test Title').closest('.component');
    expect(titleElement).toHaveAttribute('id', 'test-id');
  });

  it('render with different styles', () => {
    render(<Title {...mockTitlePropsEditing} />);
    
    // Check if the component has the editing styles
    const titleElement = screen.getByText('Test Title').closest('.component');
    expect(titleElement).toHaveClass('component', 'title', 'editing-styles');
  });

  it('render with different ID', () => {
    render(<Title {...mockTitlePropsEditing} />);
    
    // Check if the component has the editing ID
    const titleElement = screen.getByText('Test Title').closest('.component');
    expect(titleElement).toHaveAttribute('id', 'editing-id');
  });

  it('handle missing fields gracefully', () => {
    render(<Title {...mockTitlePropsNoFields} />);
    
    // Should still render without crashing
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('render as a link in preview mode', () => {
    render(<Title {...mockTitleProps} />);
    
    // In preview mode, the title should be wrapped in a link
    const linkElement = screen.getByText('Test Title').closest('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test-page');
  });
});
