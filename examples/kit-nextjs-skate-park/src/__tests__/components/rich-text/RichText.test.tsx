import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as RichText } from '../../../components/rich-text/RichText';
import {
  mockRichTextProps,
  mockRichTextPropsSimple,
  mockRichTextPropsEmpty,
  mockRichTextPropsNoFields,
} from './mockProps';

describe('RichText Component should', () => {
  it('render without crashing', () => {
    render(<RichText {...mockRichTextProps} />);

    // Check if the component renders
    const componentDiv = document.querySelector('.rich-text');
    expect(componentDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<RichText {...mockRichTextProps} />);

    // Check if the component has the right CSS classes
    const componentDiv = document.querySelector('.rich-text');
    expect(componentDiv).toHaveClass('component', 'rich-text', 'richtext-styles');
  });

  it('have correct ID attribute', () => {
    render(<RichText {...mockRichTextProps} />);

    // Check if the component has the right ID
    const componentDiv = document.querySelector('.rich-text');
    expect(componentDiv).toHaveAttribute('id', 'richtext-test-id');
  });

  it('render rich text content with HTML formatting', () => {
    render(<RichText {...mockRichTextProps} />);

    // Check if bold text is rendered
    const boldText = screen.getByText('bold');
    expect(boldText).toBeInTheDocument();
    expect(boldText.tagName).toBe('STRONG');

    // Check if italic text is rendered
    const italicText = screen.getByText('emphasis');
    expect(italicText).toBeInTheDocument();
    expect(italicText.tagName).toBe('EM');
  });

  it('render simple paragraph text', () => {
    render(<RichText {...mockRichTextPropsSimple} />);

    // Check if simple text is rendered
    const simpleText = screen.getByText('Simple paragraph text.');
    expect(simpleText).toBeInTheDocument();
  });

  it('apply different styles correctly', () => {
    render(<RichText {...mockRichTextPropsSimple} />);

    // Check if component has different styles
    const componentDiv = document.querySelector('.rich-text');
    expect(componentDiv).toHaveClass('component', 'rich-text', 'simple-styles');
  });

  it('handle empty text gracefully', () => {
    render(<RichText {...mockRichTextPropsEmpty} />);

    // Component should still render even with empty text
    const componentDiv = document.querySelector('.rich-text');
    expect(componentDiv).toBeInTheDocument();
    expect(componentDiv).toHaveAttribute('id', 'richtext-empty-id');
  });

  it('show empty hint when no fields are provided', () => {
    render(<RichText {...mockRichTextPropsNoFields} />);

    // Should show "Rich text" as empty hint
    const emptyHint = screen.getByText('Rich text');
    expect(emptyHint).toBeInTheDocument();
    expect(emptyHint).toHaveClass('is-empty-hint');
  });

  it('render component-content div', () => {
    render(<RichText {...mockRichTextProps} />);

    // Check if component-content div exists
    const contentDiv = document.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
  });
});

describe('RichText Component Error Handling should', () => {
  it('handle null fields gracefully', () => {
    const propsWithNull = {
      ...mockRichTextPropsNoFields,
      fields: null as any,
    };
    render(<RichText {...propsWithNull} />);

    // Should render empty hint without crashing
    const emptyHint = screen.getByText('Rich text');
    expect(emptyHint).toBeInTheDocument();
  });

  it('handle undefined params gracefully', () => {
    const propsWithUndefinedParams = {
      ...mockRichTextProps,
      params: {} as any,
    };
    render(<RichText {...propsWithUndefinedParams} />);

    // Should still render content
    expect(screen.getByText('bold')).toBeInTheDocument();
  });

  it('render without styles parameter', () => {
    const propsWithoutStyles = {
      ...mockRichTextProps,
      params: {
        RenderingIdentifier: 'test-id',
      } as any,
    };
    render(<RichText {...propsWithoutStyles} />);

    // Should render without crashing
    expect(screen.getByText('bold')).toBeInTheDocument();
  });
});
