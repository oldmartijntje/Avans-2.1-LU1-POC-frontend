import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 mb-4">
          This is the about page. It's also accessible to everyone.
        </p>
        <p className="text-gray-600">
          Learn more about our application and services here.
        </p>
      </div>
    </div>
  );
};

export default About;
