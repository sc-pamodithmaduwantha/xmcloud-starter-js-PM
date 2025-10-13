import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Title } from '../../../components/title/Title';
import { mockTitleProps, mockTitlePropsEditing, mockTitlePropsNoFields } from './Title.mockProps';

const getTitleElement = (text: string) => screen.getByText(text).closest('.component');

describe('Title Component should', () => {
  it('render without crashing', () => {
    render(<Title {...mockTitleProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Title {...mockTitleProps} />);
    expect(getTitleElement('Test Title')).toHaveClass('component', 'title', 'test-styles');
  });

  it('have correct ID attribute', () => {
    render(<Title {...mockTitleProps} />);
    expect(getTitleElement('Test Title')).toHaveAttribute('id', 'test-id');
  });

  it('render with different styles', () => {
    render(<Title {...mockTitlePropsEditing} />);
    expect(getTitleElement('Test Title')).toHaveClass('component', 'title', 'editing-styles');
  });

  it('render with different ID', () => {
    render(<Title {...mockTitlePropsEditing} />);
    expect(getTitleElement('Test Title')).toHaveAttribute('id', 'editing-id');
  });

  it('handle missing fields gracefully', () => {
    render(<Title {...mockTitlePropsNoFields} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('render as a link in preview mode', () => {
    render(<Title {...mockTitleProps} />);
    const linkElement = screen.getByText('Test Title').closest('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test-page');
  });
});

describe('Title Component Accessibility should', () => {
  it('have accessible links with proper href', () => {
    render(<Title {...mockTitleProps} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test-page');
  });

  it('have descriptive link text', () => {
    render(<Title {...mockTitleProps} />);
    expect(screen.getByRole('link', { name: /Test Title/i })).toBeInTheDocument();
  });

  it('maintain accessibility with different content', () => {
    render(<Title {...mockTitlePropsEditing} />);
    expect(screen.getByRole('link')).toHaveAccessibleName();
  });
});
