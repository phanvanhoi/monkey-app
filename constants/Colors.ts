/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0ea5e9";
const tintColorDark = "#0ea5e9";

export const Colors = {
  light: {
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    surface: "#fff",
    text: "#222",
    subtle: "#888",
    onTint: "#fff",
  },
  dark: {
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    surface: "#18181b",
    text: "#f3f4f6",
    subtle: "#a3a3a3",
    onTint: "#fff",
  },
};
