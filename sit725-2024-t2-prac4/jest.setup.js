require("@testing-library/jest-dom");

// Mock leaflet
jest.mock("leaflet", () => ({
  map: jest.fn(),
  marker: jest.fn(),
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
    },
    mergeOptions: jest.fn(),
  },
}));

// Setup global fetch mock
global.fetch = jest.fn();
