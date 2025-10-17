import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Our App</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 mb-4">
          This is the home page. It's accessible to everyone, both anonymous and authenticated users.
        </p>
        <p className="text-gray-600">
          Navigate through the app using the menu above. Some pages require authentication.
        </p>
      </div>
    </div>
  );
};

export default Home;
