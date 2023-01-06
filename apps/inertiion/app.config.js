module.exports = {
  expo: {
    name: "inertiion",
    slug: "inertiion",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: "d6ba2225-1f90-404d-a89b-2d2ecea284db",
      },
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/d6ba2225-1f90-404d-a89b-2d2ecea284db",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.ozahnitko.inertiion",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
