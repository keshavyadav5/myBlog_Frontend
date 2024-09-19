import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  error: null,
  loading: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload
      state.loading = false;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.error = action.payload
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    uploadPostStart : (state) =>{
      state.loading = true;
      state.error = false
    },
    uploadPostSuccess : (state, action) =>{
      state.loading = false;
      state.error = null;
    },
    uploadPostFailure : (state, action) =>{
      state.error = action.payload;
      state.loading = false;
      },
  }
})

export const {
  signInStart,
  signInFailure,
  signInSuccess,
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signoutSuccess,
  uploadPostStart,
  uploadPostSuccess,
  uploadPostFailure
} = userSlice.actions;
export default userSlice.reducer;