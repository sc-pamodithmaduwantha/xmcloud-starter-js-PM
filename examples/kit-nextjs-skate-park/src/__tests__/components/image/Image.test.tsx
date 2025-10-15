import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Image, Banner } from '../../../components/image/Image';
import {
  mockImagePropsComplete,
  mockImagePropsNoLink,
  mockImagePropsNoFields,
  mockBannerProps,
} from './Image.mockProps';

const getImageComponent = (altText: string) => screen.getByAltText(altText).closest('.component');

describe('Image Component should', () => {
  it('render without crashing', () => {
    render(<Image {...mockImagePropsComplete} />);
    expect(screen.getByAltText('Test Image Alt Text')).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Image {...mockImagePropsComplete} />);
    expect(getImageComponent('Test Image Alt Text')).toHaveClass('component', 'image', 'image-styles');
  });

  it('have correct ID attribute', () => {
    render(<Image {...mockImagePropsComplete} />);
    expect(getImageComponent('Test Image Alt Text')).toHaveAttribute('id', 'image-test-id');
  });

  it('render image with correct src and alt attributes', () => {
    render(<Image {...mockImagePropsComplete} />);
    const imageElement = screen.getByAltText('Test Image Alt Text');
    expect(imageElement).toHaveAttribute('src', '/test-image.jpg');
    expect(imageElement).toHaveAttribute('alt', 'Test Image Alt Text');
  });

  it('render image caption', () => {
    render(<Image {...mockImagePropsComplete} />);
    const captionElement = screen.getByText('This is a test image caption');
    expect(captionElement).toBeInTheDocument();
    expect(captionElement).toHaveClass('image-caption', 'field-imagecaption');
  });

  it('wrap image in link when TargetUrl is provided', () => {
    render(<Image {...mockImagePropsComplete} />);
    const linkElement = screen.getByAltText('Test Image Alt Text').closest('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test-link');
  });

  it('not wrap image in link when TargetUrl is empty', () => {
    render(<Image {...mockImagePropsNoLink} />);
    expect(screen.getByAltText('Image without link').closest('a')).toBeNull();
  });

  it('show empty hint when no fields are provided', () => {
    render(<Image {...mockImagePropsNoFields} />);
    const emptyHint = screen.getByText('Image');
    expect(emptyHint).toBeInTheDocument();
    expect(emptyHint).toHaveClass('is-empty-hint');
  });

  it('render with different styles when no fields provided', () => {
    render(<Image {...mockImagePropsNoFields} />);
    expect(screen.getByText('Image').closest('.component')).toHaveClass('component', 'image', 'image-empty-styles');
  });
});

describe('Banner Component should', () => {
  const getBannerDiv = () => document.querySelector('.hero-banner');

  it('render without crashing', () => {
    render(<Banner {...mockBannerProps} />);
    expect(getBannerDiv()).toBeInTheDocument();
  });

  it('apply correct CSS classes for banner', () => {
    render(<Banner {...mockBannerProps} />);
    expect(getBannerDiv()).toHaveClass('component', 'hero-banner', 'banner-styles');
  });

  it('have correct ID attribute for banner', () => {
    render(<Banner {...mockBannerProps} />);
    expect(getBannerDiv()).toHaveAttribute('id', 'banner-test-id');
  });

  it('apply background image style', () => {
    render(<Banner {...mockBannerProps} />);
    expect(document.querySelector('.sc-sxa-image-hero-banner')).toHaveStyle({ backgroundImage: "url('/banner-background.jpg')" });
  });
});

describe('Image Component Accessibility should', () => {
  it('have alt text for images', () => {
    render(<Image {...mockImagePropsComplete} />);
    const image = screen.getByRole('img', { name: /Test Image Alt Text/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Test Image Alt Text');
  });

  it('provide meaningful alt text', () => {
    render(<Image {...mockImagePropsNoLink} />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Image without link');
  });

  it('have accessible links when wrapping images', () => {
    render(<Image {...mockImagePropsComplete} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test-link');
  });

  it('maintain alt text even when image is a link', () => {
    render(<Image {...mockImagePropsComplete} />);
    expect(screen.getByRole('img')).toHaveAttribute('alt');
  });
});

describe('Image Component Edge Cases should', () => {
  it('render correct DOM structure', () => {
    render(<Image {...mockImagePropsComplete} />);
    const container = getImageComponent('Test Image Alt Text');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('component', 'image');
    
    const contentDiv = container?.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
    
    const imageElement = screen.getByAltText('Test Image Alt Text');
    expect(imageElement).toBeInTheDocument();
  });

  it('handle missing params gracefully', () => {
    const propsWithoutParams = {
      ...mockImagePropsComplete,
      params: {} as any,
    };
    
    render(<Image {...propsWithoutParams} />);
    expect(screen.getByAltText('Test Image Alt Text')).toBeInTheDocument();
  });

  it('handle null fields gracefully', () => {
    const propsWithNullFields = {
      ...mockImagePropsComplete,
      fields: null as any,
    };
    
    render(<Image {...propsWithNullFields} />);
    const component = document.querySelector('.component.image');
    expect(component).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
  });

  it('handle undefined fields gracefully', () => {
    const propsWithUndefinedFields = {
      ...mockImagePropsComplete,
      fields: undefined as any,
    };
    
    render(<Image {...propsWithUndefinedFields} />);
    const component = document.querySelector('.component.image');
    expect(component).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
  });

  it('handle missing image field', () => {
    const propsWithoutImage = {
      ...mockImagePropsComplete,
      fields: {
        ImageCaption: mockImagePropsComplete.fields.ImageCaption,
        TargetUrl: mockImagePropsComplete.fields.TargetUrl,
      } as any,
    };
    
    render(<Image {...propsWithoutImage} />);
    const component = document.querySelector('.component.image');
    expect(component).toBeInTheDocument();
    expect(screen.getByText('This is a test image caption')).toBeInTheDocument();
  });
});
