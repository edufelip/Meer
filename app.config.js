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
