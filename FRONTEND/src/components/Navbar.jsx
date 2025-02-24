import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 w-full"> {/* Ensures full width */}
      <div className="mx-auto w-full max-w-7xl flex justify-between items-center px-4 h-10"> 
        <Link to="/" className="text-white text-xl font-bold">
          Logo
        </Link>
        <div className="space-x-8 text-[1rem] mr-[2rem]">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/cognition" className="text-white hover:text-gray-300">
            Cognition
          </Link>
          <Link to="/calendar" className="text-white hover:text-gray-300">
            ML Calendar
          </Link>
          <Link to="/socialnetwork" className="text-white hover:text-gray-300">
            Social Network
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
