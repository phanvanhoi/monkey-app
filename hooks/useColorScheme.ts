// export { useColorScheme } from 'react-native';
import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

/**
 * Trả về "light" | "dark".
 * - Nếu ThemeProvider được bọc quanh app -> trả về theme từ context (tĩnh / controllable).
 * - Nếu không -> dùng system color scheme và lắng nghe thay đổi để update.
 */
export function useColorScheme(): "light" | "dark" {
  const ctx = useContext(ThemeContext);
  if (ctx && ctx.theme) return ctx.theme;

  const [sysScheme, setSysScheme] = useState<ColorSchemeName | null>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSysScheme(colorScheme);
    });
    return () => {
      // remove listener (API returns subscription with remove)
      try {
        // RN < 0.65 returns a subscription object with remove()
        (sub as any).remove?.();
      } catch {
        // ignore
      }
    };
  }, []);

  return sysScheme === "dark" ? "dark" : "light";
}

export default useColorScheme;
