import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ContentBlock from '../../../components/content-block/ContentBlock';
import {
  mockContentBlockProps,
  mockContentBlockPropsSimple,
  mockContentBlockPropsLong,
  mockContentBlockPropsEmpty,
} from './ContentBlock.mockProps';

describe('ContentBlock Component should', () => {
  it('render without crashing', () => {
    render(<ContentBlock {...mockContentBlockProps} />);

    // Check if the component renders
    const contentBlockDiv = document.querySelector('.contentBlock');
    expect(contentBlockDiv).toBeInTheDocument();
  });

  it('render heading as h2 element', () => {
    render(<ContentBlock {...mockContentBlockProps} />);

    // Check if heading is rendered as h2
    const headingElement = screen.getByText('Content Block Heading');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H2');
  });

  it('apply contentTitle class to heading', () => {
    render(<ContentBlock {...mockContentBlockProps} />);

    // Check if heading has correct class
    const headingElement = screen.getByText('Content Block Heading');
    expect(headingElement).toHaveClass('contentTitle');
  });

  it('render content with HTML formatting', () => {
    render(<ContentBlock {...mockContentBlockProps} />);

    // Check if bold text is rendered
    const boldText = screen.getByText('content');
    expect(boldText).toBeInTheDocument();
    expect(boldText.tagName).toBe('STRONG');

    // Check if italic text is rendered
    const italicText = screen.getByText('formatting');
    expect(italicText).toBeInTheDocument();
    expect(italicText.tagName).toBe('EM');
  });

  it('apply contentDescription class to content', () => {
    render(<ContentBlock {...mockContentBlockProps} />);

    // Check if content has correct class
    const contentDiv = document.querySelector('.contentDescription');
    expect(contentDiv).toBeInTheDocument();
  });

  it('render simple content correctly', () => {
    render(<ContentBlock {...mockContentBlockPropsSimple} />);

    // Check if simple heading is rendered
    const headingElement = screen.getByText('Simple Heading');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H2');

    // Check if simple content is rendered
    const contentText = screen.getByText('Simple content text.');
    expect(contentText).toBeInTheDocument();
  });

  it('render long content with multiple paragraphs', () => {
    render(<ContentBlock {...mockContentBlockPropsLong} />);

    // Check if heading is rendered
    const headingElement = screen.getByText('Long Content Block');
    expect(headingElement).toBeInTheDocument();

    // Check if first paragraph content is rendered
    const firstParagraph = screen.getByText(/This is a longer content block/);
    expect(firstParagraph).toBeInTheDocument();

    // Check if second paragraph is rendered
    const secondParagraph = screen.getByText('It can even have multiple paragraphs.');
    expect(secondParagraph).toBeInTheDocument();
  });

  it('handle empty content gracefully', () => {
    render(<ContentBlock {...mockContentBlockPropsEmpty} />);

    // Component should still render even with empty fields
    const contentBlockDiv = document.querySelector('.contentBlock');
    expect(contentBlockDiv).toBeInTheDocument();
  });

  it('render contentBlock wrapper div', () => {
    render(<ContentBlock {...mockContentBlockProps} />);

    // Check if wrapper div exists
    const wrapperDiv = document.querySelector('.contentBlock');
    expect(wrapperDiv).toBeInTheDocument();
  });

  it('render both heading and content together', () => {
    render(<ContentBlock {...mockContentBlockProps} />);

    // Both should be present in the same component
    const heading = screen.getByText('Content Block Heading');
    const content = screen.getByText('content');
    
    expect(heading).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });
});

describe('ContentBlock Component Accessibility should', () => {
  it('have proper heading structure with h2', () => {
    render(<ContentBlock {...mockContentBlockProps} />);

    // Use role-based selector for accessibility
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Content Block Heading');
  });

  it('maintain semantic heading hierarchy', () => {
    render(<ContentBlock {...mockContentBlockPropsSimple} />);

    // Verify heading is semantically correct
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H2');
  });

  it('have accessible heading text', () => {
    render(<ContentBlock {...mockContentBlockProps} />);

    // Heading should be accessible by role and have text
    const heading = screen.getByRole('heading', { name: /Content Block Heading/i });
    expect(heading).toBeInTheDocument();
  });

  it('render rich content with proper heading hierarchy', () => {
    render(<ContentBlock {...mockContentBlockPropsLong} />);

    // Main heading should be h2
    const mainHeading = screen.getByRole('heading', { level: 2, name: /Long Content Block/i });
    expect(mainHeading).toBeInTheDocument();
  });
});
