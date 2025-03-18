import React, { useState, useEffect, useRef, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import GenresFilter from "../components/GenresFilter";
import axios from "axios";

const API_KEY = "990320f9b8c3834e6d5063c184ec5986";

const Movies = ({ movies, genres }) => {
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreMovies();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreMovies = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const url = selectedGenre
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=${nextPage}`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${nextPage}`;

      const res = await axios.get(url);
      if (res.data.results.length === 0) setHasMore(false);
      setFilteredMovies((prev) => [...prev, ...res.data.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Error loading more movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreSelect = async (genreId) => {
    try {
      setSelectedGenre(genreId);
      setCurrentPage(1);
      setHasMore(true);
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=1`
      );
      setFilteredMovies(res.data.results);
    } catch (err) {
      console.error("Genre filter failed", err);
    }
  };

  const displayMovies =
    filteredMovies.length > 0 || selectedGenre ? filteredMovies : movies;

  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-4">All Movies</h2>

      <GenresFilter genres={genres} onSelect={handleGenreSelect} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {displayMovies.map((movie, index) => {
          if (index === displayMovies.length - 1) {
            return (
              <div ref={lastMovieRef} key={movie.id}>
                <MovieCard item={movie} type="movie" />
              </div>
            );
          }
          return <MovieCard key={movie.id} item={movie} type="movie" />;
        })}
      </div>

      {!hasMore && !loading &&(
        <p className="text-gray-400 text-center mt-6">No more movies to movies...</p>
      )}

      {loading && 
      <p className="text-gray-400 text-center mt-6">Loading more movies...</p>}
    </div>
  );
};

export default Movies;
