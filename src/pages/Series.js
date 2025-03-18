import React, { useEffect, useState, useRef, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import axios from "axios";
import ScrollToTopButton from "../components/ScrollToTopButton";


const API_KEY = `990320f9b8c3834e6d5063c184ec5986`;

const Series = () => {
  const [series, setSeries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastSeriesRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreSeries();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreSeries = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${nextPage}`;

      const res = await axios.get(url);

      if (res.data.results.length === 0) {
        setHasMore(false);
      } else {
        setSeries((prev) => [...prev, ...res.data.results]);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error("Error loading more series:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreSeries();
  }, []);


  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-6">All Series</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {series.map((tv, index) => (
          <div
            ref={series.length === index + 1 ? lastSeriesRef : null}
            key={tv.id}
          >
            <MovieCard key={tv.id} item={tv} type="tv" />
          </div>
        ))}
      </div>

      {loading && <p className="text-gray-400 text-center mt-6">Loading more series...</p>}
      {!hasMore && !loading && (
        <p className="text-gray-400 text-center mt-6">No more series to load</p>
      )}
      
      <ScrollToTopButton />

    </div>
  );
};

export default Series;