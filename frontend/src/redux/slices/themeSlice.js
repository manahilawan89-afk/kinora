import { createSlice } from "@reduxjs/toolkit";

function readDarkMode() {
  const saved = localStorage.getItem("darkMode");
  if (saved === null) return false; // Kinora defaults to light
  return saved === "true";
}

function applyDarkClass(dark) {
  document.documentElement.classList.toggle("dark", dark);
}

// Apply immediately so first paint matches preference
if (typeof document !== "undefined") {
  applyDarkClass(readDarkMode());
}

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: typeof window !== "undefined" ? readDarkMode() : false,
  },
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", String(state.darkMode));
      applyDarkClass(state.darkMode);
    },
    setDarkMode(state, action) {
      state.darkMode = Boolean(action.payload);
      localStorage.setItem("darkMode", String(state.darkMode));
      applyDarkClass(state.darkMode);
    },
  },
});

export const { toggleTheme, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
