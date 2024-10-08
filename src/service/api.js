const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

export const LISTING_ENDPOINT = {
    FETCH_ALL_LISTINGS:`${BASE_URL}/listings`,
    FETCH_LISTING:(id)=>`${BASE_URL}/listings/${id}`,
    CREATE_LISTING:`${BASE_URL}/create`,
    UPDATE_LISTING:(id)=>`${BASE_URL}/update/${id}`,
    DELETE_LISTING:(id)=>`${BASE_URL}/delete/${id}`,
}

export const USER_ENDPOINTS = {
    REGISTER_USER:`${BASE_URL}/user/register`,
    LOGIN_USER:`${BASE_URL}/user/login`
}

export const REVIEW_ENDPOINT = {
    CREATE_REVIEW:(id)=>`${BASE_URL}/listings/${id}/reviews`,
}

export const PROFILE_ENDPOINTS = {
    CREATE_BOOKING: (id)=>`${BASE_URL}/bookings/${id}/create`,
    GET_USER_BOOKINGS: `${BASE_URL}/bookings/user`,
    DELETE_BOOKING : (id)=> `${BASE_URL}/bookings/${id}/delete`,
    GET_USER_DATA:`${BASE_URL}/user/profile`
}

export const PAYMENT_ENDPOINTS = {
    INITIATE_PAYMENT:`${BASE_URL}/payments/initiate`,
    VERIFY_PAYMENT:`${BASE_URL}/payments/verify`,
}