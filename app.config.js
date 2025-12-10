export default ({ config }) => ({
  ...config,
  android: {
    package: "com.edufelip.meer",
    googleServicesFile: "./android/app/google-services.json",
  },
  plugins: [
    // React Native Firebase Crashlytics config plugin (handles mapping/native symbol upload)
    ["@react-native-firebase/crashlytics", {
      android: {
        // options: NONE | SYMBOL_TABLE | FULL
        nativeDebugSymbolLevel: "SYMBOL_TABLE"
      }
    }],
    // Optional: keep Proguard/shrink for release
    ["expo-build-properties", {
      android: {
        enableProguardInReleaseBuilds: true,
        enableShrinkResourcesInReleaseBuilds: true
      }
    }]
  ]
});
