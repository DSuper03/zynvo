import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-full">
      <div className="p-4">
        <h2 className="text-lg font-bold">College Connect</h2>
      </div>
      <nav className="mt-4">
        <ul>
          <li>
            <Link to="/dashboard" className="block p-4 hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/clubs" className="block p-4 hover:bg-gray-700">
              Clubs
            </Link>
          </li>
          <li>
            <Link to="/events" className="block p-4 hover:bg-gray-700">
              Events
            </Link>
          </li>
          <li>
            <Link to="/profile" className="block p-4 hover:bg-gray-700">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;