import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../../store/reviewSlice';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const ReviewForm = ({ listingId, userId, onReviewAdded }) => {
    const [rating, setRating] = useState(3);
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();

    // Extract the loading state from Redux
    const isLoading = useSelector((state) => state.review.isLoading);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!rating || !comment) {
            toast.error("Fill All Required Data");
            return;
        }

        // Show loading toast
        const toastId = toast.loading('Submitting your review...');

        try {
            // Dispatch the create review action
            await dispatch(createReview({ listingId, userId, rating, comment })).unwrap();

            // Call the callback to notify parent component
            onReviewAdded();

            // Reset form fields
            setComment('');
            setRating(3);

            // Dismiss the loading toast and show success message
            toast.dismiss(toastId);
            // toast.success('Review submitted successfully');
        } catch (error) {
            // Handle error (toast inside slice)
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="my-10">
            <h2 className="text-4xl my-2">Add your valuable comments here</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 md:max-w-[70%]">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="rating" className="font-bold">Rating</label>
                    <StarRating rating={rating} setRating={setRating} />
                </div>
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="comment" className="font-bold">Comment</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="border rounded p-2"
                        placeholder="Share your experience..."
                        rows="10"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading} // Disable button during submission
                    className={`bg-blue-600 text-white p-2 rounded sm:w-[fit-content] hover:bg-blue-700 ${
                        isLoading ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                >
                    {isLoading ? 'Submitting...' : 'Submit Review'} {/* Show loader text */}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
