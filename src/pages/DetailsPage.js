import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TMDB_API_KEY = "990320f9b8c3834e6d5063c184ec5986";

const DetailsPage = () => {
  const { id, type } = useParams(); // movie or tv
  const [details, setDetails] = useState(null);
  const [videoKey, setVideoKey] = useState("");
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [streamingUrl, setStreamingUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Fetch TMDB Details
        const res = await axios.get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${TMDB_API_KEY}`);
        setDetails(res.data);

        // 2. Get Trailer
        const trailerRes = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${TMDB_API_KEY}`);
        const trailer = trailerRes.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) setVideoKey(trailer.key);

        // 3. Reviews
        const reviewRes = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${TMDB_API_KEY}`);
        setReviews(reviewRes.data.results);

        // 4. Similar Titles
        const similarRes = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${TMDB_API_KEY}`);
        setSimilar(similarRes.data.results);

        // 5. Fetch FlixHQ Mapped ID from Consumet
        const metaRes = await axios.get(`https://api.consumet.org/meta/tmdb/${type}/${id}`);
        const flixId = metaRes.data.id;

        // 6. Get Episode ID from FlixHQ Info
        const infoRes = await axios.get(`https://api.consumet.org/meta/flixhq/info?id=${flixId}`);
        const firstEpisodeId = infoRes.data.episodes?.[0]?.id;

        // 7. Get Streaming Link from Episode
        if (firstEpisodeId) {
          const watchRes = await axios.get(`https://api.consumet.org/meta/flixhq/watch?episodeId=${firstEpisodeId}`);
          const source = watchRes.data.sources?.[0]?.url;
          setStreamingUrl(source);
        }
      } catch (err) {
        console.error("Error loading from Consumet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, type]);

  if (loading) return <p className="text-gray-400 p-4">Loading...</p>;
  if (!details) return <p className="text-gray-400 p-4">No details available.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{details.title || details.name}</h1>
      <p className="text-gray-400 mb-4">{details.overview}</p>

      {/*  Trailer */}
      {videoKey && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">🎞️ Trailer</h3>
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}`}
            title="Trailer"
            className="w-full h-[400px] rounded"
            allowFullScreen
          />
        </div>
      )}

      {/* FlixHQ Streaming Player */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">🎬 Watch Now</h3>
        {streamingUrl ? (
          <iframe
            src={streamingUrl}
            title="FlixHQ Player"
            className="w-full h-[500px] rounded"
            allowFullScreen
          />
        ) : (
          <p className="text-red-400">No streaming source available.</p>
        )}
      </div>

      {/* ✅ Reviews */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">📝 Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews available.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="mb-4 p-4 bg-gray-800 rounded">
              <p className="text-sm text-gray-300 mb-1">
                <strong>{review.author}</strong> - {review.created_at.slice(0, 10)}
              </p>
              <p className="text-sm text-gray-400">{review.content}</p>
            </div>
          ))
        )}
      </div>

      {/* ✅ Similar Titles */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">
          🎥 Similar {type === "tv" ? "Series" : "Movies"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {similar.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 p-3 rounded hover:scale-105 transition"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full h-[300px] object-cover rounded"
              />
              <h4 className="mt-2 text-sm font-medium truncate">
                {item.title || item.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
