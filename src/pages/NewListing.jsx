// export default NewListing;
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';
import { createListing , fetchAllListings} from '../store/listingSlice'; // Import createListing action

const NewListing = () => {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();
  const {token, currUser} = useSelector((state)=>state.user);

  const MAPBOX_API_KEY = import.meta.env.VITE_REACT_APP_MAPBOX_API_KEY;

  useEffect(()=>{
    if(!token || !currUser){
      navigate("/login");
    }
  },[token, currUser, navigate])


  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    price: '',
    location: '',
    country: '',
    reviews: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert the price to a number if the input name is "price"
    const newValue = name === "price" ? Number(value) : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    // console.log(formData)
  };

  const handleImageUpload = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };


  const fetchCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_API_KEY}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates;
        return {
          type: "Point", // Geometry type for a point location
          coordinates: coordinates, // Longitude and latitude
        };
      } else {
        throw new Error('No coordinates found for the location');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating Listing...");

    try {
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await uploadImageToCloudinary(formData.image);
      } else {
        imageUrl = 'https://res.cloudinary.com/dkvrdo3z1/image/upload/v1726414397/i9x1scsiyc5itodo2ela.jpg';
      }

      const geometry = await fetchCoordinates(formData.location);

      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        location: formData.location,
        country: formData.country,
        image: { url: imageUrl, filename: "listingimage" },
        reviews: [],
        geometry
      };
      // console.log(dataToSubmit)
      const action = await dispatch(createListing(dataToSubmit));

      toast.dismiss(toastId);
      if (createListing.fulfilled.match(action)) {
        await dispatch(fetchAllListings());
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.dismiss(toastId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:max-w-[80%] mx-auto">
      <div className="w-full">
        <h3 className="text-2xl">Create A New Listing</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col my-2">
            <label htmlFor="title" className="mb-2">Title</label>
            <input
              type="text"
              className="w-full border px-5 py-2 rounded-md"
              name="title"
              placeholder="Set a catchy title here"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <div className="valid-feedback">Looks Good!</div>
          </div>

          <div className="flex flex-col my-2">
            <label htmlFor="description" className="mb-2">Description</label>
            <textarea
              className="w-full border px-5 py-2 rounded-md"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <div className="invalid-feedback">Enter short and crisp description</div>
          </div>

          <div className="flex flex-col my-2">
            <label htmlFor="category" className="py-2">Select category</label>
            <select
              className="w-full border px-5 py-2 rounded-md"
              name="category"
              value={formData.category}
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

          <div className="flex flex-col my-2">
            <label htmlFor="image" className="py-2">Upload Image</label>
            <div className="w-full border px-5 py-2 rounded-md">
              <input
                type="file"
                className="w-full h-full"
                name="image"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="flex flex-col my-2">
            <label htmlFor="price" className="py-2">Price</label>
            <input
              type="number"
              className="w-full border px-5 py-2 rounded-md"
              name="price"
              placeholder="Set Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Required input field</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='flex flex-col'>
              <label htmlFor="location" className="py-2">Location</label>
              <input
                type="text"
                className="w-full border px-5 py-2 rounded-md"
                name="location"
                placeholder="Enter Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Required input field</div>
            </div>

            <div className='flex flex-col'>
              <label htmlFor="country" className="py-2">Country</label>
              <input
                type="text"
                className="w-full border px-5 py-2 rounded-md"
                name="country"
                placeholder="Enter Country"
                value={formData.country}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Required input field</div>
            </div>
          </div>
          <button className="btn add_btn bg-red-500 text-white rounded-full mt-4 px-10 py-2">
            {loading ? 'Creating...' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewListing;
