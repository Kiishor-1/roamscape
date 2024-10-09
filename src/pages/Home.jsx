import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllListings } from "../store/listingSlice";
import Filter from "../components/common/Filter";
import ListingCard from "../components/core/HomeListings/ListingCard";
import { Link } from "react-router-dom";

const Home = ({ search }) => {
    const dispatch = useDispatch();
    const listings = useSelector((state) => state.listing.allListings);
    const isLoading = useSelector((state) => state.listing.isLoading);
    const [tax,setTax] = useState(false);
    const {currUser} = useSelector((state)=>state.user)

    // console.log(currUser)

    const handleTaxChange = ()=>{
        setTax(!tax);
    }

    useEffect(() => {
        if (!search) { // Only fetch all listings if there's no search term
            dispatch(fetchAllListings());
        }
    }, [dispatch, search]);


    // console.log("listings are ",listings);

    if (isLoading) {
        return (
            <div className="flex flex-wrap items-center justify-center">
                {[...Array(8)].map((_, id) => (
                    <div key={id} className="rounded-md w-[20rem] h-[20rem] gap-2 p-4 flex flex-col items-start">
                        <div className="rounded-[1rem] h-[8rem] w-full bg-gray-300"></div>
                        <div className="rounded-full h-[3rem] w-full bg-gray-300"></div>
                        <div className="rounded-full h-[3rem] w-full bg-gray-300"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <Filter isLoading={isLoading} tax={tax} handleTaxChange={handleTaxChange} />
            {search && (
                <h3 className="search_result">
                    Search results for: <span className="text-red-900 font-semibold text-xl uppercase">{search}</span>
                </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
                {listings.length === 0 ? (
                    <p className="text-gray-400 text-xl max-w-[20rem]">No Results Found</p>
                ) : (
                    listings.map((listing) => (
                        <Link to={`/listings/${listing._id?.$oid}`} key={listing._id?.$oid}>
                            <ListingCard listing={listing} tax={tax} />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
