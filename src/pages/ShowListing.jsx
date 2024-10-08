import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchListing, deleteListing, setIsLoading } from '../store/listingSlice'; 
import { fetchBookings } from '../store/profileSlice'; // Import fetchBookings
import ListingTitleImage from '../components/core/ShowListing/ListingTitleImage';
import ListingDetails from '../components/core/ShowListing/ListingDetails';
import BookingForm from '../components/core/ShowListing/BookingForm';
import ReviewBar from '../components/core/Review/ReviewBar';
import ReviewList from '../components/core/Review/ReviewList';
import MapboxMap from '../components/core/ShowListing/MapboxMap';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';
import ReviewForm from '../components/core/Review/ReviewForm';

const ShowListing = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const listing = useSelector((state) => state.listing.currentListing);
    const isLoading = useSelector((state) => state.listing.isLoading);
    const { currUser } = useSelector((state) => state.user);
    const { bookings } = useSelector((state) => state.profile);
    const [isBooked, setIsBooked] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        // Fetch bookings when component loads
        if (currUser) {
            dispatch(fetchBookings({ userId: currUser.userId }));
        }
    }, [dispatch, currUser]);

    useEffect(() => {
        if (listing && bookings) {
            const currentBooking = bookings.find((booking) => 
                booking.listing && booking.listing._id && 
                listing._id && booking.listing._id.$oid === listing._id.$oid
            );
            if (currentBooking) {
                setIsBooked(currentBooking.status === "Booked");
                setIsPaid(currentBooking.status === "Paid");
            }
        }
    }, [bookings, listing]);

    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        infants: 2,
        pets: 0,
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const refetchListing = async () => {
        dispatch(setIsLoading(true));
        try {
            await dispatch(fetchListing(id)).unwrap();
        } catch (error) {
            console.log(error);
            toast.error('Failed to load the listing');
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    useEffect(() => {
        refetchListing();
    }, [dispatch, id]);
    
    const handleGuestChange = (type, operation) => {
        setGuests((prev) => {
            const newValue = operation === 'increment' ? prev[type] + 1 : prev[type] - 1;
            return { ...prev, [type]: Math.max(newValue, 0) };
        });
    };

    const handleDeleteListing = async () => {
        setDeleting(true);
        const deleteToastId = toast.loading('Deleting listing...');

        try {
            await dispatch(deleteListing(id)).unwrap();
            toast.dismiss(deleteToastId);
            navigate('/');
        } catch (error) {
            console.log(error)
            toast.dismiss(deleteToastId);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (isLoading) {
        return <div className='w-full min-h-[71vh] flex items-center justify-center bg-'>
            <div className="loader"></div>
        </div>;
    }

    if (!listing) {
        return <div>No listing found</div>;
    }

    return (
        <div className="p-2">
            <ListingTitleImage title={listing.title} imageUrl={listing.image.url} />
            <div className="flex md:flex-row flex-col items-center justify-between gap-4">
                <div>
                    <ListingDetails listing={listing} totalPrice={listing.price} />
                    {
                        currUser && listing.owner._id === currUser.userId &&
                        (<div className="util-btns my-4 flex items-center gap-4">
                            <Link to={`/listings/edit/${listing._id.$oid}`} className="px-10 py-2 my-4 rounded-full border bg-red-700 text-white">
                                Edit
                            </Link>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-10 py-2 my-4 rounded-full border bg-black text-white"
                            >
                                Delete
                            </button>
                        </div>)
                    }
                </div>
                <BookingForm
                    isBooked={isBooked}
                    setIsBooked={setIsBooked}
                    isPaid={isPaid}
                    setIsPaid={setIsPaid}
                    listing={listing}
                    guests={guests}
                    onGuestChange={handleGuestChange}
                    totalPrice={listing.price}
                    bookings={bookings}
                />
            </div>
            {
                currUser &&
                <ReviewForm listingId={listing._id?.$oid || listing._id} userId={currUser.userId} onReviewAdded={refetchListing} />
            }
            <ReviewList reviews={listing.reviews} />
            <ReviewBar reviews={listing.reviews} />
            <MapboxMap listing={listing} />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} loading={deleting}>
                <h2 className="text-xl font-bold py-3">Confirm Deletion</h2>
                <p className="my-4">Are you sure you want to delete this listing?</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteListing}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg"
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ShowListing;