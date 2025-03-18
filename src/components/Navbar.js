import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center border-b border-gray-800 shadow-sm">
      <h1 className="text-2xl font-bold text-red-600 tracking-widest">ANIMEX</h1>
      <div className="flex gap-6">
      <Link className="hover:text-red-500 transition" to="/">Home</Link>
      <Link  className="hover:text-red-500 transition" to="/movies">Movies</Link>
      <Link className="hover:text-red-500 transition" to="/series">Series</Link>
      <Link to="/anime">Anime</Link>

      <Link to="/animation">Animation</Link>
      </div>
    </nav>
  );
};

export default Navbar;