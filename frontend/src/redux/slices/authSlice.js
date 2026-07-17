import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      (err.code === "ERR_NETWORK" ? "Cannot reach server. Is the backend running?" : null) ||
      "Login failed";
    return rejectWithValue({ message });
  }
});

export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      (err.code === "ERR_NETWORK" ? "Cannot reach server. Is the backend running?" : null) ||
      "Registration failed";
    return rejectWithValue({ message });
  }
});

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const { data } = await api.get("/auth/me");
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: localStorage.getItem("accessToken") || "",
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = "";
      localStorage.removeItem("accessToken");
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload?.message || action.error?.message || "Login failed";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload?.message || action.error?.message || "Registration failed";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const { logout, setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer;
