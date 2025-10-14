import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance } from "react-native";

type ThemeMode = "light" | "dark";
type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => Promise<void> | void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "app_theme_mode";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const sys = Appearance.getColorScheme();
    return sys === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") setThemeState(stored);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const setTheme = useCallback(async (t: ThemeMode) => {
    setThemeState(t);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((cur) => {
      const next = cur === "dark" ? "light" : "dark";
      console.log("[ThemeContext] toggleTheme ->", next);
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within ThemeProvider");
  return ctx;
}

// <-- new safe optional hook
export function useOptionalAppTheme() {
  return useContext(ThemeContext);
}

export { ThemeContext };
