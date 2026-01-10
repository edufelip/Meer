import React from "react";
import { Alert } from "react-native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { ThriftDetailScreen } from "../ThriftDetailScreen";
import { useFavoritesStore } from "../../../state/favoritesStore";
import { useStoreSummaryStore } from "../../../state/storeSummaryStore";
import { useAuthModeStore } from "../../../state/authModeStore";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: jest.fn(), navigate: mockNavigate })
}));

const mockGetStore = jest.fn();
const mockGetFeatured = jest.fn();
const mockToggleFavorite = jest.fn();
const mockIsFavorite = jest.fn();
const mockGetFeedback = jest.fn();
const mockUpsertFeedback = jest.fn();
const mockDeleteFeedback = jest.fn();

jest.mock("../../../../app/providers/AppProvidersWithDI", () => ({
  useDependencies: () => ({
    getThriftStoreByIdUseCase: {
      execute: (...args: any[]) => mockGetStore(...args)
    },
    getFeaturedThriftStoresUseCase: { execute: (...args: any[]) => mockGetFeatured(...args) },
    toggleFavoriteThriftStoreUseCase: { execute: (...args: any[]) => mockToggleFavorite(...args) },
    isFavoriteThriftStoreUseCase: { execute: (...args: any[]) => mockIsFavorite(...args) },
    getMyFeedbackUseCase: { execute: (...args: any[]) => mockGetFeedback(...args) },
    upsertFeedbackUseCase: { execute: (...args: any[]) => mockUpsertFeedback(...args) },
    deleteMyFeedbackUseCase: { execute: (...args: any[]) => mockDeleteFeedback(...args) }
  })
}));

jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 })
}));

jest.mock("react-native-image-viewing", () => ({
  __esModule: true,
  default: () => null
}));

jest.mock("../../../../shared/theme", () => ({
  theme: { colors: { highlight: "#000", complementary: "#111" } }
}));

jest.mock("../../../../shared/deepLinks", () => ({
  buildThriftStoreShareUrl: jest.fn().mockReturnValue("app://store")
}));

describe("ThriftDetailScreen", () => {
  const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthModeStore.getState().setMode("authenticated");
    useFavoritesStore.getState().reset();
    useStoreSummaryStore.getState().reset();
    mockGetStore.mockResolvedValue({
      id: "s1",
      name: "Brecho Central",
      addressLine: "Rua A",
      images: [],
      categories: [],
      rating: 4.5
    });
    mockGetFeatured.mockResolvedValue([]);
    mockToggleFavorite.mockResolvedValue(undefined);
    mockIsFavorite.mockResolvedValue(false);
    mockGetFeedback.mockResolvedValue(null);
    mockUpsertFeedback.mockResolvedValue(undefined);
    mockDeleteFeedback.mockResolvedValue(undefined);
  });

  afterAll(() => {
    alertSpy.mockRestore();
  });

  it("renders thrift store details", async () => {
    const { getByText } = render(<ThriftDetailScreen route={{ params: { id: "s1" } }} />);
    await waitFor(() => expect(getByText("Brecho Central")).toBeTruthy());
  });

  it("shows login alert on rating when guest, then allows rating after login", async () => {
    useAuthModeStore.getState().setMode("guest");
    const view = render(<ThriftDetailScreen route={{ params: { id: "s1" } }} />);

    const star = await waitFor(() => view.getByLabelText("Dar nota 5"));
    fireEvent.press(star);

    expect(alertSpy).toHaveBeenCalledWith(
      "Faça login",
      "Faça login para avaliar este brechó.",
      expect.any(Array)
    );
    const buttons = alertSpy.mock.calls[0]?.[2] as { text: string; onPress?: () => void }[] | undefined;
    buttons?.find((b) => b.text === "Entrar")?.onPress?.();
    expect(mockNavigate).toHaveBeenCalledWith("login");

    act(() => {
      useAuthModeStore.getState().setMode("authenticated");
    });

    fireEvent.press(star);
    const input = await waitFor(() => view.getByPlaceholderText("Escreva seu comentário aqui..."));
    fireEvent.changeText(input, "Comentário com mais de 20 chars.");
    fireEvent.press(view.getByText("Enviar Avaliação"));

    await waitFor(() =>
      expect(mockUpsertFeedback).toHaveBeenCalledWith({
        storeId: "s1",
        score: 5,
        body: "Comentário com mais de 20 chars."
      })
    );
  });
});
