import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import DebugRedux from '../DebugRedux';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <DebugRedux />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 