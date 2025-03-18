import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MovieCard = ({ item, type }) => {
     const [movieDetails, setMovieDetails] = useState(null);
      const [loading, setLoading] = useState(false);


  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${item.id}?api_key=990320f9b8c3834e6d5063c184ec5986&append_to_response=videos,reviews`
        );
        setMovieDetails(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchMovies();
    }, [item.id]);

  return (
    <Link to={`/details/${type}/${item.id}`}>
      <div className="bg-gray-900 p-4 rounded-lg hover:scale-105 transition-transform duration-300">
        <img
          src={poster}
          alt={item.title || item.name}
          className="w-full h-[350px] object-cover rounded"
        />
        <h3 className="mt-2 text-lg font-semibold truncate">
          {item.title || item.name}
        </h3>
        <p className="text-sm text-gray-400 mb-1">
          {item.release_date || item.first_air_date}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {item.overview || "No description available."}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;