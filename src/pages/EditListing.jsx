import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListing, editListing } from '../store/listingSlice';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

const EditListing = () => {
  const [listing, setListing] = useState({
    title: '',
    description: '',
    category: '',
    image: { url: '', filename: '' },
    price: '',
    location: '',
    country: '',
  });
  const [newImage, setNewImage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentListing, isLoading, error } = useSelector((state) => state.listing);
  const {currUser} = useSelector((state)=>state.user);
  const MAPBOX_API_KEY = import.meta.env.VITE_REACT_APP_MAPBOX_API_KEY; // Mapbox API key


  useEffect(()=>{
    if(currUser && currUser.userId === currentListing.owner._id){
      navigate(`/listings/${currentListing._id}`)
    }
  },[currUser, currentListing, navigate])

  // Fetch the listing data when the component mounts
  useEffect(() => {
    dispatch(fetchListing(id));
  }, [id, dispatch]);

  // Set local state when the Redux data changes
  useEffect(() => {
    if (currentListing) {
      setListing({
        ...currentListing,
        image: currentListing.image || { url: '', filename: '' },
      });
    }
  }, [currentListing]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "price" ? Number(value) : value;
    setListing((prevListing) => ({
      ...prevListing,
      [name]: newValue,
    }));
  };
  
  
  // Handle image upload
  const handleImageUpload = (e) => {
    setNewImage(e.target.files[0]);
  };

  // Function to fetch new coordinates for the location
  const fetchCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_API_KEY}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates;
        return {
          type: 'Point',
          coordinates: coordinates,
        };
      } else {
        throw new Error('No coordinates found for the location');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Please wait...')

    try {
      let updatedImageUrl = listing.image.url; // Keep current image if no new image is uploaded
      if (newImage) {
        updatedImageUrl = await uploadImageToCloudinary(newImage);
      }

      let geometry = currentListing.geometry; // Use existing geometry unless location is changed
      if (listing.location !== currentListing.location) {
        geometry = await fetchCoordinates(listing.location); // Fetch new coordinates if location is changed
      }

      const updatedListing = {
        ...listing,
        price: parseFloat(listing.price),
        image: {
          url: updatedImageUrl,
          filename: newImage ? newImage.name : listing.image.filename,
        },
        geometry, // Update geometry
      };

      // console.log("updated listing",updatedListing)

      // Dispatch the action
      const result = await dispatch(editListing({ id, updatedListing })).unwrap();

      const listingId = result._id?.$oid || result._id;
      if (listingId) {
        toast.dismiss(toastId)
        toast.success('Listing updated successfully!');
        navigate(`/listings/${listingId}`);
      } else {
        toast.dismiss(toastId)
        throw new Error('Failed to retrieve the updated listing ID.');
      }
    } catch (error) {
      toast.dismiss(toastId)
      console.error(error);
      // toast.error(error.response?.data || 'Failed to update listing');
    }
  };

  // Show an error message if there was an issue fetching the listing data
  // if (error) {
  //   return <div>Error loading listing: {error.message}</div>;
  // }

  // Display "Loading..." if the data is still being fetched
  // if (isLoading) {
  //   return (
  //     <div className='w-full min-h-[71vh] flex items-center justify-center'>
  //       <div className="loader"></div>
  //     </div>
  //   );
  // }

  // Display a message if no listing is found
  if (!listing) {
    return <div>No listing found</div>;
  }

  return (
    <div className="md:max-w-[80%] p-2 mx-auto my-4">
      <div className="col-md-8 mx-auto">
        <h3 className="heading text-xl font-bold mb-4">Edit Listing Detail</h3>
        <form onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div className="flex flex-col">
            <label htmlFor="title" className="py-2">Title</label>
            <input
              type="text"
              className="fw-full border px-5 py-2 rounded-md"
              name="title"
              value={listing.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="py-2">Description</label>
            <textarea
              className="fw-full border px-5 py-2 rounded-md"
              name="description"
              value={listing.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label htmlFor="category" className="py-2">Select category</label>
            <select
              className="w-full border px-5 py-2 rounded-md"
              name="category"
              value={listing.category || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Trending">Trending</option>
              <option value="Rooms">Rooms</option>
              <option value="Mountains">Mountains</option>
              <option value="Farms">Farms</option>
              <option value="Castle">Castle</option>
              <option value="Pools">Pools</option>
              <option value="Camping">Camping</option>
              <option value="Beachfront">Beachfront</option>
              <option value="Arctic">Arctic</option>
              <option value="Tropicals">Tropicals</option>
              <option value="Lake">Lake</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="image" className="py-2">Upload New Image</label>
            <input
              type="file"
              className="fw-full border px-5 py-2 rounded-md"
              onChange={handleImageUpload}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="price" className="py-2">Price</label>
            <input
              type="number"
              className="fw-full border px-5 py-2 rounded-md"
              name="price"
              value={listing.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='flex flex-col'>
              <label htmlFor="location" className="py-2">Location</label>
              <input
                type="text"
                className="fw-full border px-5 py-2 rounded-md"
                name="location"
                value={listing.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor="country" className="py-2">Country</label>
              <input
                type="text"
                className="fw-full border px-5 py-2 rounded-md"
                name="country"
                value={listing.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="my-4">
            <img src={listing.image.url} alt="Current Listing" className="rounded-md mb-4 h-[200px]" />
          </div>

          <button type="submit" className="btn add_btn bg-red-500 text-white rounded-full mt-4 px-4 py-2">
            {isLoading ? 'Saving...' : 'Edit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
