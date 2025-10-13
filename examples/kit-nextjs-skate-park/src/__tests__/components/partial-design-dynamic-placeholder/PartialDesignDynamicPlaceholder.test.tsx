import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PartialDesignDynamicPlaceholder from '../../../components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import {
  mockPartialDesignProps,
  mockPartialDesignPropsFooter,
  mockPartialDesignPropsComplex,
  mockPartialDesignPropsNoSig,
  mockPartialDesignPropsEmpty,
} from './mockProps';

describe('PartialDesignDynamicPlaceholder Component should', () => {
  it('render without crashing', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignProps} />);

    // Check if the placeholder renders
    const placeholder = screen.getByTestId('placeholder-header-partial');
    expect(placeholder).toBeInTheDocument();
  });

  it('render placeholder with signature from params', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignProps} />);

    // Check if placeholder has correct name
    const placeholder = screen.getByTestId('placeholder-header-partial');
    expect(placeholder).toHaveTextContent('Placeholder: header-partial');
  });

  it('render different placeholder based on different signature', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignPropsFooter} />);

    // Check if placeholder has footer signature
    const placeholder = screen.getByTestId('placeholder-footer-partial');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Placeholder: footer-partial');
  });

  it('render placeholder with complex signature including wildcards', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignPropsComplex} />);

    // Check if placeholder handles complex signature
    const placeholder = screen.getByTestId('placeholder-main-content-{*}');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Placeholder: main-content-{*}');
  });

  it('render placeholder with empty string when no signature provided', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignPropsNoSig} />);

    // When no sig, should use empty string
    const placeholder = screen.getByTestId('placeholder-');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveTextContent('Placeholder:');
  });

  it('render placeholder with empty string when signature is empty', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignPropsEmpty} />);

    // Empty signature should render empty placeholder name
    const placeholder = screen.getByTestId('placeholder-');
    expect(placeholder).toBeInTheDocument();
  });

  it('pass rendering prop to Placeholder component', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignProps} />);

    // Placeholder should exist (which means rendering prop was passed)
    const placeholder = screen.getByTestId('placeholder-header-partial');
    expect(placeholder).toBeInTheDocument();
  });

  it('handle signature from rendering.params.sig path', () => {
    render(<PartialDesignDynamicPlaceholder {...mockPartialDesignProps} />);

    // Verify the sig from rendering.params is used
    const placeholder = screen.getByTestId('placeholder-header-partial');
    expect(placeholder).toBeInTheDocument();
  });
});
