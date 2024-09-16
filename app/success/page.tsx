"use client"
import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Application Submitted Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for applying to have your software tested. We{"'"}ve received your application and will review it shortly.
        </p>
        <p className="text-sm text-gray-500">
          If your product aligns with our standards, we{"'"}ll be in touch soon with next steps.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}