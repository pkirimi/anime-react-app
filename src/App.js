import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Search from "./components/Search";
import DetailsPage from "./pages/DetailsPage";
import Animation from "./pages/Animation";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Anime from "./pages/Anime";

const API_KEY = `990320f9b8c3834e6d5063c184ec5986`;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [trending, setTrending] = useState([]);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

 

const fetchGenres = async () => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );
    setGenres(res.data.genres);
  } catch (err) {
    console.error("Genres fetch failed:", err);
  }
};


  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`
      );
      setSeries(response.data.results);
    } catch (error) {
      console.error("Error fetching series:", error);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`
      );
      setTrending(res.data.results);
    } catch (err) {
      console.error("Trending fetch failed:", err);
    }
  };
  

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`
      );
      setSearchResults(response.data.results);
      navigate("/search");
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchSeries();
    fetchTrending();
    fetchGenres();
  }, []);

  

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <Search onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Home movies={movies} series={series} trending={trending} genres={genres} />} />
          <Route path="/movies" element={<Movies movies={movies} genres={genres} />} />
          <Route path="/series" element={<Series series={series} genres={genres} />} />
          <Route path="/search" element={<Home movies={searchResults} series={[]} />} />
          <Route path="/animation" element={<Animation />} />
         <Route path="/details/:type/:id" element={<DetailsPage />} />
         <Route path="/anime" element={<Anime />} />
        </Routes>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default App;
