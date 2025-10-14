import { useOptionalAppTheme } from "@/contexts/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type HeaderProps = {
  onToggleTheme?: () => void;
};

export default function Header({ onToggleTheme }: HeaderProps) {
  // Try context first (if ThemeProvider present)
  const optionalTheme = useOptionalAppTheme();
  const ctxTheme = optionalTheme?.theme;
  const toggleFromContext = optionalTheme?.toggleTheme;

  // fallback to system hook
  const fallback = useColorScheme();
  const scheme = ctxTheme ?? fallback ?? "light";

  const themeIconName = scheme === "dark" ? "sunny" : "moon";
  const themeIconColor = scheme === "dark" ? "#FFD97D" : "#5eead4";

  return (
    <View
      style={[styles.header, scheme === "dark" ? styles.headerDark : undefined]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons name={"layers-outline"} size={28} color={themeIconColor} />
        <Text
          style={[
            styles.titleText,
            scheme === "dark" ? styles.titleTextDark : undefined,
          ]}
        >
          PHETRUYENN
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <TouchableOpacity
          onPress={() => {
            console.log(
              "[Header] toggle pressed. hasContextToggle=",
              !!toggleFromContext,
              "onToggleProp=",
              !!onToggleTheme
            );
            if (onToggleTheme) onToggleTheme();
            else if (toggleFromContext) toggleFromContext();
            else console.warn("Theme toggle not available");
          }}
        >
          <Ionicons
            name={themeIconName as any}
            size={28}
            color={themeIconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.warn("Theme toggle not available");
          }}
        >
          <Ionicons name={"search"} size={28} color={themeIconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#F9C7F8",
  },
  headerDark: { backgroundColor: "#1D1D1F" },
  titleText: { fontWeight: "bold", color: "#00BFFF", fontSize: 20 },
  titleTextDark: { color: "#CDEDF5" },
});
