import { FaFacebookF, FaTwitter } from 'react-icons/fa';
import LoginLogo from '../assets/images/login1.png';
import Logo from '../assets/images/wander1.png';
import { Link } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { loginUser } from '../store/userSlice';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormdata] = useState({
        username: "",
        password: "",
    });

    const {isLoading,currUser, token } = useSelector((state) => state.user);
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

    const handleLogin = (e) => {
        e.preventDefault();
        const toastId = toast.loading('Wait a moment');
        dispatch(loginUser(formData))
            .then(() => toast.dismiss(toastId))
            .catch(() => toast.dismiss(toastId));
    };

    return (
        <div className="flex relative justify-center items-center min-h-screen bg-gray-100">
            <Link className='' to={"/"}>
                <img
                    src={Logo}
                    alt="Logo"
                    className='absolute top-4 left-4 w-24'
                />
            </Link>
            <div className="flex flex-col md:flex-row items-center bg-white py-8 md:rounded-lg md:h-[fit-content] h-screen max-w-6xl">
                <div className="md:w-1/2 mb-6 md:mb-0 md:mt-0 mt-4 flex flex-col items-center ">
                    <img
                        src={LoginLogo}
                        alt="Online Education"
                        className="md:w-1/2 w-1/3  h-auto p-4"
                        loading='lazy'
                    />
                </div>
                <div className="md:w-1/2  rounded-md md:p-12 p-4 w-ful">
                    <h2 className="text-2xl font-semibold text-center mb-6">Welcome</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                placeholder="Type Username"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                name='username'
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
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
                        <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                            {isLoading ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>
                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-4 text-gray-500">OR</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-md">
                            <FaFacebookF />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-md">
                            <MdEmail />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-md">
                            <FaTwitter />
                        </button>
                    </div>
                    <p className="text-center mt-4">
                        {`Don't have an account?`}{' '}
                        <Link to="/signup" className="text-indigo-600 hover:underline">
                            Signup
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
