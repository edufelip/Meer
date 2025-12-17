import type { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { getWebBaseUrl } from "../../shared/deepLinks";
import type { RootStackParamList } from "./RootStack";

const prefixes = (() => {
  const items = [Linking.createURL("/"), "meer://", "exp+meer://"];
  const webBaseUrl = getWebBaseUrl();
  if (webBaseUrl) items.push(webBaseUrl);
  return items;
})();

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes,
  config: {
    screens: {
      login: "login",
      signup: "signup",
      tabs: {
        screens: {
          home: "home",
          favorites: "favorites",
          categories: "categories",
          profile: "profile"
        }
      },
      thriftDetail: "store/:id",
      search: "search",
      contact: "contact"
    }
  }
};

