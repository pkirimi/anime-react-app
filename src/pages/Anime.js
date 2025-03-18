import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";


const Anime = () => {
  const [anime, setAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef();

  const lastAnimeRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreAnime();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreAnime = async () => {
    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const url = `https://api.jikan.moe/v3/top/anime/${nextPage}`;

      const res = await axios.get(url);

      if (res.data.top.length === 0) { setHasMore(false);
    } else {
      setAnime((prev) => [...prev, ...res.data.top]);
      setCurrentPage(nextPage);
    }
    } catch (err) {
      console.error("Error loading more anime:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreAnime();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-red-600 mb-6">📺 Top Anime</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {anime.length > 0 ? (
        anime.map((item, index) => (
          <div
            ref={index === anime.length - 1 ? lastAnimeRef : null}
            key={item.mal_id}
          >
            <MovieCard item={item} type="anime" />
          </div>
        ))
        ) : (
          <p className="text-gray-400 text-center mt-6">Loading anime...</p>
        )}
      </div>

      {loading && ( 
        <p className="text-gray-400 text-center mt-6">
        Loading more anime...</p>)}

        
        {!hasMore && !loading && (
          <p className="text-gray-400 text-center mt-6">No more anime to load</p>
        )}
    </div>
  );
};

export default Anime;
