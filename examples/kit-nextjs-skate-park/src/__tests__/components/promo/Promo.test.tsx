import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Promo, WithText as PromoWithText } from '../../../components/promo/Promo';
import {
  mockPromoPropsDefault,
  mockPromoPropsWithText,
  mockPromoPropsMinimal,
  mockPromoPropsNoFields,
} from './Promo.mockProps';

describe('Promo Component (Default variant) should', () => {
  it('render without crashing', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if the component renders
    const promoDiv = document.querySelector('.promo');
    expect(promoDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if the component has the right CSS classes
    const promoDiv = document.querySelector('.promo');
    expect(promoDiv).toHaveClass('component', 'promo', 'promo-styles');
  });

  it('have correct ID attribute', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if the component has the right ID
    const promoDiv = document.querySelector('.promo');
    expect(promoDiv).toHaveAttribute('id', 'promo-test-id');
  });

  it('render promo icon with correct attributes', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if icon is rendered
    const iconImage = screen.getByAltText('Promo Icon');
    expect(iconImage).toBeInTheDocument();
    expect(iconImage).toHaveAttribute('src', '/promo-icon.png');
  });

  it('render promo icon inside field-promoicon div', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if icon wrapper exists
    const iconDiv = document.querySelector('.field-promoicon');
    expect(iconDiv).toBeInTheDocument();
  });

  it('render promotional text with HTML formatting', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if text is rendered with formatting
    const emphasisText = screen.getByText('emphasis');
    expect(emphasisText).toBeInTheDocument();
    expect(emphasisText.tagName).toBe('STRONG');
  });

  it('render promotional text inside field-promotext div', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if text wrapper exists
    const textDiv = document.querySelector('.field-promotext');
    expect(textDiv).toBeInTheDocument();
  });

  it('render promo link', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if link is rendered
    const linkElement = screen.getByText('Learn More');
    expect(linkElement).toBeInTheDocument();
  });

  it('render promo link inside field-promolink div', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if link wrapper exists
    const linkDiv = document.querySelector('.field-promolink');
    expect(linkDiv).toBeInTheDocument();
  });

  it('render promo-text wrapper div', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if promo-text wrapper exists
    const promoTextDiv = document.querySelector('.promo-text');
    expect(promoTextDiv).toBeInTheDocument();
  });

  it('render component-content div', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Check if component-content wrapper exists
    const contentDiv = document.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
  });

  it('show empty hint when no fields are provided', () => {
    render(<Promo {...mockPromoPropsNoFields} />);

    // Should show "Promo" as empty hint
    const emptyHint = screen.getByText('Promo');
    expect(emptyHint).toBeInTheDocument();
    expect(emptyHint).toHaveClass('is-empty-hint');
  });

  it('render with minimal fields', () => {
    render(<Promo {...mockPromoPropsMinimal} />);

    // Should still render with minimal data
    const promoDiv = document.querySelector('.promo');
    expect(promoDiv).toBeInTheDocument();
    
    const iconImage = screen.getByAltText('Minimal Icon');
    expect(iconImage).toBeInTheDocument();
  });
});

describe('Promo Component (WithText variant) should', () => {
  it('render without crashing', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);

    // Check if the component renders
    const promoDiv = document.querySelector('.promo');
    expect(promoDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes for WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);

    // Check if the component has the right CSS classes
    const promoDiv = document.querySelector('.promo');
    expect(promoDiv).toHaveClass('component', 'promo', 'promo-withtext-styles');
  });

  it('have correct ID attribute for WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);

    // Check if the component has the right ID
    const promoDiv = document.querySelector('.promo');
    expect(promoDiv).toHaveAttribute('id', 'promo-withtext-id');
  });

  it('render promo icon in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);

    // Check if icon is rendered
    const iconImage = screen.getByAltText('Promo Icon 2');
    expect(iconImage).toBeInTheDocument();
    expect(iconImage).toHaveAttribute('src', '/promo-icon-2.png');
  });

  it('render both PromoText fields in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);

    // Check if both text fields are rendered
    const firstText = screen.getByText('First promotional text.');
    expect(firstText).toBeInTheDocument();

    const secondText = screen.getByText('Second promotional text for WithText variant.');
    expect(secondText).toBeInTheDocument();
  });

  it('render two field-promotext divs in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);

    // Should have two field-promotext divs (one for each text field)
    const textDivs = document.querySelectorAll('.field-promotext');
    expect(textDivs).toHaveLength(2);
  });

  it('not render field-promolink div in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);

    // WithText variant does not render the link
    const linkDiv = document.querySelector('.field-promolink');
    expect(linkDiv).toBeNull();
  });

  it('render promo-text class in WithText variant', () => {
    render(<PromoWithText {...mockPromoPropsWithText} />);

    // Check if promo-text classes are applied
    const promoTextElements = document.querySelectorAll('.promo-text');
    expect(promoTextElements.length).toBeGreaterThan(0);
  });
});

describe('Promo Component Accessibility should', () => {
  it('have accessible images with alt text', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Image should have alt text
    const image = screen.getByRole('img', { name: /Promo Icon/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Promo Icon');
  });

  it('have accessible links in Default variant', () => {
    render(<Promo {...mockPromoPropsDefault} />);

    // Link should be accessible
    const link = screen.getByRole('link', { name: /Learn More/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/promo-link');
  });

  it('provide meaningful image descriptions', () => {
    render(<Promo {...mockPromoPropsWithText} />);

    // Images should have descriptive alt text
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt');
    expect(image.getAttribute('alt')).toBeTruthy();
  });
});
