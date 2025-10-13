import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as LinkList } from '../../../components/link-list/LinkList';
import {
  mockLinkListProps,
  mockLinkListPropsSingle,
  mockLinkListPropsEven,
  mockLinkListPropsNoData,
} from './LinkList.mockProps';

describe('LinkList Component should', () => {
  it('render without crashing', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if the component renders
    const linkListDiv = document.querySelector('.link-list');
    expect(linkListDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if the component has the right CSS classes
    const linkListDiv = document.querySelector('.link-list');
    expect(linkListDiv).toHaveClass('component', 'link-list', 'linklist-styles');
  });

  it('have correct ID attribute', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if the component has the right ID
    const linkListDiv = document.querySelector('.link-list');
    expect(linkListDiv).toHaveAttribute('id', 'linklist-test-id');
  });

  it('render title as h3 element', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if title is rendered as h3
    const titleElement = screen.getByText('Link List Title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H3');
  });

  it('render all links in the list', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if all three links are rendered
    expect(screen.getByText('First Link')).toBeInTheDocument();
    expect(screen.getByText('Second Link')).toBeInTheDocument();
    expect(screen.getByText('Third Link')).toBeInTheDocument();
  });

  it('render links inside ul element', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if ul exists
    const ulElement = document.querySelector('ul');
    expect(ulElement).toBeInTheDocument();
  });

  it('render each link inside li element', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if li elements exist
    const liElements = document.querySelectorAll('li');
    expect(liElements).toHaveLength(3);
  });

  it('apply item index class to each list item', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if index classes are applied
    const liElements = document.querySelectorAll('li');
    expect(liElements[0]).toHaveClass('item0');
    expect(liElements[1]).toHaveClass('item1');
    expect(liElements[2]).toHaveClass('item2');
  });

  it('apply odd class to even-indexed items (0, 2, 4...)', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Index 0 and 2 should have 'odd' class
    const liElements = document.querySelectorAll('li');
    expect(liElements[0]).toHaveClass('odd');
    expect(liElements[2]).toHaveClass('odd');
  });

  it('apply even class to odd-indexed items (1, 3, 5...)', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Index 1 should have 'even' class
    const liElements = document.querySelectorAll('li');
    expect(liElements[1]).toHaveClass('even');
  });

  it('apply first class to first item', () => {
    render(<LinkList {...mockLinkListProps} />);

    // First item should have 'first' class
    const liElements = document.querySelectorAll('li');
    expect(liElements[0]).toHaveClass('first');
  });

  it('apply last class to last item', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Last item should have 'last' class
    const liElements = document.querySelectorAll('li');
    expect(liElements[2]).toHaveClass('last');
  });

  it('apply both first and last class to single item', () => {
    render(<LinkList {...mockLinkListPropsSingle} />);

    // Single item should have both 'first' and 'last' classes
    const liElement = document.querySelector('li');
    expect(liElement).toHaveClass('first');
    expect(liElement).toHaveClass('last');
  });

  it('render field-link div for each link', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if field-link divs exist
    const fieldLinkDivs = document.querySelectorAll('.field-link');
    expect(fieldLinkDivs).toHaveLength(3);
  });

  it('render links with correct href attributes', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if links have correct hrefs
    const firstLink = screen.getByText('First Link').closest('a');
    const secondLink = screen.getByText('Second Link').closest('a');
    const thirdLink = screen.getByText('Third Link').closest('a');

    expect(firstLink).toHaveAttribute('href', '/link-1');
    expect(secondLink).toHaveAttribute('href', '/link-2');
    expect(thirdLink).toHaveAttribute('href', '/link-3');
  });

  it('apply correct classes for even number of links', () => {
    render(<LinkList {...mockLinkListPropsEven} />);

    // Test with 4 links
    const liElements = document.querySelectorAll('li');
    expect(liElements).toHaveLength(4);

    // Check odd/even classes
    expect(liElements[0]).toHaveClass('odd'); // index 0
    expect(liElements[1]).toHaveClass('even'); // index 1
    expect(liElements[2]).toHaveClass('odd'); // index 2
    expect(liElements[3]).toHaveClass('even'); // index 3

    // Check first/last
    expect(liElements[0]).toHaveClass('first');
    expect(liElements[3]).toHaveClass('last');
  });

  it('show empty state heading when no datasource', () => {
    render(<LinkList {...mockLinkListPropsNoData} />);

    // Should show "Link List" heading
    const emptyHeading = screen.getByText('Link List');
    expect(emptyHeading).toBeInTheDocument();
    expect(emptyHeading.tagName).toBe('H3');
  });

  it('not render ul when no datasource', () => {
    render(<LinkList {...mockLinkListPropsNoData} />);

    // Should not have ul element
    const ulElement = document.querySelector('ul');
    expect(ulElement).toBeNull();
  });

  it('render component-content div', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Check if component-content wrapper exists
    const contentDiv = document.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
  });
});

describe('LinkList Component Accessibility should', () => {
  it('use semantic heading for title', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Title should be a semantic heading
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Link List Title');
  });

  it('have accessible links for all list items', () => {
    render(<LinkList {...mockLinkListProps} />);

    // All links should be accessible
    const firstLink = screen.getByRole('link', { name: /First Link/i });
    const secondLink = screen.getByRole('link', { name: /Second Link/i });
    const thirdLink = screen.getByRole('link', { name: /Third Link/i });

    expect(firstLink).toBeInTheDocument();
    expect(secondLink).toBeInTheDocument();
    expect(thirdLink).toBeInTheDocument();
  });

  it('use semantic list structure', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Should use semantic ul/li structure
    const list = document.querySelector('ul');
    const listItems = document.querySelectorAll('li');

    expect(list).toBeInTheDocument();
    expect(listItems).toHaveLength(3);
  });

  it('provide meaningful link text', () => {
    render(<LinkList {...mockLinkListProps} />);

    // Links should have descriptive text for screen readers
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAccessibleName();
    });
  });
});
