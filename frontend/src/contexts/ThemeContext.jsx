// context/ThemeContext.jsx
import { createContext, useState, useEffect } from "react";

import COLOR_SCHEMES from "../utils/constants.js";

const ThemeContext = createContext(null);

const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return window.localStorage.getItem("mode") || "dark";
  });

  const [colorScheme, setColorSchemeState] = useState(() => {
    return window.localStorage.getItem("colorScheme") || "default";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(
      "light",
      "dark",
      ...COLOR_SCHEMES.map((s) => s.value),
    );
    root.classList.add(colorScheme, mode);

    window.localStorage.setItem("mode", mode);
    window.localStorage.setItem("colorScheme", colorScheme);
  }, [mode, colorScheme]);

  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  const setColorScheme = (scheme) => setColorSchemeState(scheme);

  return (
    <ThemeContext.Provider
      value={{ mode, colorScheme, toggleMode, setColorScheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
