import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Sitecore Content SDK
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
      },
      layout: {
        sitecore: {
          route: {
            fields: {
              Title: {
                value: 'Test Title',
              },
            },
          },
        },
      },
    },
  }),
  Text: ({ field, children, ...props }) => {
    if (field?.value) {
      return <span {...props}>{field.value}</span>;
    }
    return <span {...props}>{children}</span>;
  },
  Link: ({ field, children, ...props }) => {
    if (field?.value?.href) {
      return <a href={field.value.href} {...props}>{children}</a>;
    }
    return <span {...props}>{children}</span>;
  },
  Placeholder: ({ name, rendering, ...props }) => (
    <div data-testid={`placeholder-${name}`} {...props}>
      Placeholder: {name}
    </div>
  ),
  NextImage: ({ field, ...props }) => {
    if (field?.value?.src) {
      return <img src={field.value.src} alt={field.value.alt || ''} {...props} />;
    }
    return <img {...props} />;
  },
  RichText: ({ field, ...props }) => {
    if (field?.value) {
      return <div {...props} dangerouslySetInnerHTML={{ __html: field.value }} />;
    }
    return <div {...props} />;
  },
}));

// Suppress console warnings during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
