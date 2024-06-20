import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  token: localStorage.getItem("token") || null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    singInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = true;
    },
    signUpStart: (state) => {
      state.loading = true;
    },
    signUpSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signUpFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    saveToken: (state, action) => {
      state.token = action.payload;
    },
    getLocalToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    logOut: (state, action) => {
      state.currentUser = action.payload;
      state.token = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  singInFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  saveToken,
  getLocalToken,
  setUser,
  logOut,
} = userSlice.actions;

export default userSlice.reducer;
