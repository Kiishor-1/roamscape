import { FaStar } from "react-icons/fa";

const ReviewBar = ({ reviews }) => {
    // Calculate rating counts and average rating
    const calculateRatings = (reviews) => {
        const counts = Array(5).fill(0); // Initialize an array to hold counts for each rating
        let totalRating = 0;

        reviews.forEach((review) => {
            const rating = review.rating; // Assuming review has a rating property
            if (rating >= 1 && rating <= 5) {
                counts[rating - 1] += 1; // Increment count for the corresponding rating
                totalRating += rating; // Sum up the ratings for average calculation
            }
        });

        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0; // Calculate average rating

        return { ratingCounts: counts.reverse(), averageRating, totalReviews };
    };

    const { ratingCounts, averageRating, totalReviews } = calculateRatings(reviews);

    return (
        totalReviews > 0 && (
            <div className="sm:max-w-[50%] mx-auto flex flex-col gap-3 p-4">
                <h5 className="text-2xl text-center font-semibold">Customer Reviews</h5>
                <div className="font-bold flex items-center bg-gray-200 rounded-full py-3 px-6 w-[80%] mx-auto justify-center gap-2">
                    {averageRating}
                    <FaStar className="text-yellow-500 ml-1" />
                    <span>Out of 5</span>
                </div>
                <div className="mt-2">
                    {ratingCounts.map((count, index) => {
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0; // Calculate percentage for the bar
                        return (
                            <div key={index} className="flex items-center mb-2">
                                <div className="flex items-baseline mr-2">
                                    <span className="font-bold">{5 - index}</span>
                                    <FaStar className="text-yellow-500 ml-1" />
                                </div>
                                <div className="relative sm:w-[70%] w-[60%] mx-auto h-2 bg-gray-300 rounded-full">
                                    <div className={`absolute top-0 left-0 h-full bg-yellow-500 rounded-full`} style={{ width: `${percentage}%` }} />
                                </div>
                                <p className="flex items-center text-sm">{count} Ratings</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    );
};

export default ReviewBar;

