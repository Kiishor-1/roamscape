import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { REVIEW_ENDPOINT } from "../service/api";

// Thunk to create a review
export const createReview = createAsyncThunk(
    'review/createReview',
    async (reviewData, { rejectWithValue, getState, dispatch }) => {
        const { token } = getState().user;

        try {
            if (!token) {
                return rejectWithValue("User is not authenticated");
            }

            // Send request to create review with Authorization header
            const response = await axios.post(REVIEW_ENDPOINT.CREATE_REVIEW(reviewData.listingId), reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Review added successfully');
            return response.data;
        } catch (error) {
            // Handle error
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to add review');
            }
            return rejectWithValue(error.response?.data?.message || 'Server error');
        }
    }
);

// Slice for managing reviews
const reviewSlice = createSlice({
    name: "review",
    initialState: {
        reviews: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReview.pending, (state) => {
                state.isLoading = true; // Set loading state on pending
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.reviews.push(action.payload);
                state.isLoading = false; // Clear loading state on success
            })
            .addCase(createReview.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
                state.isLoading = false; // Clear loading state on failure
            });
    }
});

export default reviewSlice.reducer;
