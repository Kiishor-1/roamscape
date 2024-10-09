import { useState } from 'react';
import { FaTimes, FaBars } from "react-icons/fa";
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch, useSelector } from 'react-redux';
import { searchListings } from '../../store/listingSlice';
import Logo2 from '../../assets/images/wander1.png';
import { logout } from '../../store/userSlice';
import toast from 'react-hot-toast';

export default function Navbar({ setSearch }) { // Accept setSearch as a prop
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { currUser } = useSelector((state) => state.user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Set search term in App state
      setSearch(searchQuery);
      dispatch(searchListings(searchQuery)); // Dispatch search action
      navigate('/'); // Redirect to the "/" route
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch((logout())); // Dispatch logout and handle success
      toast.success('Logout successful');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.log(error);
      toast.error('Logout failed'); // Handle any error during logout
    }
  };

  return (
    <div className="flex lg:flex-row flex-col lg:items-center justify-between py-2 sticky top-0 z-[5] bg-white shadow-md sm:px-4 lg:px-8">
      <Link to={'/'} onClick={() => setSearch("")}>
        <img src={Logo2} className="w-20" alt="logo" />
      </Link>

      <div className="lg:hidden absolute right-4 top-[1.7rem]">
        <button onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      <div className={`nav-links ${isMenuOpen ? 'block' : 'hidden'} lg:flex flex items-center gap-3 borde shadow-[1px_1px_10px_-3px_gray] rounded-[2rem] px-5 py-2`}>
        <p className="text-sm h-full border-e-2 pe-2 hidden lg:block">Anywhere</p>
        <p className="text-sm h-full border-e-2 pe-2 hidden lg:block">Any Week</p>
        <form onSubmit={handleSearch} className="lg:w-[fit-content] w-full flex items-center justify-between">
          <input
            placeholder="Search Destination"
            type="text"
            className="outline-none w-full px-2 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className='h-[2.5rem] w-[3rem] flex items-center justify-center rounded-full text-white bg-red-500'>
            <FaMagnifyingGlass />
          </button>
        </form>
      </div>

      <div className={`nav-btn ${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:gap-4 px-2`}>
        <Link to={'/new'} className="block py-2 lg:py-0">Host A Stay</Link>
        {
          currUser ?
            (
              <div className="flex-col flex lg:flex-row items-start gap-2">
                <Link to={"/dashboard"}>Dashboard</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              < >
                <Link to={'/signup'} className="block py-2 lg:py-0">Signup</Link>
                <Link to={'/login'} className="block py-2 lg:py-0">Login</Link>
              </>
            )
        }
      </div>
    </div>
  );
}

