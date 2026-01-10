import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { ContentDetailScreen } from "../ContentDetailScreen";
import { useAuthModeStore } from "../../../state/authModeStore";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

const mockGoBack = jest.fn();
const mockUseRoute = jest.fn();
const mockGetGuideContentById = jest.fn();
const mockGetContentComments = jest.fn();
const mockCreateContentComment = jest.fn();
const mockLikeContent = jest.fn();
const mockUnlikeContent = jest.fn();
const mockAlert = jest.spyOn(Alert, "alert").mockImplementation(() => {});

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: jest.fn() }),
  useRoute: () => mockUseRoute()
}));

const dependencies = {
  getGuideContentByIdUseCase: { execute: (...args: any[]) => mockGetGuideContentById(...args) },
  getContentCommentsUseCase: { execute: (...args: any[]) => mockGetContentComments(...args) },
  createContentCommentUseCase: { execute: (...args: any[]) => mockCreateContentComment(...args) },
  likeContentUseCase: { execute: (...args: any[]) => mockLikeContent(...args) },
  unlikeContentUseCase: { execute: (...args: any[]) => mockUnlikeContent(...args) }
};

jest.mock("../../../../app/providers/AppProvidersWithDI", () => ({
  useDependencies: () => dependencies
}));

describe("ContentDetailScreen", () => {
  let consoleSpy: jest.SpyInstance;
  const originalConsoleError = console.error;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      const shouldIgnore = args.some(
        (arg) => typeof arg === "string" && arg.includes("not wrapped in act")
      );
      if (shouldIgnore) return;
      originalConsoleError(...(args as [unknown, ...unknown[]]));
    });
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    mockAlert.mockRestore();
  });

  beforeEach(() => {
    mockGoBack.mockClear();
    mockGetGuideContentById.mockReset();
    mockGetContentComments.mockReset();
    mockCreateContentComment.mockReset();
    mockLikeContent.mockReset();
    mockUnlikeContent.mockReset();
    mockAlert.mockClear();
    useAuthModeStore.getState().setMode("authenticated");
    mockUseRoute.mockReturnValue({
      params: {
        content: {
          id: "content-1",
          title: "Guia",
          description: "Texto",
          imageUrl: "https://example.com/img.jpg",
          thriftStoreName: "Loja",
          createdAt: "2024-01-02T00:00:00.000Z"
        }
      }
    });
    mockGetContentComments.mockResolvedValue({ items: [], page: 0, hasNext: false });
  });

  it("renders content and handles back", () => {
    const { getByText, getByLabelText } = render(<ContentDetailScreen />);

    expect(getByText("Guia")).toBeTruthy();
    expect(getByText("Texto")).toBeTruthy();
    expect(getByText("Loja")).toBeTruthy();
    expect(getByText("Comentários")).toBeTruthy();

    fireEvent.press(getByLabelText("Voltar"));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("loads content by id when routed with a contentId", async () => {
    mockUseRoute.mockReturnValue({ params: { contentId: "content-2" } });
    mockGetGuideContentById.mockResolvedValue({
      id: "content-2",
      title: "Conteúdo 2",
      description: "Descrição 2",
      imageUrl: "https://example.com/img-2.jpg",
      thriftStoreName: "Loja 2",
      createdAt: "2024-01-03T00:00:00.000Z"
    });

    const view = render(<ContentDetailScreen />);

    await waitFor(() => expect(view.getByText("Conteúdo 2")).toBeTruthy());
    expect(mockGetGuideContentById).toHaveBeenCalledWith("content-2");
  });

  it("submits a comment when authenticated", async () => {
    mockCreateContentComment.mockResolvedValue({
      id: "comment-1",
      body: "Novo comentário",
      userId: "user-1",
      userDisplayName: "Eu",
      createdAt: "2024-01-02T12:00:00.000Z"
    });

    const view = render(<ContentDetailScreen />);
    const input = await waitFor(() => view.getByTestId("comment-input"));

    fireEvent.changeText(input, "Novo comentário");
    fireEvent.press(view.getByTestId("comment-send"));

    await waitFor(() =>
      expect(mockCreateContentComment).toHaveBeenCalledWith({ contentId: "content-1", body: "Novo comentário" })
    );
    await waitFor(() => expect(view.getByText("Novo comentário")).toBeTruthy());
  });

  it("shows login alert when trying to comment anonymously", async () => {
    useAuthModeStore.getState().setMode("guest");

    const view = render(<ContentDetailScreen />);
    const input = await waitFor(() => view.getByTestId("comment-input"));

    fireEvent.changeText(input, "Oi");
    fireEvent.press(view.getByTestId("comment-send"));

    await waitFor(() =>
      expect(mockAlert).toHaveBeenCalledWith(
        "Faça login",
        "Faça login para comentar.",
        expect.any(Array)
      )
    );
    expect(mockCreateContentComment).not.toHaveBeenCalled();
  });

  it("optimistically updates likes", async () => {
    let resolveLike: () => void;
    const likePromise = new Promise<void>((resolve) => {
      resolveLike = resolve;
    });
    mockLikeContent.mockReturnValue(likePromise);

    const view = render(<ContentDetailScreen />);
    const likeButton = await waitFor(() => view.getByTestId("content-like-button"));

    expect(view.getByTestId("content-like-count").props.children).toBe(0);

    fireEvent.press(likeButton);

    await waitFor(() => expect(view.getByTestId("content-like-count").props.children).toBe(1));
    expect(mockLikeContent).toHaveBeenCalledWith("content-1");

    resolveLike!();
  });

  it("shows login alert when guest tries to like", async () => {
    useAuthModeStore.getState().setMode("guest");
    const view = render(<ContentDetailScreen />);
    const likeButton = await waitFor(() => view.getByTestId("content-like-button"));

    fireEvent.press(likeButton);

    await waitFor(() =>
      expect(mockAlert).toHaveBeenCalledWith(
        "Faça login",
        "Faça login para curtir.",
        expect.any(Array)
      )
    );
    expect(mockLikeContent).not.toHaveBeenCalled();
  });
});
