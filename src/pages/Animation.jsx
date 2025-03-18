import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

const API_KEY = `990320f9b8c3834e6d5063c184ec5986`;

const Animation = () => {
  const [animations, setAnimations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastAnimationRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreAnimations();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchMovieDetails = async (movieId) => {
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,reviews`;
    const res = await axios.get(detailsUrl);
    return res.data;
  };

  const loadMoreAnimations = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16&page=${nextPage}`;

      const res = await axios.get(url);

      if (res.data.results.length === 0) { setHasMore(false);
      } else {  
      setAnimations((prev) => [...prev, ...res.data.results]);
      setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error("Error loading more animations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreAnimations();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-6">🎞 Animated Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {animations.map((item, index) => (
          <div
            ref={index === animations.length - 1 ? lastAnimationRef : null}
            key={item.id}
          >
          <MovieCard item={item} type="movie" fetchMovieDetails={fetchMovieDetails} />
          </div>
        ))}
      </div>

      {loading && <p className="text-gray-400 text-center 
      mt-6">Loading...</p>}
      {!hasMore && !loading && (
        <p className="text-gray-400 text-center mt-6">
          No more movies to show.</p>
      )}
    </div>

  );
};

export default Animation;