const ListingCard = ({ listing, tax }) => {
    return (
        <div href={`/listings/${listing._id}`} key={listing._id} className="w-full md:max-w-xs h-96 border border-gray-200 rounded-lg overflow-hidden flex flex-col items-center text-gray-900 no-underline">
            <div className="h-48 w-full flex items-center justify-center overflow-hidden">
                <img
                    src={listing.image.url}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="text-lg font-semibold">{listing.title}</h3>
                <p className="">{listing.description}</p>
                <div className="flex items-center mt-auto">
                    {
                        tax ?
                            (<span className="text-lg font-semibold text-gray-800">
                                ₹{listing.priceAfterTax.toLocaleString('en-IN')}
                            </span>) :
                            (<span className="text-lg font-semibold text-gray-800">
                                ₹{listing.price.toLocaleString('en-IN')}
                            </span>)
                    }
                    <span className="ml-2 text-sm text-gray-500">
                        / night
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
