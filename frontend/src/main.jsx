import React from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./redux/store";
import { fetchMe } from "./redux/slices/authSlice";
import { setDarkMode } from "./redux/slices/themeSlice";
import "./index.css";

function Bootstrap() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const migrated = localStorage.getItem("kinoraLightV2");
    if (!migrated) {
      localStorage.setItem("darkMode", "false");
      localStorage.setItem("kinoraLightV2", "1");
      dispatch(setDarkMode(false));
    } else {
      const saved = localStorage.getItem("darkMode");
      const dark = saved === "true";
      dispatch(setDarkMode(dark));
    }
    if (token) dispatch(fetchMe());
  }, [dispatch]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Bootstrap />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
