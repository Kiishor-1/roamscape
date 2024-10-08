import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews }) => {
    return (
        <div className="my-8 p-2">
            <h2 className="text-xl font-bold mb-4">All Reviews</h2>
            {reviews.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                    ))}
                </div>
            ) : (
                <div className="p-4 bg-gray-100 rounded-lg">
                    <h4 className="text-gray-500">No Reviews Yet</h4>
                </div>
            )}
        </div>
    );
};

export default ReviewList;



