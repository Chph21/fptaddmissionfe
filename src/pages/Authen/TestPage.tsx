import React from 'react';
import { Link } from 'react-router-dom';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Test Page - Routing Works!
        </h1>
        <p className="text-gray-600 mb-6">
          Nếu bạn thấy trang này, routing đang hoạt động bình thường.
        </p>
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
          >
            Đăng nhập
          </Link>
          <Link 
            to="/register" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Đăng ký
          </Link>
          <Link 
            to="/" 
            className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 