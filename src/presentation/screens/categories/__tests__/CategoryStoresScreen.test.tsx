import React from "react";
import { Alert } from "react-native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { CategoryStoresScreen } from "../CategoryStoresScreen";
import { useAuthModeStore } from "../../../state/authModeStore";

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockToggleFavorite = jest.fn();
const mockSetQueryData = jest.fn();
const mockGetQueryData = jest.fn();
const mockRemoveQueries = jest.fn();
const mockUseInfiniteQuery = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: mockNavigate }),
  useRoute: () => ({ params: { categoryId: "cat-1", title: "Categorias", type: "category" } })
}));

jest.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: (...args: any[]) => mockUseInfiniteQuery(...args),
  useQueryClient: () => ({
    removeQueries: (...args: any[]) => mockRemoveQueries(...args),
    getQueryData: (...args: any[]) => mockGetQueryData(...args),
    setQueryData: (...args: any[]) => mockSetQueryData(...args)
  })
}));

jest.mock("../../../../app/providers/AppProvidersWithDI", () => ({
  useDependencies: () => ({
    getStoresByCategoryUseCase: { execute: jest.fn() },
    getNearbyPaginatedUseCase: { execute: jest.fn() },
    toggleFavoriteThriftStoreUseCase: { execute: (...args: any[]) => mockToggleFavorite(...args) }
  })
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null
}));

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: () => null
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

jest.mock("../../../../shared/theme", () => ({
  theme: { colors: { highlight: "#000", complementary: "#111" } }
}));

describe("CategoryStoresScreen", () => {
  const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthModeStore.getState().setMode("authenticated");
    mockUseInfiniteQuery.mockReturnValue({
      data: {
        pages: [
          {
            items: [
              {
                id: "store-1",
                name: "Brechó 1",
                addressLine: "Rua 1",
                images: [],
                categories: [],
                rating: 4.5,
                reviewCount: 10
              }
            ],
            page: 1,
            hasNext: false
          }
        ]
      },
      isLoading: false,
      isError: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      isRefetching: false,
      refetch: jest.fn()
    });
    mockToggleFavorite.mockResolvedValue(true);
    mockGetQueryData.mockReturnValue(undefined);
  });

  afterAll(() => {
    alertSpy.mockRestore();
  });

  it("renders loading state and navigates back", () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      isRefetching: false,
      refetch: jest.fn()
    });
    const { getByTestId } = render(<CategoryStoresScreen />);
    fireEvent.press(getByTestId("category-stores-back"));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("shows login alert on favorite when guest, then allows favorite after login", async () => {
    useAuthModeStore.getState().setMode("guest");

    const view = render(<CategoryStoresScreen />);
    const favButton = await waitFor(() => view.getByTestId("category-store-favorite-store-1"));

    fireEvent.press(favButton);
    expect(alertSpy).toHaveBeenCalledWith(
      "Faça login",
      "Faça login para favoritar este brechó.",
      expect.any(Array)
    );
    const buttons = alertSpy.mock.calls[0]?.[2] as { text: string; onPress?: () => void }[] | undefined;
    buttons?.find((b) => b.text === "Entrar")?.onPress?.();
    expect(mockNavigate).toHaveBeenCalledWith("login");

    act(() => {
      useAuthModeStore.getState().setMode("authenticated");
    });

    fireEvent.press(favButton);
    await waitFor(() => expect(mockToggleFavorite).toHaveBeenCalled());
  });
});
