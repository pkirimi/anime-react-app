import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Search movies or series..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-400 p-2 rounded text-black"
      />
      <button
        type="submit"
        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        Search
      </button>
    </form>
  );
};

export default Search;