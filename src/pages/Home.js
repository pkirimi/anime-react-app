import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const API_KEY = "990320f9b8c3834e6d5063c184ec5986";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    // Fetch trending items
    const fetchTrending = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
        );
        setTrending(res.data.results);
      } catch (err) {
        console.error("Error fetching trending items:", err);
      }
    };

    // Fetch popular movies
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
        );
        setMovies(res.data.results);
      } catch (err) {
        console.error("Error fetching popular movies:", err);
      }
    };

    // Fetch popular series
    const fetchSeries = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`
        );
        setSeries(res.data.results);
      } catch (err) {
        console.error("Error fetching popular series:", err);
      }
    };

    fetchTrending();
    fetchMovies();
    fetchSeries();
  }, []);

  return (
    <div className="space-y-10">
      {/* Trending Section */}
      <section>
        <h2 className="text-3xl font-bold text-red-600 mb-4">🔥 Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {trending && trending.length > 0 ? (
            trending.map((item) => (
              <MovieCard
                key={item.id}
                item={item}
                type={item.media_type || "movie"} // fallback to "movie"
              />
            ))
          ) : (
            <p className="text-gray-400">No trending items found.</p>
          )}
        </div>
      </section>

      {/* Popular Movies */}
      <section>
        <h2 className="text-3xl font-bold text-red-600 mb-4">🎬 Popular Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {movies && movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard key={movie.id} item={movie} type="movie" />
            ))
          ) : (
            <p className="text-gray-400">No movies available.</p>
          )}
        </div>
      </section>

      {/* Popular Series */}
      <section>
        <h2 className="text-3xl font-bold text-red-600 mb-4">📺 Popular Series</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {series && series.length > 0 ? (
            series.map((tv) => (
              <MovieCard key={tv.id} item={tv} type="tv" />
            ))
          ) : (
            <p className="text-gray-400">No series available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;