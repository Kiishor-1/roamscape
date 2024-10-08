import { useState } from 'react';

const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <svg
                        key={ratingValue}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 cursor-pointer ${ratingValue <= (hover || rating) ? 'text-yellow-500' : 'text-gray-400'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.965a1 1 0 00.95.69h4.228c.969 0 1.371 1.24.588 1.81l-3.42 2.486a1 1 0 00-.364 1.118l1.286 3.965c.3.921-.755 1.688-1.54 1.118L10 13.527l-3.42 2.486c-.784.57-1.84-.197-1.54-1.118l1.286-3.965a1 1 0 00-.364-1.118L3.542 9.392c-.784-.57-.38-1.81.588-1.81h4.228a1 1 0 00.95-.69l1.286-3.965z" />
                    </svg>
                );
            })}
        </div>
    );
};

export default StarRating;
