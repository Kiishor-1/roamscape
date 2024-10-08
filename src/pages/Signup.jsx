import { FaTwitter } from 'react-icons/fa';
import { FaFacebookF } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/wander1.png';
import Welcome from '../assets/images/welcome.png';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/userSlice';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",  // New fields
        lastName: "",   // New fields
        email: "",      // New fields
        bio: "",        // New fields
    });

    const { isLoading, error, currUser, token } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currUser && token) {
            navigate('/dashboard'); // Redirect after successful login
        }
    }, [currUser, token, navigate]);

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormdata((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSignup = (e) => {
        e.preventDefault();
        const toastId = toast.loading('Wait a moment');

        // Dispatch the action and handle the promise
        dispatch(registerUser(formData))
            .then((action) => {
                toast.dismiss(toastId);

                // Check if the action is fulfilled and perform redirection
                if (action.meta.requestStatus === 'fulfilled') {
                    navigate('/login');  // Redirect to the login page
                }
            })
            .catch(() => toast.dismiss(toastId));
    };

    return (
        <div className="flex relative justify-center items-center min-h-screen bg-gray-100">
            <Link to={"/"}>
                <img
                    src={Logo}
                    alt="Logo"
                    className='absolute top-4 left-4 w-24'
                />
            </Link>
            <div className="flex flex-col md:flex-row items-center bg-white px-8 py-4 rounded-lg shadow-lg max-w-6xl">
                <div className="md:w-1/2 mb-6 md:mb-0 flex flex-col items-center">
                    <img
                        src={Welcome}
                        alt="Online Education"
                        className="w-1/2 h-auto p-4"
                        loading='lazy'
                    />
                    <div className="">
                        <div className="flex justify-center space-x-4">
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <FaFacebookF />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <MdEmail />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <FaTwitter />
                            </button>
                        </div>
                        <p className="text-center mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-600 hover:underline">
                                Log In
                            </Link>
                        </p>
                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-4 text-gray-500">OR</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 sm:shadow-[0] shadow-md rounded-md p-12 w-full">
                    <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="flex lg:flex-row flex-col items-center gap-3">
                            <div className='w-full'>
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    name='firstName'
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='w-full'>
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    name='lastName'
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="flex lg:flex-row flex-col items-center gap-3">
                            <div className='w-full'>
                                <label className="block text-gray-700">Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter Username"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    name='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='w-full'>
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700">Bio</label>
                            <textarea
                                placeholder="Tell something about yourself"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                name='bio'
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Existing Fields */}
                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
