import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Image, Banner } from '../../../components/image/Image';
import {
  mockImagePropsComplete,
  mockImagePropsNoLink,
  mockImagePropsNoFields,
  mockBannerProps,
} from './mockProps';

describe('Image Component should', () => {
  it('render without crashing', () => {
    render(<Image {...mockImagePropsComplete} />);

    // Check if the component renders
    const imageElement = screen.getByAltText('Test Image Alt Text');
    expect(imageElement).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Image {...mockImagePropsComplete} />);

    // Check if the component has the right CSS classes
    const componentDiv = screen.getByAltText('Test Image Alt Text').closest('.component');
    expect(componentDiv).toHaveClass('component', 'image', 'image-styles');
  });

  it('have correct ID attribute', () => {
    render(<Image {...mockImagePropsComplete} />);

    // Check if the component has the right ID
    const componentDiv = screen.getByAltText('Test Image Alt Text').closest('.component');
    expect(componentDiv).toHaveAttribute('id', 'image-test-id');
  });

  it('render image with correct src and alt attributes', () => {
    render(<Image {...mockImagePropsComplete} />);

    // Check if image has correct attributes
    const imageElement = screen.getByAltText('Test Image Alt Text');
    expect(imageElement).toHaveAttribute('src', '/test-image.jpg');
    expect(imageElement).toHaveAttribute('alt', 'Test Image Alt Text');
  });

  it('render image caption', () => {
    render(<Image {...mockImagePropsComplete} />);

    // Check if caption is rendered
    const captionElement = screen.getByText('This is a test image caption');
    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveClass('image-caption', 'field-imagecaption');
  });

  it('wrap image in link when TargetUrl is provided', () => {
    render(<Image {...mockImagePropsComplete} />);

    // In preview mode (not editing), image should be wrapped in a link
    const imageElement = screen.getByAltText('Test Image Alt Text');
    const linkElement = imageElement.closest('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test-link');
  });

  it('not wrap image in link when TargetUrl is empty', () => {
    render(<Image {...mockImagePropsNoLink} />);

    // Without TargetUrl, image should NOT be wrapped in a link
    const imageElement = screen.getByAltText('Image without link');
    const linkElement = imageElement.closest('a');
    expect(linkElement).toBeNull();
  });

  it('show empty hint when no fields are provided', () => {
    render(<Image {...mockImagePropsNoFields} />);

    // Should show "Image" text as empty hint
    const emptyHint = screen.getByText('Image');
    expect(emptyHint).toBeInTheDocument();
    expect(emptyHint).toHaveClass('is-empty-hint');
  });

  it('render with different styles when no fields provided', () => {
    render(<Image {...mockImagePropsNoFields} />);

    // Check if empty state has correct styles
    const componentDiv = screen.getByText('Image').closest('.component');
    expect(componentDiv).toHaveClass('component', 'image', 'image-empty-styles');
  });
});

describe('Banner Component should', () => {
  it('render without crashing', () => {
    render(<Banner {...mockBannerProps} />);

    // Banner should have specific class
    const bannerDiv = document.querySelector('.hero-banner');
    expect(bannerDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes for banner', () => {
    render(<Banner {...mockBannerProps} />);

    // Check if banner has correct classes
    const bannerDiv = document.querySelector('.hero-banner');
    expect(bannerDiv).toHaveClass('component', 'hero-banner', 'banner-styles');
  });

  it('have correct ID attribute for banner', () => {
    render(<Banner {...mockBannerProps} />);

    // Check if banner has the right ID
    const bannerDiv = document.querySelector('.hero-banner');
    expect(bannerDiv).toHaveAttribute('id', 'banner-test-id');
  });

  it('apply background image style', () => {
    render(<Banner {...mockBannerProps} />);

    // Check if background image style is applied
    const contentDiv = document.querySelector('.sc-sxa-image-hero-banner');
    expect(contentDiv).toHaveStyle({ backgroundImage: "url('/banner-background.jpg')" });
  });
});
