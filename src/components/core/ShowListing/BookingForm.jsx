import GuestSelector from './GuestSelector';
import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { createBooking, deleteBooking } from '../../../store/profileSlice'; // Import deleteBooking action
import { Link, useNavigate } from 'react-router-dom'; // Import Link for redirection
import toast from 'react-hot-toast';
import { payForBookings } from '../../../service/makePayments';

const BookingForm = ({ listing, guests, onGuestChange, totalPrice, isBooked, setIsBooked, isPaid, setIsPaid, bookings }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [totalRent, setTotalRent] = useState(totalPrice);
  const { currUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to calculate the total rent
  const calculateTotalRent = (checkIn, checkOut, price, priceAfterTax, guests) => {
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();
    const duration = (checkOutTime - checkInTime) / (1000 * 60 * 60 * 24); // Convert ms to days
    const nights = duration >= 1 ? Math.ceil(duration) : 1; // Ensuring at least one night

    let sum = guests.adults <= 2 ? priceAfterTax : priceAfterTax + (guests.adults - 2) * (price / 2);
    sum += guests.children > 2 ? (guests.children - 2) * (price / 4) : 0;
    sum += guests.infants > 2 ? (guests.infants - 2) * (price / 4) : 0;

    return sum * nights;
  };

  // Toggle booking status (Booking/Unbooking)
  const handleLikeToggle = () => {
    if (isBooked) {
      // Unbooking logic
      dispatch(deleteBooking({ listingId: listing?._id?.$oid || listing?._id }))
        .unwrap()
        .then((response) => {
          console.log("Unbooking successful ");
          setIsBooked(false);
        })
        .catch((error) => {
          console.log("Unbooking failed: ", error);
        });
    } else {
      // Booking logic
      const bookingData = {
        listingId: listing?._id?.$oid,
        guests: guests,
        checkIn: checkInDate,
        checkOut: checkOutDate,
      };

      dispatch(createBooking({ bookingData }))
        .unwrap()
        .then((response) => {
          console.log("Booking successful ");
          setIsBooked(true);
        })
        .catch((error) => {
          console.log("Booking failed: ", error);
        });
    }
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      if (!token) {
        toast.error('User not authenticated');
        return;
      }

      // Step 1: Create a booking first before initiating payment
      const bookingData = {
        listingId: listing?._id?.$oid, // Listing ID
        guests: guests,                // Guest details
        checkIn: checkInDate,          // Check-in date
        checkOut: checkOutDate         // Check-out date
      };

      const bookingResponse = await dispatch(createBooking({ bookingData })).unwrap();
      // console.log("booking response", bookingResponse)

      // Step 2: Check if booking creation is successful
      if (bookingResponse && bookingResponse.bookingId) {
        const bookingId = bookingResponse.bookingId;

        // Step 3: Prepare for payment initiation
        const bookingIds = [bookingId]; // Send the newly created booking ID in an array

        // Initiate payment using the existing `payForBookings` function
        payForBookings(
          token,
          totalRent,
          bookingIds,
          currUser,
          navigate
        );
      } else {
        throw new Error('Failed to create booking');
      }

    } catch (error) {
      console.log("Error during payment initialization", error);
      toast.error('Error during payment initialization');
    }
  };


  // Recalculate total rent when guests, checkIn, or checkOut change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const newTotalRent = calculateTotalRent(checkInDate, checkOutDate, listing.price, listing.priceAfterTax, guests);
      setTotalRent(newTotalRent);
    }
  }, [checkInDate, checkOutDate, guests, listing.price, listing.priceAfterTax]);

  return (
    <div className="my-4 rounded-xl border max-w-[22rem] p-4 flex flex-col gap-2">
      <div className="text-3xl">
        <div> &#8377; <strong>{totalRent.toLocaleString('en-IN')}</strong></div>
        <span className='text-sm text-gray-600 font-semibold'>Total after Tax</span>
      </div>
      <div className="date-selection flex gap-4 my-4">
        <div className="date flex flex-col">
          <label htmlFor="checkin" className='text-[0.8rem] text-gray-600'>CHECK-IN</label>
          <input
            type="date"
            id="checkin"
            name="checkIn"
            className="border p-2 rounded-md"
            required
            onChange={(e) => setCheckInDate(e.target.value)}
          />
        </div>
        <div className="date flex flex-col">
          <label htmlFor="checkout" className='text-[0.8rem] text-gray-600'>CHECKOUT</label>
          <input
            type="date"
            id="checkout"
            name="checkOut"
            className="border p-2 rounded-md"
            required
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </div>
      </div>

      <GuestSelector guests={guests} onGuestChange={onGuestChange} />

      <p className="text-secondary text-sm">{`You'll not be charged yet`}</p>

      <div className="flex items-center gap-6">
        {isPaid ? (
          // If the booking is already paid, show a link to "Go to Bookings"
          <Link to="/dashboard" className="flex-1 border bg-green-600 w-100 py-3 rounded-md text-white text-center">
            Go to your bookings
          </Link>
        ) : (
          <>
            {isBooked ? (
              <FaHeart
                onClick={handleLikeToggle}
                className='w-[fit-content] text-red-500 transition duration-300 hover:scale-110 cursor-pointer'
                fontSize={"1.3rem"}
              />
            ) : (
              <FaRegHeart
                onClick={handleLikeToggle}
                className='w-[fit-content] transition duration-300 hover:scale-110 cursor-pointer'
                fontSize={"1.3rem"}
              />
            )}

            {/* Button to book now if booking status is Booked */}
            <button
              onClick={handlePayment}
              className="flex-1 border bg-teal-600 w-100 py-3 rounded-md text-white"
            >
              Book Now
            </button>
          </>
        )}
      </div>

      {isPaid && <p className="text-green-600 text-center mt-4">Payment Successful! Booking is now Paid.</p>}
    </div>
  );
};

export default BookingForm;