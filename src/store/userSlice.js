import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { USER_ENDPOINTS } from '../service/api';
import toast from 'react-hot-toast';

const { REGISTER_USER, LOGIN_USER } = USER_ENDPOINTS;

// Async thunk for user registration
// Async thunk for user registration
export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(REGISTER_USER, userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data; // This should return the user data or token
        } catch (error) {
            // Handle errors with Axios
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(LOGIN_USER, credentials, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // console.log(response)
            return response.data; // This should return the user data or token
        } catch (error) {
            // Handle errors with Axios
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currUser: JSON.parse(localStorage.getItem('currUser')) || null,
        token: localStorage.getItem('token') || null,
        isLoading: false,
        error: null,
        signupStatus: 'idle',
        loginStatus: 'idle',
        signupData: null,
    },
    reducers: {
        logout: (state) => {
            state.currUser = null;
            state.token = null;
            localStorage.removeItem('currUser');
            localStorage.removeItem('token');
            state.signupStatus = 'idle';
            state.loginStatus = 'idle';
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.signupStatus = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.signupStatus = 'succeed';
                state.signupData = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.signupStatus = 'failed';
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.loginStatus = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { user, token } = action.payload; // Assuming your response has user and token fields
                state.isLoading = false;
                state.currUser = user;
                state.token = token;
                state.loginStatus = 'succeed';
                state.error = null;

                // Store user and token in localStorage
                localStorage.setItem('currUser', JSON.stringify(user));
                localStorage.setItem('token', token);
                toast.success('Logged In Successfully');
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.loginStatus = 'failed';
                toast.error(state.error?.message || 'Login Failed');
            });
    },
});

export const { logout, setIsLoading } = userSlice.actions;
export default userSlice.reducer;
