const ListingDetails = ({ listing, totalPrice }) => (
  <div className="description mx-auto">
    <p className="text-lg font-semibold max-w-[40rem]">{listing.description}</p>
    <div className="prices my-4">
      <p className="show">
        <span className="show-price font-semibold">&#8377; {listing.price.toLocaleString('en-IN')}</span>
        /night
      </p>
    </div>
    <div className="propertyCard">
      <p>{listing.location}</p>
      <p>{listing.country}</p>
    </div>
  </div>
);

export default ListingDetails;
