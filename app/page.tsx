import SaasListingForm from '@/components/saas-listing-form';
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="">
        <div className="max-w-6xl mx-auto px-4 border-b border-gray-200">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img src="/Green Black Logotype.svg" alt="Stackfix" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SaasListingForm />
      </main>
    </div>
  );
};

export default Home;