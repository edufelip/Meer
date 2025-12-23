function normalizePlugins(plugins) {
  return Array.isArray(plugins) ? plugins : [];
}

function hasPlugin(plugins, pluginName) {
  return plugins.some((plugin) => (Array.isArray(plugin) ? plugin[0] === pluginName : plugin === pluginName));
}

function tryGetHostname(rawUrl) {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).host;
  } catch {
    return null;
  }
}

function isLocalHost(hostname) {
  if (!hostname) return false;
  const lower = hostname.toLowerCase();
  return (
    lower === "localhost" ||
    lower.startsWith("localhost:") ||
    lower === "127.0.0.1" ||
    lower.startsWith("127.0.0.1:") ||
    lower === "0.0.0.0" ||
    lower.startsWith("0.0.0.0:")
  );
}

function uniqStrings(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function ensureStoreIntentFilter(intentFilters, hostname) {
  if (!hostname) return intentFilters;
  const existing = Array.isArray(intentFilters) ? intentFilters : [];

  const alreadyHas = existing.some((filter) => {
    if (!filter || filter.action !== "VIEW") return false;
    const data = Array.isArray(filter.data) ? filter.data : [];
    return data.some((d) => d && d.scheme === "https" && d.host === hostname && d.pathPrefix === "/store");
  });

  if (alreadyHas) return existing;

  return [
    ...existing,
    {
      action: "VIEW",
      autoVerify: true,
      data: [{ scheme: "https", host: hostname, pathPrefix: "/store" }],
      category: ["BROWSABLE", "DEFAULT"]
    }
  ];
}

export default ({ config }) => {
  const webBaseUrl = process.env.EXPO_PUBLIC_WEB_BASE_URL;
  const hostname = tryGetHostname(webBaseUrl);
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const apiHost = tryGetHostname(apiBaseUrl);
  const allowLocalApi = process.env.EXPO_PUBLIC_ALLOW_LOCAL_API === "true";
  const isProdBuild = process.env.NODE_ENV === "production" || process.env.EAS_BUILD_PROFILE === "production";

  if (isProdBuild && !allowLocalApi && isLocalHost(apiHost)) {
    throw new Error(
      "EXPO_PUBLIC_API_BASE_URL points to a local host in a production build. Set a real API host or EXPO_PUBLIC_ALLOW_LOCAL_API=true."
    );
  }

  const plugins = normalizePlugins(config.plugins);
  const nextPlugins = [...plugins];

  if (!hasPlugin(nextPlugins, "@react-native-firebase/crashlytics")) {
    nextPlugins.push([
      "@react-native-firebase/crashlytics",
      {
        android: {
          // options: NONE | SYMBOL_TABLE | FULL
          nativeDebugSymbolLevel: "SYMBOL_TABLE"
        }
      }
    ]);
  }

  if (!hasPlugin(nextPlugins, "expo-build-properties")) {
    nextPlugins.push([
      "expo-build-properties",
      {
        android: {
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true
        }
      }
    ]);
  }

  return {
    ...config,
    ios: {
      ...config.ios,
      associatedDomains: hostname
        ? uniqStrings([...(config.ios?.associatedDomains ?? []), `applinks:${hostname}`])
        : config.ios?.associatedDomains
    },
    android: {
      ...config.android,
      package: "com.edufelip.meer",
      googleServicesFile: "./android/app/google-services.json",
      intentFilters: ensureStoreIntentFilter(config.android?.intentFilters, hostname)
    },
    plugins: nextPlugins
  };
};
