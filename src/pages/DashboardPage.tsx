import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
      <img 
          src="/logo-lawrence.png" 
          alt="Lawrence University Logo" 
          className="h-32 w-auto mx-auto mb-4"
        />

        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Find On LU
        </h2>


        <p className="text-lg text-gray-600">
          Your campus lost & found and marketplace platform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📱</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Lost & Found</h3>
          <p className="text-gray-600 mb-6">Report lost items or help others find theirs</p>
          <Link to="/lost-found">
            <Button className="w-full">Browse Lost & Found</Button>
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🛒</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Thrift Store</h3>
          <p className="text-gray-600 mb-6">Buy and sell items with fellow students</p>
          <Link to="/thrift">
            <Button className="w-full">Browse Thrift Store</Button>
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Quick Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">12</div>
            <div className="text-sm text-gray-600">Lost Items</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Found Items</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">25</div>
            <div className="text-sm text-gray-600">Items for Sale</div>
          </div>
        </div>
      </div>
    </div>
  );
}