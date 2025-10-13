import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as PageContent } from '../../../components/page-content/PageContent';
import {
  mockPageContentProps,
  mockPageContentPropsRich,
  mockPageContentPropsSimple,
  mockPageContentPropsNoContent,
  mockPageContentPropsEmpty,
} from './mockProps';

describe('PageContent Component should', () => {
  it('render without crashing', () => {
    render(<PageContent {...mockPageContentProps} />);

    // Check if the component renders
    const pageContentDiv = document.querySelector('.content');
    expect(pageContentDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<PageContent {...mockPageContentProps} />);

    // Check if the component has the right CSS classes
    const pageContentDiv = document.querySelector('.content');
    expect(pageContentDiv).toHaveClass('component', 'content', 'pagecontent-styles');
  });

  it('have correct ID attribute', () => {
    render(<PageContent {...mockPageContentProps} />);

    // Check if the component has the right ID
    const pageContentDiv = document.querySelector('.content');
    expect(pageContentDiv).toHaveAttribute('id', 'pagecontent-test-id');
  });

  it('render content with HTML formatting', () => {
    render(<PageContent {...mockPageContentProps} />);

    // Check if formatted text is rendered
    const boldText = screen.getByText('formatting');
    expect(boldText).toBeInTheDocument();
    expect(boldText.tagName).toBe('STRONG');

    const italicText = screen.getByText('styles');
    expect(italicText).toBeInTheDocument();
    expect(italicText.tagName).toBe('EM');
  });

  it('render field-content wrapper div', () => {
    render(<PageContent {...mockPageContentProps} />);

    // Check if field-content wrapper exists
    const fieldContentDiv = document.querySelector('.field-content');
    expect(fieldContentDiv).toBeInTheDocument();
  });

  it('render component-content wrapper div', () => {
    render(<PageContent {...mockPageContentProps} />);

    // Check if component-content wrapper exists
    const componentContentDiv = document.querySelector('.component-content');
    expect(componentContentDiv).toBeInTheDocument();
  });

  it('render rich HTML content with multiple elements', () => {
    render(<PageContent {...mockPageContentPropsRich} />);

    // Check if heading is rendered
    const heading = screen.getByText('Heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');

    // Check if link is rendered
    const link = screen.getByText('link');
    expect(link).toBeInTheDocument();

    // Check if list items are rendered
    const item1 = screen.getByText('Item 1');
    const item2 = screen.getByText('Item 2');
    expect(item1).toBeInTheDocument();
    expect(item2).toBeInTheDocument();
  });

  it('render simple text content', () => {
    render(<PageContent {...mockPageContentPropsSimple} />);

    // Check if simple text is rendered
    const simpleText = screen.getByText('Simple page content text.');
    expect(simpleText).toBeInTheDocument();
  });

  it('apply different styles correctly', () => {
    render(<PageContent {...mockPageContentPropsSimple} />);

    // Check if component has different styles
    const pageContentDiv = document.querySelector('.content');
    expect(pageContentDiv).toHaveClass('component', 'content', 'simple-styles');
  });

  it('show placeholder when no content field', () => {
    render(<PageContent {...mockPageContentPropsNoContent} />);

    // Should show "[Content]" placeholder
    const placeholder = screen.getByText('[Content]');
    expect(placeholder).toBeInTheDocument();
  });

  it('render with empty content gracefully', () => {
    render(<PageContent {...mockPageContentPropsEmpty} />);

    // Component should still render
    const pageContentDiv = document.querySelector('.content');
    expect(pageContentDiv).toBeInTheDocument();
    expect(pageContentDiv).toHaveAttribute('id', 'pagecontent-empty-id');
  });

  it('render field-content div even when content is empty', () => {
    render(<PageContent {...mockPageContentPropsEmpty} />);

    // field-content wrapper should exist
    const fieldContentDiv = document.querySelector('.field-content');
    expect(fieldContentDiv).toBeInTheDocument();
  });

  it('render content inside proper nested structure', () => {
    render(<PageContent {...mockPageContentProps} />);

    // Check nested structure: .content > .component-content > .field-content
    const contentDiv = document.querySelector('.content');
    const componentContentDiv = contentDiv?.querySelector('.component-content');
    const fieldContentDiv = componentContentDiv?.querySelector('.field-content');

    expect(contentDiv).toBeInTheDocument();
    expect(componentContentDiv).toBeInTheDocument();
    expect(fieldContentDiv).toBeInTheDocument();
  });
});
