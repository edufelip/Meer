import urls from "../../../../constants/urls.json";
import { getWwwBaseUrl } from "../../../shared/deepLinks";

const loadLinking = () => jest.requireActual("../linking");

const mockCreateURL = jest.fn((path: string) => `app:///${String(path).replace(/^\/?/, "")}`);

jest.mock("expo-linking", () => ({
  createURL: (path: string) => mockCreateURL(path)
}));

describe("linking", () => {
  beforeEach(() => {
    jest.resetModules();
    mockCreateURL.mockClear();
  });

  it("includes default prefixes and the web base url", () => {
    const { linking } = loadLinking();
    const expected = ["app:///", "meer://", "exp+meer://", urls.webBaseUrl];
    const wwwBaseUrl = getWwwBaseUrl();
    if (wwwBaseUrl && wwwBaseUrl !== urls.webBaseUrl) expected.push(wwwBaseUrl);
    expect(linking.prefixes).toEqual(expected);
    expect(mockCreateURL).toHaveBeenCalledWith("/");
  });
});
