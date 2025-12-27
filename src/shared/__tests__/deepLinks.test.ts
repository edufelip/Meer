import urls from "../../../constants/urls.json";

const loadDeepLinks = () => jest.requireActual("../deepLinks");

const mockCreateURL = jest.fn((path: string) => `app:///${path}`);

jest.mock("expo-linking", () => ({
  createURL: (path: string) => mockCreateURL(path)
}));

describe("deepLinks", () => {
  beforeEach(() => {
    jest.resetModules();
    mockCreateURL.mockClear();
  });

  it("builds store paths with encoding", () => {
    const { buildThriftStorePath } = loadDeepLinks();
    expect(buildThriftStorePath("abc/123")).toBe("store/abc%2F123");
  });

  it("returns the web base url", () => {
    const { getWebBaseUrl } = loadDeepLinks();
    expect(getWebBaseUrl()).toBe(urls.webBaseUrl);
  });

  it("uses web base url for share links", () => {
    const { buildThriftStoreShareUrl } = loadDeepLinks();
    expect(buildThriftStoreShareUrl("store-1")).toBe(`${urls.webBaseUrl}/store/store-1`);
  });
});
