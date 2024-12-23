import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../context/context';
import { Link } from 'react-router-dom';

const items = [
  {
    label: 'Home',
    to: '/dashboard',
  },
  {
    label: 'Add Listing',
    to: '/listing',
  },
  {
    label: 'Orders',
    to: '/orders',
  },
];

const Navbar = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  // logout here
  const Signout = () => {
    firebase.logout();
    navigate('/');
    console.log('User is logged out');
  };

  return (
    <div className="p-8">
      <section
        className="w-full h-auto rounded-lg 
                      bg-white bg-opacity-30 
                      backdrop-filter backdrop-blur-md 
                      border border-white border-opacity-30 
                      shadow-lg p-4 "
      >
        <ul className="flex flex-col md:flex-row w-full md:w-auto justify-center md:justify-evenly items-center space-y-4 md:space-y-0 text-xl font-normal text-white">
          {items.map((item, key) => (
            <li key={key}>
              <Link to={item.to}>
                {item.label}
              </Link>
            </li>
          ))}
          <li onClick={Signout} className="cursor-pointer hover:underline">
            Logout
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Navbar;
