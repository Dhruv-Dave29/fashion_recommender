import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    // { name: 'Solutions', path: '#solutions' },
    // { name: 'Case Studies', path: '#case-studies' },
    { name: 'Resources', path: '#resources' },
    { name: 'About', path: '#about' },
    { name: 'Blog', path: '#blog' },
    { name: 'Demo', path: '/demo' },
    { name: 'Contact Us', path: '#contact' },
  ];

  return (
    <nav className="bg-gradient-to-r from-white/90 to-purple-50/90 backdrop-blur-xl fixed w-full z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Sparkles className="h-8 w-8 text-purple-600 transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              HueMatch
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200
                  hover:text-purple-600 group ${
                    location.hash === item.path || location.pathname === item.path
                      ? 'text-purple-600'
                      : 'text-gray-600'
                  }`}
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-purple-600 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 transform w-64 bg-white shadow-lg transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-16 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-4 py-2 text-base font-medium rounded-lg transition-colors
                hover:bg-purple-50 hover:text-purple-600 ${
                  location.hash === item.path || location.pathname === item.path
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600'
                }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;