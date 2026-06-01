import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}