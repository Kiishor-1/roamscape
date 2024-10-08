const ListingTitleImage = ({ title, imageUrl }) => (
  <div className="text-center">
    <h3 className="text-2xl font-bold">{title}</h3>
    <img src={imageUrl} alt={title} className="w-full h-[25rem] object-cover object-center mx-auto my-4 rounded-lg" />
  </div>
);

export default ListingTitleImage;
