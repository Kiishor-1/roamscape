import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { LISTING_ENDPOINT } from "../service/api";
// import { useSelector } from "react-redux";

const {
    FETCH_ALL_LISTINGS,
    FETCH_LISTING,
    CREATE_LISTING,
    UPDATE_LISTING,
    DELETE_LISTING
} = LISTING_ENDPOINT;

// Thunks
export const fetchAllListings = createAsyncThunk('listing/fetchAllListings', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(FETCH_ALL_LISTINGS);
        return response.data.listings;
    } catch (error) {
        console.log(error);
        toast.error('Failed to fetch listings');
        return rejectWithValue(error.response?.data?.message || 'Server error');
    }
});

export const fetchListing = createAsyncThunk('listing/fetchListing', async (id,{rejectWithValue}) => {
    try {
        const response = await axios.get(FETCH_LISTING(id));
        // console.log(response.data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Server error');
    }
});

export const createListing = createAsyncThunk(
    'listing/createListing',
    async (listing, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.user.token;

        try {
            const response = await axios.post(CREATE_LISTING, { ...listing }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                    'Content-Type': 'application/json'
                },
            });
            toast.success('Listing created successfully!');
            // console.log(response.data);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Server error');
            return rejectWithValue(error.response?.data?.message || 'Server error');
        }
    }
);

export const editListing = createAsyncThunk(
    'listing/editListing',
    async ({ id, updatedListing }, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.user.token;

        try {
            const response = await axios.post(
                UPDATE_LISTING(id),
                updatedListing,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            toast.error(error.response?.data || 'Server Error')
            return rejectWithValue(error.response?.data?.message || 'Server error');
        }
    }
);


export const deleteListing = createAsyncThunk(
    'listing/deleteListing',
    async (id, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.user.token;

        try {
            const response = await axios.delete(
                DELETE_LISTING(id),
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token
                    }
                }
            );
            if(!response.status === 200){
                return rejectWithValue('Failed to delete listing');
            }
            return id;
        } catch (error) {
            console.log("Error deleting listing", error);
            toast.error(error.response?.data?.message || 'Failed to delete listing');
            return rejectWithValue(error.response?.data?.message || 'Failed to delete listing');
        }
    }
);



export const fetchFilteredListings = createAsyncThunk('listing/fetchFilteredListings', async ({ category, minPrice, maxPrice }) => {
    let url = `${FETCH_ALL_LISTINGS}?`;

    if (category) {
        url += `category=${category}&`;
    }
    if (minPrice) {
        url += `minPrice=${minPrice}&`;
    }
    if (maxPrice) {
        url += `maxPrice=${maxPrice}&`;
    }

    const response = await axios.get(url);
    return response.data.listings;
});



export const searchListings = createAsyncThunk('listing/searchListings', async (searchQuery, { dispatch }) => {
    const response = await axios.get(`${FETCH_ALL_LISTINGS}?search=${searchQuery}`);
    return response.data.listings;
});

// Slice
const listingSlice = createSlice({
    name: "listing",
    initialState: {
        allListings: [],
        currentListing: null,
        status: 'idle',
        isLoading: false,
        error: null,
    },
    reducers: {
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        clearListings: (state) => {
            state.allListings = [];
        }
    },
    extraReducers: (builder) => {
        // Fetch All Listings
        builder.addCase(fetchAllListings.pending, (state) => {
            state.status = 'loading';
            state.isLoading = true;
        })
            .addCase(fetchAllListings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allListings = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAllListings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.isLoading = false;
            });

        // Fetch Single Listing
        builder.addCase(fetchListing.pending, (state) => {
            state.status = 'loading';
            state.isLoading = true;
        })
            .addCase(fetchListing.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentListing = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchListing.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.isLoading = false;
            });

        // Create Listing
        builder.addCase(createListing.pending, (state) => {
            state.status = 'loading';
            state.isLoading = true;
        })
            .addCase(createListing.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allListings.push(action.payload);
                state.isLoading = false;
            })
            .addCase(createListing.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
                state.isLoading = false;
                // toast.error(state.error);
            });

        // Edit Listing
        builder.addCase(editListing.pending, (state) => {
            state.status = 'loading';
            state.isLoading = true;
        })
            .addCase(editListing.fulfilled, (state, action) => {
                const updatedListing = action.payload;
                const listingId = updatedListing._id?.$oid || updatedListing._id;

                if (listingId) {
                    state.currentListing = updatedListing;
                    state.allListings = state.allListings.map(listing =>
                        listing._id.$oid === listingId ? updatedListing : listing
                    );
                } else {
                    console.error('Invalid listing ID format:', updatedListing);
                    toast.error('Invalid listing ID format');
                }
            })
            .addCase(editListing.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
                state.isLoading = false;
            });

        // Delete Listing
        builder.addCase(deleteListing.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(deleteListing.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allListings = state.allListings.filter(listing => listing._id.$oid !== action.payload);
                if (state.currentListing && state.currentListing._id.$oid === action.payload) {
                    state.currentListing = null;
                }
                toast.success('Listing deleted successfully!');
            })
            .addCase(deleteListing.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });

        // Handle search
        builder.addCase(searchListings.pending, (state) => {
            state.status = 'loading';
            state.isLoading = true;
        })
            .addCase(searchListings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allListings = action.payload;
                state.isLoading = false;
            })
            .addCase(searchListings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.isLoading = false;
            });

        // Handle filter
        builder.addCase(fetchFilteredListings.pending, (state) => {
            state.status = 'loading';
            state.isLoading = true;
        })
            .addCase(fetchFilteredListings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allListings = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchFilteredListings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                state.isLoading = false;
            });
    }
});

export const { setIsLoading } = listingSlice.actions;
export default listingSlice.reducer;
