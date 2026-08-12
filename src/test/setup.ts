import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement matchMedia; components that check
// prefers-reduced-motion need this to render at all under test.
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList
