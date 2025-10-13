import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Default as Container } from '../../../components/container/Container';
import {
  mockContainerPropsWithBackground,
  mockContainerPropsNoBackground,
  mockContainerPropsWithWrapper,
  mockContainerPropsWithoutWrapper,
  mockContainerPropsDifferentPlaceholder,
  mockContainerPropsEmpty,
} from './Container.mockProps';

describe('Container Component should', () => {
  it('render without crashing', () => {
    render(<Container {...mockContainerPropsWithBackground} />);

    // Check if the component renders
    const containerDiv = document.querySelector('.container-default');
    expect(containerDiv).toBeInTheDocument();
  });

  it('apply correct CSS classes', () => {
    render(<Container {...mockContainerPropsWithBackground} />);

    // Check if the component has the right CSS classes
    const containerDiv = document.querySelector('.container-default');
    expect(containerDiv).toHaveClass('component', 'container-default', 'container-styles');
  });

  it('have correct ID attribute', () => {
    render(<Container {...mockContainerPropsWithBackground} />);

    // Check if the component has the right ID
    const containerDiv = document.querySelector('.container-default');
    expect(containerDiv).toHaveAttribute('id', 'container-test-id');
  });

  it('extract and apply background image from BackgroundImage parameter', () => {
    render(<Container {...mockContainerPropsWithBackground} />);

    // Check if background image style is applied correctly
    const contentDiv = document.querySelector('.component-content');
    expect(contentDiv).toHaveStyle({ backgroundImage: "url('/path/to/background.jpg')" });
  });

  it('not apply background image when BackgroundImage is undefined', () => {
    render(<Container {...mockContainerPropsNoBackground} />);

    // Should not have background image style
    const contentDiv = document.querySelector('.component-content');
    expect(contentDiv).not.toHaveStyle({ backgroundImage: "url('/path/to/background.jpg')" });
  });

  it('render Placeholder component with correct name', () => {
    render(<Container {...mockContainerPropsWithBackground} />);

    // Placeholder should be rendered with correct name
    const placeholder = screen.getByTestId('placeholder-container-1');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Placeholder: container-1');
  });

  it('render Placeholder with different DynamicPlaceholderId', () => {
    render(<Container {...mockContainerPropsDifferentPlaceholder} />);

    // Placeholder should use the DynamicPlaceholderId
    const placeholder = screen.getByTestId('placeholder-container-99');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Placeholder: container-99');
  });

  it('render with container-wrapper when styles include "container"', () => {
    render(<Container {...mockContainerPropsWithWrapper} />);

    // Should have container-wrapper div
    const wrapperDiv = document.querySelector('.container-wrapper');
    expect(wrapperDiv).toBeInTheDocument();
  });

  it('not render container-wrapper when styles do not include "container"', () => {
    render(<Container {...mockContainerPropsWithoutWrapper} />);

    // Should NOT have container-wrapper div
    const wrapperDiv = document.querySelector('.container-wrapper');
    expect(wrapperDiv).toBeNull();
  });

  it('render row div inside component-content', () => {
    render(<Container {...mockContainerPropsWithBackground} />);

    // Should have row div
    const rowDiv = document.querySelector('.row');
    expect(rowDiv).toBeInTheDocument();
  });

  it('apply different styles correctly', () => {
    render(<Container {...mockContainerPropsNoBackground} />);

    // Check if component has different styles
    const containerDiv = document.querySelector('.container-default');
    expect(containerDiv).toHaveClass('component', 'container-default', 'no-bg-styles');
  });

  it('handle multiple classes in styles parameter', () => {
    render(<Container {...mockContainerPropsWithWrapper} />);

    // Should apply all classes from styles
    const containerDiv = document.querySelector('.container-default');
    expect(containerDiv).toHaveClass('component', 'container-default', 'container', 'other-class');
  });
});

describe('Container Component Error Handling should', () => {
  it('handle missing BackgroundImage parameter', () => {
    const propsWithoutBg = {
      ...mockContainerPropsNoBackground,
      params: {
        ...mockContainerPropsNoBackground.params,
        BackgroundImage: undefined,
      },
    };
    render(<Container {...propsWithoutBg} />);

    // Should render without background style
    const contentDiv = document.querySelector('.component-content');
    expect(contentDiv).toBeInTheDocument();
  });

  it('handle invalid mediaurl format', () => {
    const propsWithInvalidUrl = {
      ...mockContainerPropsWithBackground,
      params: {
        ...mockContainerPropsWithBackground.params,
        BackgroundImage: 'invalid-format',
      },
    };
    render(<Container {...propsWithInvalidUrl} />);

    // Should render without crashing
    const containerDiv = document.querySelector('.container-default');
    expect(containerDiv).toBeInTheDocument();
  });

  it('handle empty DynamicPlaceholderId', () => {
    const propsWithEmptyId = {
      ...mockContainerPropsWithBackground,
      params: {
        ...mockContainerPropsWithBackground.params,
        DynamicPlaceholderId: '',
      },
    };
    render(<Container {...propsWithEmptyId} />);

    // Should still render placeholder with empty id
    const placeholder = screen.getByTestId('placeholder-container-');
    expect(placeholder).toBeInTheDocument();
  });

  it('render without styles parameter', () => {
    const propsWithoutStyles = {
      ...mockContainerPropsWithBackground,
      params: {
        ...mockContainerPropsWithBackground.params,
        styles: undefined as any,
      },
    };
    render(<Container {...propsWithoutStyles} />);

    // Should render with only default classes
    const containerDiv = document.querySelector('.container-default');
    expect(containerDiv).toBeInTheDocument();
  });
});
