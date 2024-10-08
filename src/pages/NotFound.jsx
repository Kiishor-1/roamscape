import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-88px)] bg-gray-100">
      {/* <img
        src="https://res.cloudinary.com/dkvrdo3z1/image/upload/v1234567890/not_found.png"
        alt="Page not found"
        className="w-64 h-64 mb-8"
        loading={"lazy"}
      /> */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Oops! Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        {`It looks like the page you're looking for doesn't exist.`}
      </p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
