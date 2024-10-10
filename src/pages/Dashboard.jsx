import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchBookings, updateUserProfile, deleteBooking, } from '../store/profileSlice';
import { toast } from 'react-hot-toast';
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Razorpay from 'razorpay'; // Add this for Razorpay payment integration
import { payForBookings } from '../service/makePayments';


const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, bookings, status, error } = useSelector((state) => state.profile);

    const [editMode, setEditMode] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [totalRent, setTotalRent] = useState(0); // State to store the total rent

    const { currUser, token } = useSelector((state) => state.user); // Assuming auth stores userId
    const userId = currUser?.userId;


    useEffect(() => {
        if (userId && token) {
            dispatch(fetchUserProfile(userId));
            // dispatch(fetchBookings(userId));
        } else {
            navigate("/login");
        }
    }, [dispatch, userId, navigate, token]);

    // console.log('user',user);

    useEffect(() => {
        // Calculate total rent of all bookings with status "Booked"
        if (bookings && bookings.length > 0) {
            const total = bookings
                .filter(booking => booking?.status === "Booked")  // Filter bookings with status "Booked"
                .reduce((sum, booking) => sum + booking?.totalRent, 0);  // Sum up the totalRent of those bookings
            setTotalRent(total);
        }
    }, [bookings]);


    // Handle profile updates
    const handleProfileUpdate = () => {
        dispatch(updateUserProfile({ userId, ...updatedProfile }));
        toast.success('Profile updated successfully!');
        setEditMode(false);
    };

    // Handle booking deletion
    const handleDeleteBooking = (bookingId) => {
        dispatch(deleteBooking(bookingId));
        toast.success('Booking deleted successfully!');
    };

    // Handle payment initiation
    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
            if (!token) {
                toast.error('User not authenticated');
                return;
            }

            const bookingIds = bookings
                .filter(booking => booking?.status === "Booked")  // Only collect booking IDs with status "Booked"
                .map(booking => booking._id?.$oid || booking.id); // Collect booking IDs
            payForBookings(
                token,
                totalRent,
                bookingIds,
                currUser,
                navigate
            );


        } catch (error) {
            console.log("Error during payment initialization", error);
            toast.error('Error during payment initialization');
        }
    };

    // Filter bookings based on status
    const bookedBookings = bookings.filter(booking => booking?.status === "Booked");
    const paidBookings = bookings.filter(booking => booking?.status === "Paid");

    return (
        <div className="min-h-screen bg--100 p-4">
            <div className="container mx-auto">
                {/* Dashboard Heading */}
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Hello👋, {user?.firstName || user?.username || user?.email || "User"}</h1>

                {/* Profile Section */}
                <div className="p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Profile Information</h2>

                    {status === 'loading' ? (
                        <div className='flex flex-col gap-5'>
                            <div className="flex gap-5">
                                <span className="h-[4rem] w-[4rem] rounded-full bg-gray-200"></span>
                                <span className="h-[4rem] w-[4rem] rounded-full bg-gray-200"></span>
                            </div>
                            <div className="w-[200px] h-[5rem] rounded-md bg-gray-200"></div>
                        </div>
                    ) : (
                        <div>
                            {error && <p className="text-red-500">{error}</p>}
                            {user ? (
                                <div>
                                    {editMode ? (
                                        <div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={updatedProfile.name || user.name}
                                                    onChange={(e) => setUpdatedProfile({ ...updatedProfile, name: e.target.value })}
                                                    className="mt-1 p-2 border rounded w-full"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                                <input
                                                    type="email"
                                                    value={updatedProfile.email || user.email}
                                                    onChange={(e) => setUpdatedProfile({ ...updatedProfile, email: e.target.value })}
                                                    className="mt-1 p-2 border rounded w-full"
                                                />
                                            </div>
                                            <button
                                                onClick={handleProfileUpdate}
                                                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditMode(false)}
                                                className="ml-4 px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="mb-2">Name: {user.firstName || "User"}</p>
                                            <p className="mb-2">Email:{user.email || "user@gmail.com"}</p>
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-green-600"
                                            >
                                                <FaUserEdit />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>No profile data available.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Booked Bookings Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Bookings (Booked)</h2>

                    {status === 'loading' ? (
                        <p className="h-[10rem] w-full flex items-center justify-between">
                            <span className='w-[48%] h-[10rem] bg-gray-200'></span>
                            <span className='w-[48%] h-[10rem] bg-gray-200'></span>
                        </p>
                    ) : (
                        <div>
                            {error && <p className="text-red-500">{error}</p>}
                            {bookedBookings.length > 0 ? (
                                <ul className="space-y-4">
                                    {bookedBookings.map((booking, id) => (
                                        <Link to={`/listings/${booking?.listing?._id?.$oid}`} key={id} className="p-4 bg-gray-100 rounded-lg flex flex-col lg:flex-row lg:gap-10 gap-4 items-cente shadow">
                                            <div className='h-[20rem] overflow-hidden max-w-[400px] rounded-lg'>
                                                <img src={booking?.listing?.image?.url} className='object-cover object-center rounded-lg' alt="" />
                                            </div>
                                            <div className="py-3 flex flex-col gap-3">
                                                <h3 className="text-lg font-semibold">{booking?.listing?.title}</h3>
                                                <h3 className="text-sm font-semibold">{booking?.listing?.description}</h3>
                                                <p className='text-sm font-semibold'>Total Rent : {booking?.totalRent}</p>
                                                <p className='text-sm'>Status : <span className='font-semibold'>{booking?.status}</span> </p>
                                                <button onClick={() => handleDeleteBooking({ listingId: booking?.listing?._id?.$oid || booking.listing._id, bookingId: booking?._id?.$oid })} className='px-3 py-2 rounded-md bg-red-400 hover:bg-red-500 text-white'>
                                                    Delete
                                                </button>
                                            </div>
                                        </Link>
                                    ))}
                                </ul>
                            ) : (
                                <p>No bookings found.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Paid Bookings Section */}
                <div className="bg-white shadow-md rounded-lg p-6 mt-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Bookings (Paid)</h2>

                    {status === 'loading' ? (
                        <p className="h-[10rem] w-full flex items-center justify-between">
                            {/* <span classTo separate "Booked" and "Paid" bookings and display them in two sections, the changes you've made in the `Dashboard.jsx` look great. The structure is clear, and it filters the bookings based on their status effectively. Here's a breakdown of the enhancements: */}
                            <span className='w-[48%] h-[10rem] bg-gray-200'></span>
                            <span className='w-[48%] h-[10rem] bg-gray-200'></span>
                        </p>
                    ) : (
                        <div>
                            {error && <p className="text-red-500">{error}</p>}
                            {paidBookings.length > 0 ? (
                                <ul className="space-y-4">
                                    {paidBookings.map((booking, id) => (
                                        <Link to={`/listings/${booking?.listing?._id?.$oid}`} key={id} className="p-4 bg-gray-100 rounded-lg flex flex-col lg:flex-row lg:gap-10 gap-4 items-center shadow">
                                            <div className='h-[20rem] overflow-hidden max-w-[400px] rounded-lg'>
                                                <img src={booking?.listing?.image?.url} className='object-cover object-center rounded-lg' alt="" />
                                            </div>
                                            <div className="py-3 flex flex-col gap-3">
                                                <h3 className="text-lg font-semibold">{booking?.listing?.title}</h3>
                                                <h3 className="text-sm font-semibold">{booking?.listing?.description}</h3>
                                                <p className='text-sm font-semibold'>Total Rent : {booking?.totalRent}</p>
                                                <p className='text-sm'>Status : <span className='font-semibold'>{booking?.status}</span> </p>
                                            </div>
                                        </Link>
                                    ))}
                                </ul>
                            ) : (
                                <p>No paid bookings found.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Payment */}
                {
                    totalRent > 0 &&
                    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Total Rent and Payment</h2>
                        <p className="mb-4 text-lg font-semibold">Total Rent: ₹{totalRent}</p>
                        <button
                            onClick={handlePayment}
                            className="px-6 py-2 bg-teal-500 text-white rounded-full shadow hover:bg-teal-600"
                        >
                            Pay ₹{totalRent}
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Dashboard;
