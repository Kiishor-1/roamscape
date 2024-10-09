import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PROFILE_ENDPOINTS } from '../service/api';

const {CREATE_BOOKING, DELETE_BOOKING, GET_USER_BOOKINGS, GET_USER_DATA} = PROFILE_ENDPOINTS;

// Thunks for profile-related operations

// Fetch user profile data
export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async ({ userId }, { getState, rejectWithValue }) => {
        const { token, currUser } = getState().user; // Access user slice

        if (!token) {
            return rejectWithValue('Token not found'); // Handle missing token
        }
        // console.log("token is ",token)
        try {
            const response = await axios.get(GET_USER_DATA, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                },
            });
            return response.data; // Assuming API returns user details
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching profile');
        }
    }
);

// Update user profile data
export const updateUserProfile = createAsyncThunk(
    'profile/updateUserProfile',
    async ({ updatedProfileData, token }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/users/${updatedProfileData.userId}`, updatedProfileData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                },
            });
            return response.data; // Assuming API returns updated user details
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error updating profile');
        }
    }
);

// Fetch user bookings
export const fetchBookings = createAsyncThunk(
    'profile/fetchBookings',
    async ({ userId }, { getState ,rejectWithValue }) => {
        const { token,  } = getState().user; // Access user slice

        if (!token) {
            return rejectWithValue('Token not found');
        }
        try {
            const response = await axios.get(GET_USER_BOOKINGS, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                },
            });
            return response.data; // Assuming API returns an array of bookings
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching bookings');
        }
    }
);

export const createBooking = createAsyncThunk(
    'profile/createBooking',
    async ({ bookingData }, { getState, rejectWithValue }) => {
        const { token, currUser } = getState().user; // Access user slice
        // const token = user.token; // Assuming the token is stored in the user slice

        if (!token) {
            return rejectWithValue('Token not found'); // Handle missing token
        }


        try {
            const response = await axios.post(CREATE_BOOKING(bookingData.listingId), bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            return response.data; // Assuming API returns the new booking details
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || 'Error creating booking');
        }
    }
);

// Delete a booking
export const deleteBooking = createAsyncThunk(
    'profile/deleteBooking',
    async ({ listingId }, { getState, rejectWithValue }) => {
      const { token } = getState().user; // Access user slice
      console.log("Listing ID is: ", listingId);  // Debugging
      try {
        const response = await axios.delete(DELETE_BOOKING(listingId), {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        return response.data; // Assuming API returns success message or the deleted booking ID
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error deleting booking');
      }
    }
  );
  

// Profile slice
const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        user: null, // Stores user details (id, name, email, etc.)
        bookings: [], // Stores user bookings (booked, paid, etc.)
        status: 'idle', // Tracks the status of async actions ('idle', 'loading', 'succeeded', 'failed')
        error: null, // Stores error messages from failed actions
    },
    reducers: {
        // You can add synchronous actions here, if needed
        clearProfileError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Handle fetchUserProfile thunks
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                state.bookings = action.payload.bookings;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        // Handle updateUserProfile thunks
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload; // Update user with new profile data
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        // Handle fetchBookings thunks
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bookings = action.payload.bookings;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        // Handle createBooking thunks
        builder
            .addCase(createBooking.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // state.bookings.push(action.payload); // Add new booking to the bookings array
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

        // Handle deleteBooking thunks
        builder
            .addCase(deleteBooking.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bookings = state.bookings.filter(
                    (booking) => booking.id !== action.payload.id
                ); // Remove the deleted booking from the bookings array
            })
            .addCase(deleteBooking.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Export the action creators for synchronous actions
export const { clearProfileError } = profileSlice.actions;

// Export the reducer to add to the store
export default profileSlice.reducer;
