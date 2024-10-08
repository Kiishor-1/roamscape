import { configureStore } from "@reduxjs/toolkit";
import listingReducer from "./listingSlice";
import userReducer from "./userSlice";
import reviewReducer from "./reviewSlice";
import profileReducer from "./profileSlice";

const store = configureStore({
    reducer:{
        listing:listingReducer,
        user:userReducer,
        review:reviewReducer,
        profile:profileReducer
    }
})

export default store;