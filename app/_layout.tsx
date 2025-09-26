import { ThemeProvider, useOptionalAppTheme } from "@/contexts/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { login } from "@/services";
import { setAuthToken } from "@/utils/auth";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import "react-native-reanimated";

function InnerAppContent() {
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const scheme = ctxTheme ?? fallback ?? "light";

  const callAPI = async () => {
    try {
      const resp = await login("admin@admin.vn", "Admin@1235!!");
      const token = resp.data?.token;
      if (token) await setAuthToken(token);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  if (!loaded) return null;

  return (
    <ThemeProvider>
      <InnerAppContent />
    </ThemeProvider>
  );
}
