import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">College Connect</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/events" className="hover:underline">Events</Link>
            </li>
            <li>
              <Link to="/clubs" className="hover:underline">Clubs</Link>
            </li>
            <li>
              <Link to="/profile" className="hover:underline">Profile</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;