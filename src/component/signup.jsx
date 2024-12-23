import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/context';

function SignUp() {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signing up the user...');
    try {
      await firebase.SignUpwithEandP(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await firebase.SignUpwithGoogle();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div
        className="w-full max-w-full sm:max-w-md p-8 sm:p-10 rounded-lg 
                      bg-white bg-opacity-30 
                      backdrop-filter backdrop-blur-md 
                      border border-white border-opacity-30 
                      shadow-lg"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-white">
          Create the Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-1"
            >
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white bg-opacity-80 text-gray-800 placeholder-gray-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-1"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         bg-white bg-opacity-80 text-gray-800 placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-custom-gradient text-white py-2 px-4 rounded-md 
                       focus:outline-none hover:opacity-90 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300 opacity-50" />
          <span className="mx-2 text-gray-200">OR</span>
          <hr className="flex-grow border-gray-300 opacity-50" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center bg-custom-gradient text-white py-2 px-4 rounded-md 
                     focus:outline-none hover:opacity-90 transition duration-300"
        >
          Sign Up with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-200">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-300 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
