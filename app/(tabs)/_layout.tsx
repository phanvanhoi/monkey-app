import HapticTab from "@/components/ui/HapticTab"; // optional, nếu bạn có
import TabBarBackground from "@/components/ui/TabBarBackground"; // optional, nếu bạn có
import { Colors } from "@/constants/Colors"; // đảm bảo file này export Colors object
import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function TabLayout() {
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const fallback = useColorScheme();
  const colorScheme = ctxTheme ?? fallback ?? "light";

  const pal = Colors[colorScheme] ?? Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: pal.tint ?? "#ff6bcb",
        tabBarInactiveTintColor: pal.inactive ?? "#9ca3af",
        tabBarStyle: {
          backgroundColor:
            pal.background ?? (colorScheme === "dark" ? "#111214" : "#fff"),
          borderTopColor:
            pal.border ?? (colorScheme === "dark" ? "#222" : "#e6e6e6"),
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 78 : 64,
          paddingBottom: Platform.OS === "ios" ? 18 : 8,
          elevation: colorScheme === "dark" ? 6 : 2,
          shadowColor: colorScheme === "dark" ? "#000" : "#999",
        },
        tabBarBackground: TabBarBackground ? (
          <TabBarBackground color={pal.background} />
        ) : undefined,
        tabBarButton: HapticTab ?? undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size = 24 }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size = 24 }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      {/* ...other tabs... */}
    </Tabs>
  );
}
