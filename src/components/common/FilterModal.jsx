import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';
import { fetchFilteredListings } from '../../store/listingSlice'; // Import action

const FilterModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const [minPrice, setMinPrice] = useState(1000);
    const [maxPrice, setMaxPrice] = useState(200000);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        { category: 'Trending', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192525/filters/trending_i89iya.png', value: 'Trending' },
        { category: 'Rooms', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192525/filters/rooms_bq1s2w.png', value: 'Rooms' },
        { category: 'Farms', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/farms_x59e2n.png', value: 'Farms' },
        { category: 'Views', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/amazing_views_bmesg1.png', value: 'Views' },
        { category: 'Pools', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/amazing_pools_jwqeu5.png', value: 'Pools' },
        { category: 'Beachfront', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/beachfront_wcorzn.png', value: 'Beachfront' },
        { category: 'Tropicals', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192536/filters/tropical_rxbnit.png', value: 'Tropicals' },
        { category: 'Cabins', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/cabins_rppgb0.png', value: 'cabins' },
        { category: 'Lakefront', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/lakefront_or7fpb.png', value: 'Lakefront' },
        { category: 'Castles', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/castle_gij2g2.png', value: 'Castles' },
        { category: 'Countryside', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/countryside_hzw3nq.png', value: 'Countryside' },
        { category: 'Treehouse', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192526/filters/treehouse_naqpax.png', value: 'Treehouse' },
        { category: 'Pianos', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192525/filters/grand_pianos_nqfm3b.png', value: 'Pianos' },
        { category: 'Camping', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/camping_t6nk3f.png', value: 'Camping' },
        { category: 'Islands', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192525/filters/islands_d6d1fe.png', value: 'Islands' },
        { category: 'Casas', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/casas_dh3xsp.png', value: 'Casas' },
        { category: 'Arctic', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/Arctic_lawahv.png', value: 'Arctic' },
        { category: 'Beach', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/beach_aazkrd.png', value: 'Beach' },
        { category: 'Lake', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/lake_vrqwj8.png', value: 'Lake' }
    ];

    const handleCategoryChange = (value) => {
        setSelectedCategories((prev) =>
            prev.includes(value)
                ? prev.filter((category) => category !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchFilteredListings({
            category: selectedCategories.length > 0 ? selectedCategories.join(',') : '',
            minPrice,
            maxPrice
        }));
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} id='filterForm' className="w-full relative">
            <h2 className="text-lg font-bold mb-4 sticky top-0 bg-white mt-0 py-3 z-[60]">Filters</h2>
            <div className="mb-4">
                <label className="block text-sm font-semibold">Price Range</label>
                <p className="text-xs text-gray-500">Total prices for 5 nights before taxes</p>
                <div className="flex gap-2 mt-2">
                    <input
                        className="border p-2 rounded-md w-full"
                        type="number"
                        min="1000"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="text-gray-500">To</span>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="number"
                        max="2200000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold">Types of place</label>
                <p className="text-xs text-gray-500">Search rooms, entire homes, or any type of place</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-2">
                    {categories.map((category) => (
                        <label key={category.value} className="cursor-pointer flex flex-col items-center relative">
                            <img src={category.imgSrc} alt={category.category} className="h-10 w-10 mb-2" />
                            <span className="text-xs">{category.category}</span>
                            <input
                                type="checkbox"
                                className="absolute inset-0 w-4 h-4 opacity-0"
                                value={category.value}
                                checked={selectedCategories.includes(category.value)}
                                onChange={() => handleCategoryChange(category.value)}
                            />
                        </label>
                    ))}
                </div>
            </div>
            {selectedCategories.length > 0 && (
                <Draggable>
                    <div className="fixed top-4 right-4 z-[60] p-4 pt-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                        <h3 className="text-sm font-semibold sticky top-0 bg-white p-2">Selected Categories</h3>
                        {selectedCategories.map((category) => (
                            <div key={category} className="bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 mb-2">
                                {categories.find(c => c.value === category)?.category}
                            </div>
                        ))}
                    </div>
                </Draggable>
            )}
            <div className="flex justify-end gap-2 mt-6">
                <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded-md"
                    onClick={onClose}
                >
                    Close
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Apply
                </button>
            </div>
        </form>
    );
};

export default FilterModal;