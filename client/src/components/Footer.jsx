import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWarehouse,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-100-900 text-white py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left - Copyright */}
        <div className="text-center md:text-left text-black">
          <p className="text-sm opacity-70 ">
            &copy; Blink Commerce Private Limited, 2016-2025
          </p>
          <p className="text-xs opacity-60">All rights reserved.</p>
        </div>

        {/* Middle - Warehouse Button */}
        <Link
          to="/warehosue-List"
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold text-sm rounded-2xl shadow-lg hover:scale-105 hover:from-teal-600 hover:to-blue-700 transition-all duration-300"
        >
          <FaWarehouse className="mr-2 text-lg" />
          Go to Warehouse Page
        </Link>

        {/* Right - Social Media */}
        <div className="flex items-center gap-4 text-xl text-black">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-transform hover:scale-110"
          >
            <FaFacebook />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-transform hover:scale-110"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-transform hover:scale-110"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-transform hover:scale-110"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
