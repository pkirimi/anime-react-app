import React from "react";

const GenresFilter = ({ genres = [], onSelect }) => {
  if (!genres || genres.length === 0) {
    return <p className="text-gray-400 mb-4">No genres available.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {genres.map((genre) => (
        <button
          key={genre.id}
          className="px-4 py-2 bg-gray-800 hover:bg-red-600 rounded text-sm"
          onClick={() => onSelect(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenresFilter;