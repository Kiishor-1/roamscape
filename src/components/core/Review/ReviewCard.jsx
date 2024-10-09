import React, { useState } from 'react';

const ReviewCard = ({ review }) => {
    const [showFullComment, setShowFullComment] = useState(false);

    const toggleComment = () => {
        setShowFullComment(!showFullComment);
    };

    const maxPreviewLength = 50;
    const isLongComment = review.comment.length > maxPreviewLength;

    return (
        <div className="bg-white shadow-md rounded-lg p-4 transition transform hover:scale-105">
            <div className="flex items-center mb-4">
                <img
                    src={`https://ui-avatars.com/api/?name=${review.user.firstName+" "+review.user?.lastName || "User"}`}
                    alt={review.user?.firstName}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 mr-4"
                    title={`${review?.user?.firstName} ${review?.user?.lastName}`}
                />
                <div>
                    <h3 className="font-semibold text-lg">{review.user.name}</h3>
                    <div className="flex items-center">
                        <span className="text-yellow-500">
                            {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                        </span>
                        <span className="ml-2 text-gray-500 text-sm">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <p className="mt-2 text-gray-700 text-sm">
                {showFullComment || !isLongComment
                    ? review.comment
                    : `${review.comment.slice(0, maxPreviewLength)}...`}
            </p>

            {isLongComment && (
                <button
                    className="mt-3 text-blue-500 hover:underline focus:outline-none"
                    onClick={toggleComment}
                >
                    {showFullComment ? 'Show less' : 'Read more'}
                </button>
            )}
        </div>
    );
};

export default ReviewCard;




