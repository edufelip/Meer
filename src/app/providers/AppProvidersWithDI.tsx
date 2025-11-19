import React, { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { AsyncStorageUserLocalDataSource } from "../../data/datasources/impl/AsyncStorageUserLocalDataSource";
import { UserRepositoryImpl } from "../../data/repositories/UserRepositoryImpl";
import { InMemoryThriftStoreRepository } from "../../data/repositories/InMemoryThriftStoreRepository";
import { InMemoryGuideContentRepository } from "../../data/repositories/InMemoryGuideContentRepository";
import { GetCurrentUserUseCase } from "../../domain/usecases/GetCurrentUserUseCase";
import { GetFeaturedThriftStoresUseCase } from "../../domain/usecases/GetFeaturedThriftStoresUseCase";
import { GetNearbyThriftStoresUseCase } from "../../domain/usecases/GetNearbyThriftStoresUseCase";
import { GetGuideContentUseCase } from "../../domain/usecases/GetGuideContentUseCase";
import { GetFavoriteThriftStoresUseCase } from "../../domain/usecases/GetFavoriteThriftStoresUseCase";

interface Dependencies {
  getCurrentUserUseCase: GetCurrentUserUseCase;
  getFeaturedThriftStoresUseCase: GetFeaturedThriftStoresUseCase;
  getNearbyThriftStoresUseCase: GetNearbyThriftStoresUseCase;
  getGuideContentUseCase: GetGuideContentUseCase;
  getFavoriteThriftStoresUseCase: GetFavoriteThriftStoresUseCase;
}

const DependenciesContext = createContext<Dependencies | undefined>(undefined);

export function useDependencies(): Dependencies {
  const ctx = useContext(DependenciesContext);
  if (!ctx) {
    throw new Error("useDependencies must be used within DependenciesProvider");
  }
  return ctx;
}

export function DependenciesProvider(props: PropsWithChildren) {
  const { children } = props;

  const value = useMemo<Dependencies>(() => {
    const userLocalDataSource = new AsyncStorageUserLocalDataSource();
    const userRepository = new UserRepositoryImpl(userLocalDataSource);
    const thriftStoreRepository = new InMemoryThriftStoreRepository();
    const guideContentRepository = new InMemoryGuideContentRepository();

    const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
    const getFeaturedThriftStoresUseCase = new GetFeaturedThriftStoresUseCase(thriftStoreRepository);
    const getNearbyThriftStoresUseCase = new GetNearbyThriftStoresUseCase(thriftStoreRepository);
    const getGuideContentUseCase = new GetGuideContentUseCase(guideContentRepository);
    const getFavoriteThriftStoresUseCase = new GetFavoriteThriftStoresUseCase(thriftStoreRepository);

    return {
      getCurrentUserUseCase,
      getFeaturedThriftStoresUseCase,
      getNearbyThriftStoresUseCase,
      getGuideContentUseCase,
      getFavoriteThriftStoresUseCase
    };
  }, []);

  return <DependenciesContext.Provider value={value}>{children}</DependenciesContext.Provider>;
}
