import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = '5de8c68b3d96ba6575feda4de8341c16';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function App() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    loadMovies();
  }, [currentPage, searchQuery, sortBy]);

  const loadMovies = async () => {
    let url;
    
    if (searchQuery) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
    } else {
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${currentPage}`;
      if (sortBy) {
        url += `&sort_by=${sortBy}`;
      }
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.trim());
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSort = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Render movie card
  const renderMovieCard = (movie) => {
    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '';
    const releaseDate = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

    return (
      <div key={movie.id} className="movie-card">
        <img src={posterUrl} alt={movie.title} className="movie-poster" />
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-release">Release: {releaseDate}</p>
          <p className="movie-rating">Rating: {rating}/10</p>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header>
        <h1>Movie Explorer</h1>
        <div className="controls">
          <input
            type="text"
            id="searchInput"
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <select id="sortSelect" value={sortBy} onChange={handleSort}>
            <option value="">Sort by</option>
            <option value="release_date.desc">Release Date (Asc)</option>
            <option value="release_date.asc">Release Date (Desc)</option>
            <option value="vote_average.desc">Rating (Asc)</option>
            <option value="vote_average.asc">Rating (Desc)</option>
          </select>
        </div>
      </header>

      <div className="container">
        <main>
          <div className="movies-container">
            {movies.map(renderMovieCard)}
          </div>
          <div className="pagination">
            <button
              id="prevBtn"
              onClick={handlePrevious}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            <span id="pageInfo">Page {currentPage} of {totalPages}</span>
            <button
              id="nextBtn"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;