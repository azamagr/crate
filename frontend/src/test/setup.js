import "@testing-library/jest-dom";

// jsdom doesn't implement matchMedia — polyfill it so components that
// check the user's system theme preference (useTheme) don't crash in tests.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
