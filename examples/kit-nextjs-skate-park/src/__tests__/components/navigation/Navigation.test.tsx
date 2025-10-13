import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Default as Navigation } from '../../../components/navigation/Navigation';
import {
  mockNavigationProps,
  mockNavigationPropsFlat,
  mockNavigationPropsDisplayName,
  mockNavigationPropsEmpty,
} from './mockProps';

describe('Navigation Component should', () => {
  it('render without crashing', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if the component renders
    const navigationDiv = document.querySelector('.navigation');
    expect(navigationDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if the component has the right CSS classes
    const navigationDiv = document.querySelector('.navigation');
    expect(navigationDiv).toHaveClass('component', 'navigation', 'navigation-styles');
  });

  it('have correct ID attribute', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if the component has the right ID
    const navigationDiv = document.querySelector('.navigation');
    expect(navigationDiv).toHaveAttribute('id', 'navigation-test-id');
  });

  it('render all top-level navigation items', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if all top-level items are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('render child navigation items', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if child items are rendered
    expect(screen.getByText('Team')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('render navigation inside nav element', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if nav element exists
    const navElement = document.querySelector('nav');
    expect(navElement).toBeInTheDocument();
  });

  it('render navigation items inside ul element', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if ul exists
    const ulElements = document.querySelectorAll('ul');
    expect(ulElements.length).toBeGreaterThan(0);
  });

  it('render navigation items as li elements', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if li elements exist
    const liElements = document.querySelectorAll('li');
    expect(liElements.length).toBeGreaterThan(0);
  });

  it('apply rel-level1 class to top-level items', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Top-level items should have rel-level1
    const homeLink = screen.getByText('Home').closest('li');
    expect(homeLink).toHaveClass('rel-level1');
  });

  it('apply rel-level2 class to child items', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Child items should have rel-level2
    const teamLink = screen.getByText('Team').closest('li');
    expect(teamLink).toHaveClass('rel-level2');
  });

  it('apply custom styles to navigation items', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if custom style is applied
    const homeLink = screen.getByText('Home').closest('li');
    expect(homeLink).toHaveClass('home-style');
  });

  it('apply child class when item has children', () => {
    render(<Navigation {...mockNavigationProps} />);

    // "About" has children, should have 'child' class
    const aboutTitle = screen.getByText('About').closest('.navigation-title');
    expect(aboutTitle).toHaveClass('child');
  });

  it('not apply child class when item has no children', () => {
    render(<Navigation {...mockNavigationProps} />);

    // "Home" has no children, should not have 'child' class
    const homeTitle = screen.getByText('Home').closest('.navigation-title');
    expect(homeTitle).not.toHaveClass('child');
  });

  it('render nested ul for items with children', () => {
    render(<Navigation {...mockNavigationProps} />);

    // About has children, should have nested ul
    const ulElements = document.querySelectorAll('ul.clearfix');
    expect(ulElements.length).toBeGreaterThan(1); // One for top-level, one for nested
  });

  it('render links with correct href attributes', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check hrefs
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');

    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('render mobile menu checkbox', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if checkbox exists
    const checkbox = document.querySelector('input[type="checkbox"].menu-mobile-navigate');
    expect(checkbox).toBeInTheDocument();
  });

  it('toggle menu state when checkbox is clicked', () => {
    render(<Navigation {...mockNavigationProps} />);

    const checkbox = document.querySelector('input[type="checkbox"].menu-mobile-navigate') as HTMLInputElement;
    
    // Initially unchecked
    expect(checkbox.checked).toBe(false);

    // Click to open
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    // Click to close
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('toggle active state when navigation title is clicked', () => {
    render(<Navigation {...mockNavigationProps} />);

    const aboutTitle = screen.getByText('About').closest('.navigation-title') as HTMLElement;
    const aboutLi = aboutTitle.closest('li');

    // Initially not active
    expect(aboutLi).not.toHaveClass('active');

    // Click to activate
    fireEvent.click(aboutTitle);
    expect(aboutLi).toHaveClass('active');

    // Click to deactivate
    fireEvent.click(aboutTitle);
    expect(aboutLi).not.toHaveClass('active');
  });

  it('use NavigationTitle when available', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Home has NavigationTitle "Home"
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('fall back to Title when NavigationTitle is not available', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Contact has no NavigationTitle, should use Title "Contact Us"
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('fall back to DisplayName when neither Title nor NavigationTitle available', () => {
    render(<Navigation {...mockNavigationPropsDisplayName} />);

    // Should use DisplayName
    expect(screen.getByText('Simple Link')).toBeInTheDocument();
  });

  it('render flat navigation without children', () => {
    render(<Navigation {...mockNavigationPropsFlat} />);

    // Check both items
    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByText('Page 2')).toBeInTheDocument();
  });

  it('show placeholder when no fields provided', () => {
    render(<Navigation {...mockNavigationPropsEmpty} />);

    // Should show "[Navigation]" placeholder
    expect(screen.getByText('[Navigation]')).toBeInTheDocument();
  });

  it('not render nav element when no fields provided', () => {
    render(<Navigation {...mockNavigationPropsEmpty} />);

    // Should not have nav element
    const navElement = document.querySelector('nav');
    expect(navElement).toBeNull();
  });

  it('render hamburger menu element', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if hamburger exists
    const hamburger = document.querySelector('.menu-humburger');
    expect(hamburger).toBeInTheDocument();
  });

  it('render component-content wrapper', () => {
    render(<Navigation {...mockNavigationProps} />);

    // Check if component-content wrapper exists
    const contentDiv = document.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
  });
});
