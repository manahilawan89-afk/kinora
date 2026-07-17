import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    list: [],
    current: null,
  },
  reducers: {
    setVideos(state, action) {
      state.list = action.payload;
    },
    setCurrentVideo(state, action) {
      state.current = action.payload;
    },
  },
});

export const { setVideos, setCurrentVideo } = videoSlice.actions;
export default videoSlice.reducer;
