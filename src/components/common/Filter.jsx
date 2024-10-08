import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { useRef, useState, useEffect } from "react";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import Modal from './Modal';
import FilterModal from './FilterModal';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchFilteredListings } from "../../store/listingSlice";

const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;

const Filter = ({tax, handleTaxChange}) => {
    const filtersRef = useRef(null);
    const [showFilterModal, setShowFilterModal] = useState(false); // Modal state
    const [listingCategory, setListingCategory] = useState([]); // Updated state
    const isLoading = useSelector((state) => state.listing.isLoading);
    const dispatch = useDispatch();

    const scrollLeft = () => {
        filtersRef.current.scrollBy({
            left: -500,
            behavior: 'smooth',
        });
    };

    const scrollRight = () => {
        filtersRef.current.scrollBy({
            left: 500,
            behavior: 'smooth',
        });
    };

    const categories = [
        { category: 'Trending', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192525/filters/trending_i89iya.png' },
        { category: 'Rooms', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192525/filters/rooms_bq1s2w.png' },
        { category: 'Farms', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/farms_x59e2n.png' },
        { category: 'Views', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/amazing_views_bmesg1.png' },
        { category: 'Pools', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/amazing_pools_jwqeu5.png' },
        { category: 'Beachfront', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/beachfront_wcorzn.png' },
        { category: 'Tropicals', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192526/filters/tropical_rxbnit.png' },
        { category: 'Cabins', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/cabins_rppgb0.png' },
        { category: 'Lakefront', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/lakefront_or7fpb.png' },
        { category: 'Castles', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/castle_gij2g2.png' },
        { category: 'Countryside', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/countryside_hzw3nq.png' },
        { category: 'Treehouse', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192526/filters/treehouse_naqpax.png' },
        { category: 'Pianos', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192525/filters/grand_pianos_nqfm3b.png' },
        { category: 'Camping', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/camping_t6nk3f.png' },
        { category: 'Islands', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192525/filters/islands_d6d1fe.png' },
        { category: 'Casas', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/casas_dh3xsp.png' },
        { category: 'Arctic', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/Arctic_lawahv.png' },
        { category: 'Beach', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192523/filters/beach_aazkrd.png' },
        { category: 'Lake', imgSrc: 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726192524/filters/lake_vrqwj8.png' }
    ];

    const handleCategory = (category) => {
        setListingCategory([category]); // Set only the clicked category
        dispatch(fetchFilteredListings({ category })); // Fetch listings for the selected category
    };

    return (
        <div className="flex lg:flex-row flex-col items-center justify-between py-6">
            <div className="flex items-center lg:max-w-[70%] w-full">
                {/* Left scroll button */}
                <button onClick={scrollLeft} className="scroll-btn text-3xl px-2">
                    <IoIosArrowDropleft />
                </button>

                {/* Filter categories */}
                <div id="filters" ref={filtersRef} className="flex overflow-x-scroll scrollbar-hide">
                    {isLoading ? (
                        // Skeleton loading for categories
                        <div className="flex space-x-2">
                            {[...Array(15)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-gray-300 h-[1.5rem] w-[1.5rem] rounded-full mb-2"></div>
                                    <div className="bg-gray-300 h-[0.8rem] w-[4rem] rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        categories.map((filter, index) => (
                            <div
                                key={index}
                                className="filter cursor-pointer mx-2 hover:border-b-2 px-2 py-2 transition-hover duration-300"
                                onClick={() => handleCategory(filter.category)}
                            >
                                <div className="">
                                    <img className="h-[1.5rem] w-[1.5rem]" src={filter.imgSrc} alt={filter.category} loading="lazy" />
                                </div>
                                <p className="text-[0.7rem]">{filter.category}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Right scroll button */}
                <button onClick={scrollRight} className="scroll-btn text-3xl px-2">
                    <IoIosArrowDropright />
                </button>
            </div>

            <div className="w-full md:flex-1 flex items-center gap-1 p-1">
                {/* Filter button to open modal */}
                <div
                    className="filter-btn font-bold border flex gap-1 items-center p-3 rounded-md cursor-pointer"
                    onClick={() => setShowFilterModal(true)}
                >
                    <FaSliders />
                    Filters
                </div>

                {/* Tax toggle */}
                <div className="border flex flex-wrap items-center gap-1 px-1 py-3">
                    <label className="text-sm" htmlFor="tax_switch">Display Total Before Taxes</label>
                    {tax ? (
                        <button onClick={handleTaxChange} className="text-2xl"><FaToggleOn /></button>
                    ) : (
                        <button onClick={handleTaxChange} className="text-2xl"><FaToggleOff /></button>
                    )}
                </div>
            </div>

            {/* Modal for Filter */}
            <Modal show={showFilterModal} onClose={() => setShowFilterModal(false)}>
                <FilterModal onClose={() => setShowFilterModal(false)} />
            </Modal>
        </div>
    );
};

export default Filter;
